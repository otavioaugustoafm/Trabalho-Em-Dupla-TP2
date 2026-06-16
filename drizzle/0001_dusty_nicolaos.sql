CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`professionalId` int NOT NULL,
	`appointmentDate` timestamp NOT NULL,
	`status` enum('agendado','realizado','cancelado') NOT NULL DEFAULT 'agendado',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `health_professionals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`category` enum('medico','fisioterapeuta','psicologo') NOT NULL,
	`crm` varchar(50),
	`specialty` varchar(255),
	`crefito` varchar(50),
	`crp` varchar(50),
	`bio` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `health_professionals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lab_exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int,
	`patientId` int NOT NULL,
	`professionalId` int NOT NULL,
	`examType` varchar(255) NOT NULL,
	`requestDate` timestamp NOT NULL DEFAULT (now()),
	`result` text,
	`resultDate` timestamp,
	`status` enum('pendente','realizado','cancelado') NOT NULL DEFAULT 'pendente',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lab_exams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_prescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`professionalId` int NOT NULL,
	`patientId` int NOT NULL,
	`medications` text NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medical_prescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`cpf` varchar(20) NOT NULL,
	`dateOfBirth` date NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`address` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patients_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `rehabilitation_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`professionalId` int NOT NULL,
	`patientId` int NOT NULL,
	`diagnosis` text NOT NULL,
	`sessions` int NOT NULL,
	`exercises` text NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rehabilitation_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session_evolutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`professionalId` int NOT NULL,
	`patientId` int NOT NULL,
	`clinicalNotes` text NOT NULL,
	`emotionalState` varchar(255),
	`treatmentPlan` text,
	`nextSessionDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_evolutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_patientId_patients_id_fk` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_professionalId_health_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `health_professionals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `health_professionals` ADD CONSTRAINT `health_professionals_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lab_exams` ADD CONSTRAINT `lab_exams_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lab_exams` ADD CONSTRAINT `lab_exams_patientId_patients_id_fk` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lab_exams` ADD CONSTRAINT `lab_exams_professionalId_health_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `health_professionals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_prescriptions` ADD CONSTRAINT `medical_prescriptions_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_prescriptions` ADD CONSTRAINT `medical_prescriptions_professionalId_health_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `health_professionals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_prescriptions` ADD CONSTRAINT `medical_prescriptions_patientId_patients_id_fk` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rehabilitation_plans` ADD CONSTRAINT `rehabilitation_plans_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rehabilitation_plans` ADD CONSTRAINT `rehabilitation_plans_professionalId_health_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `health_professionals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rehabilitation_plans` ADD CONSTRAINT `rehabilitation_plans_patientId_patients_id_fk` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session_evolutions` ADD CONSTRAINT `session_evolutions_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session_evolutions` ADD CONSTRAINT `session_evolutions_professionalId_health_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `health_professionals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session_evolutions` ADD CONSTRAINT `session_evolutions_patientId_patients_id_fk` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;