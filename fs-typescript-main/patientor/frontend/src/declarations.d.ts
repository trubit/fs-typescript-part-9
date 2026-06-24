declare module '@mui/icons-material' {
  import type { FC } from 'react';
  type IconComponent = FC<{ fontSize?: string; sx?: object; className?: string }>;
  export const Favorite: IconComponent;
  export const Male: IconComponent;
  export const Female: IconComponent;
  export const Transgender: IconComponent;
  export const LocalHospital: IconComponent;
  export const Work: IconComponent;
  export const MedicalServices: IconComponent;
}
