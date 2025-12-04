export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  sex: 'male' | 'female' | 'prefer-not-to-say';
}

export interface Medication {
  id: string;
  name: string;
  dosage: number;
  schedule: MedicationSchedule;
  concentrationData?: ConcentrationData[];
}

export interface MedicationSchedule {
  frequency: 'daily' | 'weekly';
  timesPerDay: number;
  interval: number;
  times: string[];
}

export interface ConcentrationData {
  timestamp: Date;
  concentration: number;
  effect?: number;
  sideEffect?: number;
}

export interface PredictionRequest {
  sequence: number[][];
}

export interface PredictionResponse {
  effect: number;
  sideEffect: number;
}

export interface SideEffectPrediction {
  peakWindowStart: string;
  peakWindowEnd: string;
  expectedEffects: string[];
}
