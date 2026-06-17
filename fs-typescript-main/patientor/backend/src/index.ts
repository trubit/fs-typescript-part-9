import express, { Request, Response } from "express";
import diagnoses from "../data/diagnoses";
import patientsData from "../data/patients";
import { PublicPatient } from "./types";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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
