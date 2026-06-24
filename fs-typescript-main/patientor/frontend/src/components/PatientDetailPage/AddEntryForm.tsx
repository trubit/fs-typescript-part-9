import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  Diagnosis,
  Entry,
  HealthCheckRating,
  NewEntry,
} from "../../types";
import patientService from "../../services/patients";
import { assertNever } from "./utils";

// ── constants ──────────────────────────────────────────────────────────────

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

const ENTRY_TYPE_OPTIONS: { value: EntryType; label: string }[] = [
  { value: "HealthCheck",            label: "Health Check" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
  { value: "Hospital",               label: "Hospital" },
];

const HEALTH_RATING_OPTIONS: { value: HealthCheckRating; label: string }[] = [
  { value: HealthCheckRating.Healthy,      label: "0 — Healthy" },
  { value: HealthCheckRating.LowRisk,      label: "1 — Low Risk" },
  { value: HealthCheckRating.HighRisk,     label: "2 — High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "3 — Critical Risk" },
];

// ── props ──────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  diagnoses: Diagnosis[];
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
}

// ── component ──────────────────────────────────────────────────────────────

const AddEntryForm = ({ patientId, diagnoses, onEntryAdded, onCancel }: Props) => {
  // entry type
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");

  // common fields
  const [date, setDate]               = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist]   = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // OccupationalHealthcare
  const [employerName, setEmployerName]     = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd]     = useState("");

  // Hospital
  const [dischargeDate, setDischargeDate]         = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // error
  const [error, setError] = useState("");

  // ── build typed payload ──────────────────────────────────────────────────

  const buildEntry = (): NewEntry => {
    const base = {
      date,
      description,
      specialist,
      diagnosisCodes: selectedCodes.length > 0 ? selectedCodes : undefined,
    };

    switch (entryType) {
      case "HealthCheck":
        return { ...base, type: "HealthCheck" as const, healthCheckRating };

      case "OccupationalHealthcare":
        return {
          ...base,
          type: "OccupationalHealthcare" as const,
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined,
        };

      case "Hospital":
        return {
          ...base,
          type: "Hospital" as const,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };

      default:
        return assertNever(entryType);
    }
  };

  // ── submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const newEntry = await patientService.addEntry(patientId, buildEntry());
      onEntryAdded(newEntry);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as {
          error?: Array<{ path: string[]; message: string }>;
        };
        if (Array.isArray(data.error)) {
          setError(data.error.map(i => `${i.path.join(".")}: ${i.message}`).join(". "));
        } else {
          setError(String(err.response.data));
        }
      }
    }
  };

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ border: "1px dashed grey", borderRadius: 1, padding: 2, marginTop: 2 }}
    >
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        New Entry
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 1 }}>
          {error}
        </Alert>
      )}

      {/* ── entry type ── */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Entry type</InputLabel>
        <Select
          value={entryType}
          label="Entry type"
          onChange={e => setEntryType(e.target.value as EntryType)}
        >
          {ENTRY_TYPE_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ── common fields ── */}
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        fullWidth
        margin="dense"
        required
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={e => setSpecialist(e.target.value)}
        fullWidth
        margin="dense"
        required
      />

      {/* diagnosis codes — multi-select with chips */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Diagnosis codes</InputLabel>
        <Select
          multiple
          value={selectedCodes}
          onChange={e => {
            const val = e.target.value;
            setSelectedCodes(typeof val === "string" ? [val] : val);
          }}
          input={<OutlinedInput label="Diagnosis codes" />}
          renderValue={selected => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map(code => (
                <Chip key={code} label={code} size="small" />
              ))}
            </Box>
          )}
        >
          {diagnoses.map(d => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} — {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ── HealthCheck: rating ── */}
      {entryType === "HealthCheck" && (
        <FormControl fullWidth margin="dense">
          <InputLabel>Health Check Rating</InputLabel>
          <Select
            value={healthCheckRating}
            label="Health Check Rating"
            onChange={e => setHealthCheckRating(e.target.value as HealthCheckRating)}
          >
            {HEALTH_RATING_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* ── OccupationalHealthcare: employer + optional sick leave ── */}
      {entryType === "OccupationalHealthcare" && (
        <>
          <TextField
            label="Employer Name"
            value={employerName}
            onChange={e => setEmployerName(e.target.value)}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Sick Leave Start Date"
            type="date"
            value={sickLeaveStart}
            onChange={e => setSickLeaveStart(e.target.value)}
            fullWidth
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Sick Leave End Date"
            type="date"
            value={sickLeaveEnd}
            onChange={e => setSickLeaveEnd(e.target.value)}
            fullWidth
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </>
      )}

      {/* ── Hospital: discharge ── */}
      {entryType === "Hospital" && (
        <>
          <TextField
            label="Discharge Date"
            type="date"
            value={dischargeDate}
            onChange={e => setDischargeDate(e.target.value)}
            fullWidth
            margin="dense"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={e => setDischargeCriteria(e.target.value)}
            fullWidth
            margin="dense"
            required
          />
        </>
      )}

      {/* ── actions ── */}
      <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => { setError(""); onCancel(); }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
