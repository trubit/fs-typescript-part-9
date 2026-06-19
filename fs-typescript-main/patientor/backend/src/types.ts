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

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(1),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  occupation: z.string().min(1),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface Patient extends NewPatient {
  id: string;
}

export type PublicPatient = Omit<Patient, "ssn">;
