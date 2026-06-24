import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { Male as MaleIcon, Female as FemaleIcon, Transgender as TransgenderIcon } from "@mui/icons-material";

import { Patient, Gender } from "../../types";
import patientService from "../../services/patients";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    void patientService.getById(id).then(setPatient);
  }, [id]);

  if (!patient) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: "0.5em", display: "flex", alignItems: "center", gap: 1 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>
    </div>
  );
};

export default PatientDetailPage;
