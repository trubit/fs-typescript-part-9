import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import {
  Female as FemaleIcon,
  Male as MaleIcon,
  Transgender as TransgenderIcon,
} from "@mui/icons-material";

import { Diagnosis, Entry, Gender, Patient } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

// ── gender icon ────────────────────────────────────────────────────────────

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:   return <MaleIcon />;
    case Gender.Female: return <FemaleIcon />;
    default:            return <TransgenderIcon />;
  }
};

// ── page ───────────────────────────────────────────────────────────────────

const PatientDetailPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    void patientService.getById(id).then(setPatient);
  }, [id]);

  if (!patient) return <Typography>Loading...</Typography>;

  const handleEntryAdded = (entry: Entry) => {
    setPatient({ ...patient, entries: patient.entries.concat(entry) });
    setShowForm(false);
  };

  return (
    <div>
      {/* patient header */}
      <Typography
        variant="h4"
        sx={{ marginBottom: "0.5em", display: "flex", alignItems: "center", gap: 1 }}
      >
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>

      {/* entry list */}
      <Typography variant="h6" sx={{ marginTop: "1em", marginBottom: "0.5em" }}>
        entries
      </Typography>
      <Box>
        {patient.entries.map(entry => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </Box>

      {/* add entry */}
      {showForm ? (
        <AddEntryForm
          patientId={patient.id}
          diagnoses={diagnoses}
          onEntryAdded={handleEntryAdded}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={() => setShowForm(true)}
        >
          Add New Entry
        </Button>
      )}
    </div>
  );
};

export default PatientDetailPage;
