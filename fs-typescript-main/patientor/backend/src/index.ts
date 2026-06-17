import express, { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import diagnoses from "../data/diagnoses";
import patientsData from "../data/patients";
import { PublicPatient, NewPatient, Gender } from "./types";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isGender = (gender: unknown): gender is Gender => {
  return Object.values(Gender).includes(gender as Gender);
};

const parseName = (name: unknown, fieldName: string): string => {
  if (!isString(name)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return name;
};

const parseGender = (gender: unknown): Gender => {
  if (!isGender(gender)) {
    throw new Error("Incorrect or missing gender");
  }
  return gender;
};

app.post("/api/patients", (req: Request, res: Response) => {
  try {
    const { name, dateOfBirth, gender, occupation, ssn } = req.body;

    const newPatient: NewPatient = {
      name: parseName(name, "name"),
      dateOfBirth: parseName(dateOfBirth, "date of birth"),
      gender: parseGender(gender),
      occupation: parseName(occupation, "occupation"),
      ssn: parseName(ssn, "ssn"),
    };

    const patient = {
      id: uuid(),
      ...newPatient,
    };
    patientsData.push(patient);

    const publicPatient: PublicPatient = {
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      occupation: patient.occupation,
    };
    res.json(publicPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_req: Request, res: Response) => {
  res.send(diagnoses);
});

app.get("/api/patients", (_req: Request, res: Response) => {
  const publicPatients: PublicPatient[] = patientsData.map((patient) => {
    const { ssn, ...publicPatient } = patient;
    return publicPatient;
  });

  res.json(publicPatients);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
