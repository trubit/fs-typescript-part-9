import express, { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import diagnoses from "../data/diagnoses";
import patientsData, { resetPatients } from "../data/patients";
import { NewPatientSchema, NewEntrySchema, Patient, NonSensitivePatient, Entry } from "./types";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/testing/reset", (_req: Request, res: Response) => {
  resetPatients();
  res.status(204).end();
});

app.post("/api/patients/:id/entries", (req: Request, res: Response) => {
  const patient = patientsData.find((p) => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  const parsed = NewEntrySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }

  const newEntry = { id: uuid(), ...parsed.data } as Entry;
  patient.entries.push(newEntry);
  return res.json(newEntry);
});

app.get("/api/patients/:id", (req: Request, res: Response) => {
  const patient = patientsData.find((p) => p.id === req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

app.post("/api/patients", (req: Request, res: Response) => {
  try {
    const parsedPatient = NewPatientSchema.safeParse(req.body);

    if (!parsedPatient.success) {
      return res.status(400).json({ error: "Invalid patient data" });
    }

    const patient: Patient = {
      id: uuid(),
      ...parsedPatient.data,
      entries: [],
    };
    patientsData.push(patient);

    return res.json(patient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(400).json({ error: errorMessage });
  }
});

app.get("/api/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_req: Request, res: Response) => {
  res.send(diagnoses);
});

app.get("/api/patients", (_req: Request, res: Response) => {
  const nonSensitivePatients: NonSensitivePatient[] = patientsData.map(
    ({ id, name, gender, dateOfBirth, occupation }) => ({
      id,
      name,
      gender,
      dateOfBirth,
      occupation,
    })
  );

  res.json(nonSensitivePatients);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
