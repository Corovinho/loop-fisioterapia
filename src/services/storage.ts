import { Patient, ClinicalEvolution, ExamDocument, PrescriptionExercise, PatientDailyFeedback, EvolutionPhoto } from '../types';
import { INITIAL_SAMPLE_PATIENTS } from './sampleData';

const PATIENTS_STORAGE_KEY = 'loop_patients_v1';
const GEMINI_API_KEY_STORAGE = 'loop_gemini_api_key';
const SUPABASE_CONFIG_KEY = 'loop_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export const StorageService = {
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (data === null) {
        this.savePatients(INITIAL_SAMPLE_PATIENTS);
        return INITIAL_SAMPLE_PATIENTS;
      }
      const parsed: Patient[] = JSON.parse(data);
      let updatedCpf = false;
      parsed.forEach(p => {
        if (!p.cpf) {
          if (p.id === 'pat-1') { p.cpf = '111.222.333-44'; updatedCpf = true; }
          else if (p.id === 'pat-2') { p.cpf = '222.333.444-55'; updatedCpf = true; }
          else if (p.id === 'pat-3') { p.cpf = '333.444.555-66'; updatedCpf = true; }
        }
      });
      if (updatedCpf) {
        this.savePatients(parsed);
      }
      return parsed;
    } catch (err) {
      console.error('Error reading patients from storage:', err);
      return [];
    }
  },

  clearAllPatients(): Patient[] {
    this.savePatients([]);
    return [];
  },

  getPatientById(id: string): Patient | undefined {
    const list = this.getPatients();
    return list.find(p => p.id === id);
  },

  savePatients(patients: Patient[]): void {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (err) {
      console.error('Error saving patients to storage:', err);
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        alert('Atenção: O limite de armazenamento local do seu navegador foi atingido. Tente usar imagens mais leves ou remover anexos antigos.');
      }
    }
  },

  savePatient(patient: Patient): Patient {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    const updated = { ...patient, updatedAt: new Date().toISOString() };
    
    if (index >= 0) {
      patients[index] = updated;
    } else {
      patients.unshift(updated);
    }

    this.savePatients(patients);
    return updated;
  },

  deletePatient(id: string): void {
    const patients = this.getPatients().filter(p => p.id !== id);
    this.savePatients(patients);
  },

  addEvolution(patientId: string, evolution: ClinicalEvolution): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updatedEvolutions = [evolution, ...patient.evolutions];
    return this.savePatient({
      ...patient,
      evolutions: updatedEvolutions
    });
  },

  addExam(patientId: string, exam: ExamDocument): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updatedExams = [exam, ...patient.exams];
    return this.savePatient({
      ...patient,
      exams: updatedExams
    });
  },

  deleteExam(patientId: string, examId: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    return this.savePatient({
      ...patient,
      exams: patient.exams.filter(e => e.id !== examId)
    });
  },

  addEvolutionPhoto(patientId: string, photo: EvolutionPhoto): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    let updatedEvolutions = [...(patient.evolutions || [])];
    if (updatedEvolutions.length > 0) {
      const latest = updatedEvolutions[0];
      updatedEvolutions[0] = {
        ...latest,
        evolutionPhotos: [...(latest.evolutionPhotos || []), photo]
      };
    } else {
      const newEvo: ClinicalEvolution = {
        id: `evo-photo-${Date.now()}`,
        date: photo.date || new Date().toISOString().split('T')[0],
        functionalPrevious: 'Registro fotográfico inicial',
        functionalCurrent: photo.label || 'Registro fotográfico adicionado',
        painEVA: 0,
        mobilityMetrics: [],
        strengthMetrics: [],
        evolutionPhotos: [photo],
        goals: [],
        notes: `Foto anexada: ${photo.label}`
      };
      updatedEvolutions = [newEvo];
    }

    return this.savePatient({
      ...patient,
      evolutions: updatedEvolutions
    });
  },

  deleteEvolutionPhoto(patientId: string, photoId: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updatedEvolutions = (patient.evolutions || []).map(evo => ({
      ...evo,
      evolutionPhotos: (evo.evolutionPhotos || []).filter(p => p.id !== photoId)
    }));

    return this.savePatient({
      ...patient,
      evolutions: updatedEvolutions
    });
  },

  updatePrescriptions(patientId: string, prescriptions: PrescriptionExercise[]): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    return this.savePatient({
      ...patient,
      prescriptions
    });
  },

  addPatientLog(patientId: string, log: PatientDailyFeedback): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updatedLogs = [log, ...patient.patientLogs];
    
    // Also mark exercises completed today in prescriptions
    const updatedPrescriptions = patient.prescriptions.map(p => ({
      ...p,
      completedToday: log.completedExercisesIds.includes(p.id) ? true : p.completedToday
    }));

    return this.savePatient({
      ...patient,
      patientLogs: updatedLogs,
      prescriptions: updatedPrescriptions
    });
  },

  toggleGoalAchieved(patientId: string, isAchieved: boolean): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    return this.savePatient({
      ...patient,
      mainGoalAchieved: isAchieved,
      mainGoalAchievedDate: isAchieved ? new Date().toISOString().split('T')[0] : undefined
    });
  },

  resetToSampleData(): Patient[] {
    this.savePatients(INITIAL_SAMPLE_PATIENTS);
    return INITIAL_SAMPLE_PATIENTS;
  },

  exportDataAsJson(): string {
    const patients = this.getPatients();
    return JSON.stringify(patients, null, 2);
  },

  importDataFromJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data)) {
        this.savePatients(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // Gemini API Key Management (Pre-connected to Google Gemini)
  getGeminiApiKey(): string {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  saveGeminiApiKey(key: string): void {
    if (!key) {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    } else {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    }
  },

  // Supabase Configuration Management
  getSupabaseConfig(): SupabaseConfig {
    try {
      const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      enabled: false
    };
  },

  saveSupabaseConfig(cfg: SupabaseConfig): void {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(cfg));
  }
};
