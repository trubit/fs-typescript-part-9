import { Box, Typography } from "@mui/material";
import { Favorite, LocalHospital, MedicalServices, Work } from "@mui/icons-material";

import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";
import { assertNever } from "./utils";

// ── helpers ────────────────────────────────────────────────────────────────

const ratingColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy:      return "green";
    case HealthCheckRating.LowRisk:      return "#d4d400";
    case HealthCheckRating.HighRisk:     return "orange";
    case HealthCheckRating.CriticalRisk: return "red";
    default: return assertNever(rating);
  }
};

const entryCardStyle = {
  border: "1px solid",
  borderRadius: 1,
  padding: 2,
  marginBottom: 1,
};

// ── diagnosis list ─────────────────────────────────────────────────────────

const DiagnosisList = ({
  codes,
  diagnoses,
}: {
  codes?: string[];
  diagnoses: Diagnosis[];
}) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map(code => (
        <li key={code}>
          {code} {diagnoses.find(d => d.code === code)?.name ?? ""}
        </li>
      ))}
    </ul>
  );
};

// ── per-type entry cards ───────────────────────────────────────────────────

const HospitalEntryCard = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryCardStyle}>
    <Typography>
      {entry.date} <LocalHospital />
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>
      Discharge: {entry.discharge.date} — {entry.discharge.criteria}
    </Typography>
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const OccupationalEntryCard = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryCardStyle}>
    <Typography>
      {entry.date} <Work /> <em>{entry.employerName}</em>
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    {entry.sickLeave && (
      <Typography>
        Sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
      </Typography>
    )}
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const HealthCheckEntryCard = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryCardStyle}>
    <Typography>
      {entry.date} <MedicalServices />
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Favorite sx={{ color: ratingColor(entry.healthCheckRating) }} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

// ── dispatcher ─────────────────────────────────────────────────────────────

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryCard entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalEntryCard entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntryCard entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
