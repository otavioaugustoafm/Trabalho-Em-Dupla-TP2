import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  healthProfessionals,
  patients,
  appointments,
  medicalPrescriptions,
  rehabilitationPlans,
  sessionEvolutions,
  labExams,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAdminUser() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Health Professionals queries
export async function getHealthProfessionals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(healthProfessionals).where(eq(healthProfessionals.isActive, true));
}

export async function getHealthProfessionalById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(healthProfessionals).where(eq(healthProfessionals.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createHealthProfessional(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create professional: database not available");
    return { insertId: null };
  }
  const result = await db.insert(healthProfessionals).values(data);
  return result;
}

export async function updateHealthProfessional(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update professional: database not available");
    return null;
  }
  return db.update(healthProfessionals).set(data).where(eq(healthProfessionals.id, id));
}

// Patients queries
export async function getPatients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(patients).orderBy(desc(patients.createdAt));
}

export async function getPatientById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createPatient(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create patient: database not available");
    return { insertId: null };
  }
  const result = await db.insert(patients).values(data);
  return result;
}

export async function updatePatient(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update patient: database not available");
    return null;
  }
  return db.update(patients).set(data).where(eq(patients.id, id));
}

// Appointments queries
export async function getAppointments(professionalId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (professionalId) {
    return db.select().from(appointments).where(eq(appointments.professionalId, professionalId)).orderBy(desc(appointments.appointmentDate));
  }
  
  return db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAppointment(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create appointment: database not available");
    return { insertId: null };
  }
  const result = await db.insert(appointments).values(data);
  return result;
}

export async function updateAppointment(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update appointment: database not available");
    return null;
  }
  return db.update(appointments).set(data).where(eq(appointments.id, id));
}

// Medical Prescriptions queries
export async function getMedicalPrescriptions(professionalId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (professionalId) {
    return db.select().from(medicalPrescriptions).where(eq(medicalPrescriptions.professionalId, professionalId)).orderBy(desc(medicalPrescriptions.createdAt));
  }
  
  return db.select().from(medicalPrescriptions).orderBy(desc(medicalPrescriptions.createdAt));
}

export async function createMedicalPrescription(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create prescription: database not available");
    return { insertId: null };
  }
  return db.insert(medicalPrescriptions).values(data);
}

export async function updateMedicalPrescription(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update prescription: database not available");
    return null;
  }
  return db.update(medicalPrescriptions).set(data).where(eq(medicalPrescriptions.id, id));
}

// Rehabilitation Plans queries
export async function getRehabilitationPlans(professionalId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (professionalId) {
    return db.select().from(rehabilitationPlans).where(eq(rehabilitationPlans.professionalId, professionalId)).orderBy(desc(rehabilitationPlans.createdAt));
  }
  
  return db.select().from(rehabilitationPlans).orderBy(desc(rehabilitationPlans.createdAt));
}

export async function createRehabilitationPlan(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create rehabilitation plan: database not available");
    return { insertId: null };
  }
  return db.insert(rehabilitationPlans).values(data);
}

export async function updateRehabilitationPlan(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update rehabilitation plan: database not available");
    return null;
  }
  return db.update(rehabilitationPlans).set(data).where(eq(rehabilitationPlans.id, id));
}

// Session Evolutions queries
export async function getSessionEvolutions(professionalId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (professionalId) {
    return db.select().from(sessionEvolutions).where(eq(sessionEvolutions.professionalId, professionalId)).orderBy(desc(sessionEvolutions.createdAt));
  }
  
  return db.select().from(sessionEvolutions).orderBy(desc(sessionEvolutions.createdAt));
}

export async function createSessionEvolution(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create session evolution: database not available");
    return { insertId: null };
  }
  return db.insert(sessionEvolutions).values(data);
}

export async function updateSessionEvolution(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update session evolution: database not available");
    return null;
  }
  return db.update(sessionEvolutions).set(data).where(eq(sessionEvolutions.id, id));
}

// Lab Exams queries
export async function getLabExams(professionalId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (professionalId) {
    return db.select().from(labExams).where(eq(labExams.professionalId, professionalId)).orderBy(desc(labExams.requestDate));
  }
  
  return db.select().from(labExams).orderBy(desc(labExams.requestDate));
}

export async function getLabExamById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(labExams).where(eq(labExams.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createLabExam(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lab exam: database not available");
    return { insertId: null };
  }
  return db.insert(labExams).values(data);
}

export async function updateLabExam(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lab exam: database not available");
    return null;
  }
  return db.update(labExams).set(data).where(eq(labExams.id, id));
}

// Dashboard stats
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalProfessionals: 0, todayAppointments: 0, pendingExams: 0 };
  
  const totalProfessionals = await db.select().from(healthProfessionals).where(eq(healthProfessionals.isActive, true));
  const todayAppointments = await db.select().from(appointments).where(
    and(
      eq(appointments.status, "agendado"),
      // Simplified: just get recent ones
    )
  );
  const pendingExams = await db.select().from(labExams).where(eq(labExams.status, "pendente"));
  
  return {
    totalProfessionals: totalProfessionals.length,
    todayAppointments: todayAppointments.length,
    pendingExams: pendingExams.length,
  };
}
