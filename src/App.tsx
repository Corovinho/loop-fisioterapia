import React, { useState, useEffect } from 'react';
import { Patient, ClinicalEvolution, ExamDocument, PrescriptionExercise, PatientDailyFeedback, EvolutionPhoto } from './types';
import { StorageService } from './services/storage';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { SettingsModal } from './components/common/SettingsModal';
import { PatientList } from './components/patients/PatientList';
import { PatientHeader, PatientDetailTab } from './components/patients/PatientHeader';
import { PatientModal } from './components/patients/PatientModal';
import { ClinicalOverview } from './components/clinical/ClinicalOverview';
import { RecordsTab } from './components/clinical/RecordsTab';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { PrescriptionBuilder } from './components/prescription/PrescriptionBuilder';
import { PatientPortalView } from './components/patient-portal/PatientPortalView';

export function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Auth state: null means on Login page
  const [authSession, setAuthSession] = useState<{
    role: 'physio' | 'patient';
    patientId?: string;
  } | null>(null);

  // Physio view state
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('evolution');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Load patients on mount
  useEffect(() => {
    const list = StorageService.getPatients();
    setPatients(list);
  }, []);

  const currentPatient = patients.find(p => p.id === (authSession?.role === 'patient' ? authSession.patientId : selectedPatientId));

  const refreshCurrentPatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Auth handlers
  const handleLoginAsPhysio = () => {
    setAuthSession({ role: 'physio' });
    setSelectedPatientId(null); // Show patient directory first for zero clutter
  };

  const handleLoginAsPatient = (patientId: string) => {
    setAuthSession({ role: 'patient', patientId });
  };

  const handleLogout = () => {
    setAuthSession(null);
    setSelectedPatientId(null);
  };

  // Clinical handlers
  const handleSavePatient = (patientData: Partial<Patient>) => {
    if (editingPatient) {
      const merged = { ...editingPatient, ...patientData } as Patient;
      const updated = StorageService.savePatient(merged);
      refreshCurrentPatient(updated);
    } else {
      const newP = StorageService.savePatient(patientData as Patient);
      setPatients(StorageService.getPatients());
      setSelectedPatientId(newP.id);
    }
  };

  const handleToggleGoalAchieved = (achieved: boolean) => {
    if (!currentPatient) return;
    const updated = StorageService.toggleGoalAchieved(currentPatient.id, achieved);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleAddEvolution = (evolution: ClinicalEvolution) => {
    if (!currentPatient) return;
    const updated = StorageService.addEvolution(currentPatient.id, evolution);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleUpdateGoalStatus = (goalId: string, nextStatus: any) => {
    if (!currentPatient || currentPatient.evolutions.length === 0) return;
    const latestEvo = currentPatient.evolutions[0];
    const updatedGoals = latestEvo.goals.map(g => g.id === goalId ? { ...g, status: nextStatus } : g);
    const updatedEvo = { ...latestEvo, goals: updatedGoals };
    const evolutions = [updatedEvo, ...currentPatient.evolutions.slice(1)];
    const saved = StorageService.savePatient({ ...currentPatient, evolutions });
    refreshCurrentPatient(saved);
  };

  const handleAddExam = (exam: ExamDocument) => {
    if (!currentPatient) return;
    const updated = StorageService.addExam(currentPatient.id, exam);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleDeleteExam = (examId: string) => {
    if (!currentPatient) return;
    const updated = StorageService.deleteExam(currentPatient.id, examId);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleAddPhoto = (photo: EvolutionPhoto) => {
    if (!currentPatient) return;
    const updated = StorageService.addEvolutionPhoto(currentPatient.id, photo);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!currentPatient) return;
    const updated = StorageService.deleteEvolutionPhoto(currentPatient.id, photoId);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleUpdatePrescriptions = (exercises: PrescriptionExercise[]) => {
    if (!currentPatient) return;
    const updated = StorageService.updatePrescriptions(currentPatient.id, exercises);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleSavePatientLog = (log: PatientDailyFeedback) => {
    if (!currentPatient) return;
    const updated = StorageService.addPatientLog(currentPatient.id, log);
    if (updated) refreshCurrentPatient(updated);
  };

  const handleApplyAIPlan = (
    newExercises: PrescriptionExercise[],
    suggestedGoals: string[],
    mode: 'append' | 'replace' = 'append'
  ) => {
    if (!currentPatient) return;
    const basePrescriptions = currentPatient.prescriptions || [];
    const updatedPrescriptions = mode === 'replace'
      ? newExercises
      : [...basePrescriptions, ...newExercises];

    let updatedEvolutions = [...(currentPatient.evolutions || [])];
    if (updatedEvolutions.length > 0 && suggestedGoals && suggestedGoals.length > 0) {
      const latest = updatedEvolutions[0];
      const newGoalItems = suggestedGoals.map((desc, idx) => ({
        id: `g-ai-${Date.now()}-${idx}`,
        description: desc,
        status: 'in_progress' as const
      }));
      updatedEvolutions[0] = {
        ...latest,
        goals: [...(latest.goals || []), ...newGoalItems]
      };
    }

    const saved = StorageService.savePatient({
      ...currentPatient,
      prescriptions: updatedPrescriptions,
      evolutions: updatedEvolutions
    });
    refreshCurrentPatient(saved);
  };

  const handleExportData = () => {
    const data = StorageService.exportDataAsJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loop_fisioterapia_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Deseja restaurar os pacientes padrão de demonstração?')) {
      const sample = StorageService.resetToSampleData();
      setPatients(sample);
      if (selectedPatientId && !sample.some(p => p.id === selectedPatientId)) {
        setSelectedPatientId(sample[0]?.id || null);
      }
    }
  };

  const handleClearDemoData = () => {
    if (confirm('Deseja apagar os pacientes fictícios de teste e iniciar o prontuário em branco para uso real?')) {
      const empty = StorageService.clearAllPatients();
      setPatients(empty);
      setSelectedPatientId(null);
    }
  };

  // 1. IF NOT LOGGED IN -> RENDER LOGIN PAGE
  if (!authSession) {
    return (
      <LoginPage
        patients={patients}
        onLoginAsPhysio={handleLoginAsPhysio}
        onLoginAsPatient={handleLoginAsPatient}
      />
    );
  }

  // 2. IF LOGGED IN AS PATIENT -> RENDER PATIENT PORTAL
  if (authSession.role === 'patient') {
    return currentPatient ? (
      <PatientPortalView
        patient={currentPatient}
        onSaveFeedback={handleSavePatientLog}
        onLogout={handleLogout}
      />
    ) : (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="space-y-3">
          <p className="text-sm font-bold text-zinc-900">Paciente não encontrado.</p>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-md transition-all"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // 3. IF LOGGED IN AS PHYSIOTHERAPIST -> RENDER CLINICAL WORKSPACE
  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col font-sans">
      <Navbar
        userRole="physio"
        userName="Dra. Renata Lopes (CREFITO-3)"
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportData={handleExportData}
        onResetData={handleResetData}
        showingPatientDetail={!!selectedPatientId}
        onBackToPatientList={() => setSelectedPatientId(null)}
      />

      <main className="flex-1 flex flex-col">
        {!selectedPatientId ? (
          /* LEVEL 1: SPACIOUS PATIENT DIRECTORY */
          <PatientList
            patients={patients}
            onSelectPatient={(id) => {
              setSelectedPatientId(id);
              setActiveTab('evolution');
            }}
            onNewPatient={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onClearDemoData={handleClearDemoData}
          />
        ) : (
          /* LEVEL 2: PATIENT DETAIL PRONTUÁRIO */
          currentPatient && (
            <>
              <PatientHeader
                patient={currentPatient}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onToggleGoalAchieved={handleToggleGoalAchieved}
                onEditPatient={() => {
                  setEditingPatient(currentPatient);
                  setIsPatientModalOpen(true);
                }}
                onBackToList={() => setSelectedPatientId(null)}
                onViewAsPatient={() => {
                  setAuthSession({ role: 'patient', patientId: currentPatient.id });
                }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {activeTab === 'evolution' && (
                  <ClinicalOverview
                    patient={currentPatient}
                    onAddEvolution={handleAddEvolution}
                    onUpdateGoalStatus={handleUpdateGoalStatus}
                  />
                )}

                {activeTab === 'prescription' && (
                  <PrescriptionBuilder
                    patient={currentPatient}
                    onUpdatePrescriptions={handleUpdatePrescriptions}
                    onOpenAIAssistant={() => setIsAIOpen(true)}
                  />
                )}

                {activeTab === 'records' && (
                  <RecordsTab
                    patient={currentPatient}
                    onOpenNewEvolution={() => setActiveTab('evolution')}
                    onAddExam={handleAddExam}
                    onDeleteExam={handleDeleteExam}
                    onAddPhoto={handleAddPhoto}
                    onDeletePhoto={handleDeletePhoto}
                  />
                )}
              </div>
            </>
          )
        )}
      </main>

      {/* Global Modals */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        initialPatient={editingPatient}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {currentPatient && (
        <AIAssistantModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          patient={currentPatient}
          onApplyPlan={handleApplyAIPlan}
        />
      )}
    </div>
  );
}

export default App;
