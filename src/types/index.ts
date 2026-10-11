export type PainLevel = number; // 0 to 10

export type ExamType = 'raio-x' | 'ressonancia' | 'laudo' | 'ultrassom' | 'tomografia' | 'outro';

export interface ExamDocument {
  id: string;
  title: string;
  date: string;
  type: ExamType;
  fileUrl: string; // base64 data url or hosted url
  notes?: string;
  fileName?: string;
}

export interface RangeOfMotionMetric {
  id: string;
  joint: string;       // e.g. "Joelho Direito"
  movement: string;    // e.g. "Flexão Ativa"
  baselineDegrees: number; // e.g. 45
  currentDegrees: number;  // e.g. 110
  targetDegrees: number;   // e.g. 135
}

export interface MuscleStrengthMetric {
  id: string;
  muscleGroup: string; // e.g. "Quadríceps Direito"
  grade: number;       // 0 to 5 (Oxford Scale)
  notes?: string;
}

export interface EvolutionPhoto {
  id: string;
  date: string;
  label: string;       // e.g. "Flexão Máxima - Dia 1" vs "Flexão Máxima - Semana 4"
  stage: 'antes' | 'durante' | 'depois';
  imageUrl: string;
  notes?: string;
}

export interface TreatmentGoal {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'achieved';
  targetDate?: string;
}

export interface ClinicalEvolution {
  id: string;
  date: string;
  functionalPrevious: string; // Status prévio
  functionalCurrent: string;  // Status atual
  painEVA: PainLevel;         // 0 - 10
  mobilityMetrics: RangeOfMotionMetric[];
  strengthMetrics: MuscleStrengthMetric[];
  evolutionPhotos: EvolutionPhoto[];
  goals: TreatmentGoal[];
  notes?: string;
  conductedBy?: string;
}

export type ExerciseCategory = 'mobilidade' | 'fortalecimento' | 'alongamento' | 'propriocepcao' | 'controle_motor';

export interface PrescriptionExercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  sets: string;         // e.g. "3 séries"
  reps: string;         // e.g. "12 repetições"
  holdTime?: string;    // e.g. "30 segundos"
  frequency: string;    // e.g. "2x ao dia (manhã e noite)"
  instructions: string; // Instruções de execução passo a passo
  externalVideoUrl?: string; // Link externo seguro (YouTube, Vimeo, etc.)
  cautionNotes?: string;     // O que evitar / cuidados posturais
  completedToday?: boolean;
}

export interface PatientDailyFeedback {
  id: string;
  date: string;
  completedExercisesIds: string[];
  painPostWorkout: PainLevel;
  perceivedEffort: number; // 1 to 10
  patientComment?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender?: string;
  occupation?: string;
  
  // Destaque: Objetivo Principal do Tratamento (North Star metric)
  mainGoal: string; 
  mainGoalCategory?: string; // ex: "Retorno ao Esporte", "Independência AVD", "Alívio de Dor"
  mainGoalAchieved: boolean;
  mainGoalAchievedDate?: string;

  // Condição e Histórico
  condition: string;          // ex: "Pós-op Reconstrução LCA Direito (Tendão Patelar)"
  injuryDate: string;
  clinicalHistory: string;    // Histórico pregresso, comorbidades, cirurgias
  
  // Módulos
  exams: ExamDocument[];
  evolutions: ClinicalEvolution[];
  prescriptions: PrescriptionExercise[];
  patientLogs: PatientDailyFeedback[];

  createdAt: string;
  updatedAt: string;
}

export interface AIPrescriptionDraft {
  condition: string;
  stageName: string;
  clinicalRationale: string;
  redFlags: string[];
  suggestedGoals: string[];
  exercises: {
    title: string;
    category: ExerciseCategory;
    sets: string;
    reps: string;
    holdTime?: string;
    frequency: string;
    instructions: string;
    cautionNotes?: string;
    externalVideoUrl?: string;
  }[];
}
