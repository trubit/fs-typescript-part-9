export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

const diagnoses: Diagnosis[] = [
  {
    code: "M24.2",
    name: "Disorder of ligament",
    latin: "Morbus ligamenti",
  },
  {
    code: "M51.2",
    name: "Other specified intervertebral disc displacement",
    latin: "Alia dislocatio disci intervertebralis specificata",
  },
  {
    code: "S03.5",
    name: "Sprain and strain of joints and ligaments of other and unspecified parts of head",
    latin:
      "Distorsio et/sive distensio articulationum et/sive ligamentorum partium aliarum sive non specificatarum capitis",
  },
  {
    code: "J10.1",
    name: "Influenza with other respiratory manifestations, other influenza virus code identified",
    latin:
      "Influenza cum aliis manifestationibus respiratoriis ab agente virali identificato",
  },
  {
    code: "J06.9",
    name: "Acute upper respiratory infection, unspecified",
    latin: "Acuta infectio respiratoria superior non specificata",
  },
  {
    code: "Z57.7",
    name: "Occupational exposure to toxic agents",
    latin: "Expositio occupationalis agentibus toxicis",
  },
  {
    code: "N30.0",
    name: "Acute cystitis",
    latin: "Cystitis acuta",
  },
  {
    code: "H54.7",
    name: "Unspecified visual impairment",
    latin: "Defectus visus non specificatus",
  },
  {
    code: "J03.0",
    name: "Streptococcal tonsillitis",
    latin: "Tonsillitis (palatina) streptococcica",
  },
  {
    code: "L60.1",
    name: "Onycholysis",
    latin: "Onycholysis",
  },
  {
    code: "Z74.3",
    name: "Problem related to wheelchair",
    latin: "Problema currus rotis affixum",
  },
  {
    code: "M62.6",
    name: "Muscle strain",
    latin: "Distensio musculi",
  },
];

export default diagnoses;
