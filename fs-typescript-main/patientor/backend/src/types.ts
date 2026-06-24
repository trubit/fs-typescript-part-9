import { z } from "zod";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.iso.date(),
  ssn: z.string().min(1),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  occupation: z.string().min(1),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;
