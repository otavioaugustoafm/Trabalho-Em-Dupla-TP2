import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Helper para verificar se o usuário é admin
function requireAdmin(ctx: any) {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas administradores podem acessar este recurso" });
  }
}

// Helper para verificar se o usuário é profissional
function requireProfessional(ctx: any) {
  if (!ctx.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário não autenticado" });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Health Professionals routes
  professionals: router({
    list: publicProcedure.query(async () => {
      return db.getHealthProfessionals();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const professional = await db.getHealthProfessionalById(input.id);
      if (!professional) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profissional não encontrado" });
      }
      return professional;
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          category: z.enum(["medico", "fisioterapeuta", "psicologo"]),
          crm: z.string().optional(),
          specialty: z.string().optional(),
          crefito: z.string().optional(),
          crp: z.string().optional(),
          bio: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createHealthProfessional({
          ...input,
          isActive: true,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          specialty: z.string().optional(),
          bio: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updateHealthProfessional(id, data);
      }),
  }),

  // Patients routes
  patients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireAdmin(ctx);
      return db.getPatients();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const patient = await db.getPatientById(input.id);
      if (!patient) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Paciente não encontrado" });
      }
      return patient;
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          cpf: z.string().min(11),
          dateOfBirth: z.date(),
          email: z.string().email().optional(),
          phone: z.string().min(1),
          address: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createPatient(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updatePatient(id, data);
      }),
  }),

  // Appointments routes
  appointments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role === "admin") {
        return db.getAppointments();
      }
      // Profissionais veem apenas seus agendamentos
      const professional = await db.getHealthProfessionals();
      const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
      if (userProfessional) {
        return db.getAppointments(userProfessional.id);
      }
      return [];
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      const appointment = await db.getAppointmentById(input.id);
      if (!appointment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agendamento não encontrado" });
      }

      // Verificar permissão
      if (ctx.user?.role !== "admin") {
        const professional = await db.getHealthProfessionals();
        const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
        if (!userProfessional || userProfessional.id !== appointment.professionalId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
      }

      return appointment;
    }),

    create: protectedProcedure
      .input(
        z.object({
          patientId: z.number(),
          professionalId: z.number(),
          appointmentDate: z.date(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createAppointment({
          ...input,
          status: "agendado",
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["agendado", "realizado", "cancelado"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updateAppointment(id, data);
      }),
  }),

  // Medical Prescriptions routes
  medicalPrescriptions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role === "admin") {
        return db.getMedicalPrescriptions();
      }
      const professional = await db.getHealthProfessionals();
      const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
      if (userProfessional) {
        return db.getMedicalPrescriptions(userProfessional.id);
      }
      return [];
    }),

    create: protectedProcedure
      .input(
        z.object({
          appointmentId: z.number(),
          professionalId: z.number(),
          patientId: z.number(),
          medications: z.string(), // JSON string
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createMedicalPrescription(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          medications: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updateMedicalPrescription(id, data);
      }),
  }),

  // Rehabilitation Plans routes
  rehabilitationPlans: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role === "admin") {
        return db.getRehabilitationPlans();
      }
      const professional = await db.getHealthProfessionals();
      const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
      if (userProfessional) {
        return db.getRehabilitationPlans(userProfessional.id);
      }
      return [];
    }),

    create: protectedProcedure
      .input(
        z.object({
          appointmentId: z.number(),
          professionalId: z.number(),
          patientId: z.number(),
          diagnosis: z.string().min(1),
          sessions: z.number().min(1),
          exercises: z.string(), // JSON string
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createRehabilitationPlan(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          diagnosis: z.string().optional(),
          sessions: z.number().optional(),
          exercises: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updateRehabilitationPlan(id, data);
      }),
  }),

  // Session Evolutions routes
  sessionEvolutions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role === "admin") {
        return db.getSessionEvolutions();
      }
      const professional = await db.getHealthProfessionals();
      const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
      if (userProfessional) {
        return db.getSessionEvolutions(userProfessional.id);
      }
      return [];
    }),

    create: protectedProcedure
      .input(
        z.object({
          appointmentId: z.number(),
          professionalId: z.number(),
          patientId: z.number(),
          clinicalNotes: z.string().min(1),
          emotionalState: z.string().optional(),
          treatmentPlan: z.string().optional(),
          nextSessionDate: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createSessionEvolution(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          clinicalNotes: z.string().optional(),
          emotionalState: z.string().optional(),
          treatmentPlan: z.string().optional(),
          nextSessionDate: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updateSessionEvolution(id, data);
      }),
  }),

  // Lab Exams routes
  labExams: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role === "admin") {
        return db.getLabExams();
      }
      const professional = await db.getHealthProfessionals();
      const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
      if (userProfessional) {
        return db.getLabExams(userProfessional.id);
      }
      return [];
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      const exam = await db.getLabExamById(input.id);
      if (!exam) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exame não encontrado" });
      }

      if (ctx.user?.role !== "admin") {
        const professional = await db.getHealthProfessionals();
        const userProfessional = professional.find((p) => p.userId === ctx.user?.id);
        if (!userProfessional || userProfessional.id !== exam.professionalId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
      }

      return exam;
    }),

    create: protectedProcedure
      .input(
        z.object({
          appointmentId: z.number().optional(),
          patientId: z.number(),
          professionalId: z.number(),
          examType: z.string().min(1),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        return db.createLabExam({
          ...input,
          status: "pendente",
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pendente", "realizado", "cancelado"]).optional(),
          result: z.string().optional(),
          resultDate: z.date().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireAdmin(ctx);
        const { id, ...data } = input;
        return db.updateLabExam(id, data);
      }),
  }),

  // Dashboard
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const stats = await db.getDashboardStats();
      return stats || { totalProfessionals: 0, todayAppointments: 0, pendingExams: 0 };
    }),
  }),
});

export type AppRouter = typeof appRouter;
