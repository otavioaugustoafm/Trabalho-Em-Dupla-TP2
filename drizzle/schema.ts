import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  date,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Profissionais de saúde com categorias distintas
 */
export const healthProfessionals = mysqlTable("health_professionals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  category: mysqlEnum("category", ["medico", "fisioterapeuta", "psicologo"]).notNull(),
  
  // Campos específicos para Médico
  crm: varchar("crm", { length: 50 }),
  specialty: varchar("specialty", { length: 255 }),
  
  // Campos específicos para Fisioterapeuta
  crefito: varchar("crefito", { length: 50 }),
  
  // Campos específicos para Psicólogo
  crp: varchar("crp", { length: 50 }),
  
  // Campos comuns
  bio: text("bio"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthProfessional = typeof healthProfessionals.$inferSelect;
export type InsertHealthProfessional = typeof healthProfessionals.$inferInsert;

/**
 * Pacientes
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 20 }).notNull().unique(),
  dateOfBirth: date("dateOfBirth").notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Atendimentos vinculando paciente e profissional
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull().references(() => patients.id),
  professionalId: int("professionalId").notNull().references(() => healthProfessionals.id),
  appointmentDate: timestamp("appointmentDate").notNull(),
  status: mysqlEnum("status", ["agendado", "realizado", "cancelado"]).default("agendado").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Prescrições Médicas (para Médicos)
 */
export const medicalPrescriptions = mysqlTable("medical_prescriptions", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull().references(() => appointments.id),
  professionalId: int("professionalId").notNull().references(() => healthProfessionals.id),
  patientId: int("patientId").notNull().references(() => patients.id),
  medications: text("medications").notNull(), // JSON array of {name, dosage, frequency, duration}
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MedicalPrescription = typeof medicalPrescriptions.$inferSelect;
export type InsertMedicalPrescription = typeof medicalPrescriptions.$inferInsert;

/**
 * Planos de Reabilitação (para Fisioterapeutas)
 */
export const rehabilitationPlans = mysqlTable("rehabilitation_plans", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull().references(() => appointments.id),
  professionalId: int("professionalId").notNull().references(() => healthProfessionals.id),
  patientId: int("patientId").notNull().references(() => patients.id),
  diagnosis: text("diagnosis").notNull(),
  sessions: int("sessions").notNull(),
  exercises: text("exercises").notNull(), // JSON array of {name, description, repetitions, frequency}
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RehabilitationPlan = typeof rehabilitationPlans.$inferSelect;
export type InsertRehabilitationPlan = typeof rehabilitationPlans.$inferInsert;

/**
 * Evoluções de Sessão (para Psicólogos)
 */
export const sessionEvolutions = mysqlTable("session_evolutions", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull().references(() => appointments.id),
  professionalId: int("professionalId").notNull().references(() => healthProfessionals.id),
  patientId: int("patientId").notNull().references(() => patients.id),
  clinicalNotes: text("clinicalNotes").notNull(),
  emotionalState: varchar("emotionalState", { length: 255 }),
  treatmentPlan: text("treatmentPlan"),
  nextSessionDate: date("nextSessionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionEvolution = typeof sessionEvolutions.$inferSelect;
export type InsertSessionEvolution = typeof sessionEvolutions.$inferInsert;

/**
 * Exames Laboratoriais
 */
export const labExams = mysqlTable("lab_exams", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").references(() => appointments.id),
  patientId: int("patientId").notNull().references(() => patients.id),
  professionalId: int("professionalId").notNull().references(() => healthProfessionals.id),
  examType: varchar("examType", { length: 255 }).notNull(),
  requestDate: timestamp("requestDate").defaultNow().notNull(),
  result: text("result"),
  resultDate: timestamp("resultDate"),
  status: mysqlEnum("status", ["pendente", "realizado", "cancelado"]).default("pendente").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LabExam = typeof labExams.$inferSelect;
export type InsertLabExam = typeof labExams.$inferInsert;
