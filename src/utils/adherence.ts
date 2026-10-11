import { Patient } from '../types';

export interface AdherenceData {
  rate: number;          // 0 to 100%
  completedLogs: number; // total workouts registered
  hasRecentAlert: boolean;
  alertText?: string;
  recentPain?: number;
}

export function calculateAdherence(patient: Patient): AdherenceData {
  const logs = patient.patientLogs || [];
  const prescriptions = patient.prescriptions || [];

  const completedLogs = logs.length;
  
  // Calculate average completion rate:
  // If there are prescriptions and logs, percentage of prescribed exercises completed across logs
  let rate = 0;
  if (prescriptions.length === 0) {
    rate = 100;
  } else if (logs.length > 0) {
    const totalPossible = logs.length * prescriptions.length;
    const totalCompleted = logs.reduce((sum, log) => sum + (log.completedExercisesIds?.length || 0), 0);
    rate = Math.min(100, Math.round((totalCompleted / totalPossible) * 100));
  } else {
    rate = 0;
  }

  // Check recent pain alert (latest log within history)
  let hasRecentAlert = false;
  let alertText: string | undefined = undefined;
  let recentPain: number | undefined = undefined;

  if (logs.length > 0) {
    const latestLog = logs[0];
    recentPain = latestLog.painPostWorkout;

    if (latestLog.painPostWorkout >= 5) {
      hasRecentAlert = true;
      alertText = `Dor pós-treino EVA ${latestLog.painPostWorkout}/10 registrada`;
    } else if (logs.length >= 2 && latestLog.painPostWorkout > logs[1].painPostWorkout + 2) {
      hasRecentAlert = true;
      alertText = `Aumento súbito de dor (EVA ${logs[1].painPostWorkout} ➔ ${latestLog.painPostWorkout})`;
    }
  }

  return {
    rate,
    completedLogs,
    hasRecentAlert,
    alertText,
    recentPain
  };
}
