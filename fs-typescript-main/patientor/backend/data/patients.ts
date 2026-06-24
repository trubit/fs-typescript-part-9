import type { Patient } from "../src/types";

const seedData: Patient[] = [
  {
    id: "d277336f-723a-11e9-8f0b-362b9e155667",
    name: "John McClane",
    dateOfBirth: "1986-07-09",
    ssn: "090786-122X",
    gender: "male",
    occupation: "New york city cop",
    entries: [
      {
        id: "d811e46d-70b3-4d90-b090-4535c7cf8fb1",
        date: "2015-01-02",
        type: "Hospital",
        specialist: "MD House",
        diagnosisCodes: ["S62.5"],
        description:
          "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
        discharge: {
          date: "2015-01-16",
          criteria: "Thumb has healed.",
        },
      },
    ],
  },
  {
    id: "d2773598-f723-11e9-8f0b-362b9e155667",
    name: "Martin Riggs",
    dateOfBirth: "1979-01-30",
    ssn: "300179-77X8",
    gender: "male",
    occupation: "Cop",
    entries: [
      {
        id: "fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62",
        date: "2019-08-05",
        type: "OccupationalHealthcare",
        specialist: "Michael Scott",
        employerName: "HyFy",
        diagnosisCodes: ["Z57.1", "Z74.3", "M51.2"],
        description:
          "Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ",
        sickLeave: {
          startDate: "2019-08-05",
          endDate: "2019-08-28",
        },
      },
    ],
  },
  {
    id: "d2773ec0-f723-11e9-8f0b-362b9e155667",
    name: "Hans Gruber",
    dateOfBirth: "1970-04-25",
    ssn: "250470-555L",
    gender: "other",
    occupation: "Technician",
    entries: [],
  },
  {
    id: "d2773822-f723-11e9-8f0b-362b9e155667",
    name: "Dana Scully",
    dateOfBirth: "1974-01-05",
    ssn: "050174-432N",
    gender: "female",
    occupation: "Forensic Pathologist",
    entries: [
      {
        id: "b4f4eca1-2aa7-4b13-9a18-4a5535c3c8da",
        date: "2019-10-20",
        type: "HealthCheck",
        specialist: "MD House",
        description: "Yearly control visit. Cholesterol levels back to normal.",
        healthCheckRating: 0,
      },
      {
        id: "fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62",
        date: "2019-09-10",
        type: "OccupationalHealthcare",
        specialist: "MD House",
        employerName: "FBI",
        description: "Prescriptions renewed.",
      },
      {
        id: "37be178f-1d6f-47c5-a8e9-bde5ed5f4d77",
        date: "2018-10-05",
        type: "HealthCheck",
        specialist: "MD House",
        description:
          "Yearly control visit. Due to high cholesterol levels recommended to eat more vegetables.",
        healthCheckRating: 1,
      },
    ],
  },
];

// Deep copy so mutations to entries/nested objects never affect seedData
const deepCopy = (): Patient[] =>
  JSON.parse(JSON.stringify(seedData)) as Patient[];

const patients: Patient[] = deepCopy();

export const resetPatients = (): void => {
  patients.length = 0;
  deepCopy().forEach(p => patients.push(p));
};

export default patients;
