import express, { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import diagnoses from "../data/diagnoses";
import patientsData from "../data/patients";
import { NewPatientSchema, Patient, PublicPatient } from "./types";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/patients", (req: Request, res: Response) => {
  try {
    const parsedPatient = NewPatientSchema.safeParse(req.body);

    if (!parsedPatient.success) {
      return res.status(400).json({ error: "Invalid patient data" });
    }

    const patient: Patient = {
      id: uuid(),
      ...parsedPatient.data,
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
