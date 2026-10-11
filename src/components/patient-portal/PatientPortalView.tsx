import React, { useState } from 'react';
import { Patient, PatientDailyFeedback, EvolutionPhoto } from '../../types';
import { Target, CheckCircle2, ExternalLink, ChevronDown, ChevronUp, Dumbbell, Award, LogOut, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../common/Badge';
import { WorkoutTimer } from './WorkoutTimer';
import { PostWorkoutFeedbackModal } from './PostWorkoutFeedbackModal';
import { BeforeAfterViewer } from '../clinical/BeforeAfterViewer';
import logoIcon from '../../assets/logo-icon.jpg';

interface PatientPortalViewProps {
  patient: Patient;
  onSaveFeedback: (feedback: PatientDailyFeedback) => void;
  onLogout: () => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient,
  onSaveFeedback,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'transformation' | 'history'>('today');
  const [completedIds, setCompletedIds] = useState<string[]>(
    patient.prescriptions.filter(p => p.completedToday).map(p => p.id)
  );
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    patient.prescriptions[0]?.id || null
  );
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const toggleCompleted = (id: string) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter(item => item !== id));
    } else {
      setCompletedIds([...completedIds, id]);
    }
  };

  // Extract photos
  const allPhotos: EvolutionPhoto[] = [];
  patient.evolutions.forEach(evo => {
    if (evo.evolutionPhotos) allPhotos.push(...evo.evolutionPhotos);
  });
  const beforePhoto = allPhotos.find(p => p.stage === 'antes') || allPhotos[allPhotos.length - 1];
  const afterPhoto = allPhotos.find(p => p.stage === 'depois') || allPhotos[0];

  const firstEvo = patient.evolutions[patient.evolutions.length - 1];
  const latestEvo = patient.evolutions[0];
  const primaryRom = latestEvo?.mobilityMetrics?.[0];
  const initialRom = firstEvo?.mobilityMetrics?.find(m => m.movement === primaryRom?.movement);

  const allCompleted = patient.prescriptions.length > 0 && completedIds.length === patient.prescriptions.length;

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col font-sans">
      {/* Top Patient Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200/80 bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center">
              <img src={logoIcon} alt="loop" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 leading-none">loop</span>
                <span className="text-[9px] font-bold tracking-widest text-blue-600 uppercase leading-none">FISIOTERAPIA</span>
                <span className="text-[10px] text-slate-400 font-medium ml-1 hidden sm:inline">• {patient.condition}</span>
              </div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                Olá, {patient.name}
              </h1>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
            title="Sair do portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* HERO FEATURED CARD (North Star Goal - Solid Color) */}
        <div className={`rounded-3xl p-6 sm:p-7 transition-all shadow-sm ${
          patient.mainGoalAchieved
            ? 'bg-emerald-600 text-white'
            : 'bg-blue-600 text-white'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90">
                <Target className="w-3.5 h-3.5" />
                Sua Meta Principal no Tratamento
              </span>

              {patient.mainGoalAchieved && (
                <span className="px-3 py-1 rounded-full bg-white text-emerald-700 text-xs font-bold shadow-xs">
                  Meta Conquistada 🎉
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                &ldquo;{patient.mainGoal}&rdquo;
              </h2>
              <p className="text-xs text-white/80 mt-1 font-medium">
                Prescrito por Dra. Renata Lopes especialmente para sua recuperação
              </p>
            </div>

            <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-white/90">Treino Domiciliar Ativo</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white font-bold">
                {completedIds.length} de {patient.prescriptions.length} feitos hoje
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Pill Filters */}
        <div className="bg-white/80 p-1.5 rounded-full border border-slate-200/80 shadow-xs flex gap-1">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Treino de Hoje</span>
          </button>

          <button
            onClick={() => setActiveTab('transformation')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab === 'transformation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Minha Evolução</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Histórico de Treinos</span>
            <span className="sm:hidden">Histórico</span>
          </button>
        </div>

        {/* TAB 1: TREINO DE HOJE */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Exercícios Prescritos
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Marque cada exercício ao finalizar sua série
                </p>
              </div>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className={`px-6 py-3 rounded-full text-xs font-bold transition-all self-start sm:self-auto shadow-sm ${
                  allCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {allCompleted ? '✓ Finalizar e Salvar Treino' : 'Registrar Nível de Dor'}
              </button>
            </div>

            {patient.prescriptions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-xs text-sm text-slate-500">
                Nenhum exercício ativo no momento.
              </div>
            ) : (
              <div className="space-y-3">
                {patient.prescriptions.map((ex, idx) => {
                  const isDone = completedIds.includes(ex.id);
                  const isExpanded = expandedExerciseId === ex.id;

                  return (
                    <div
                      key={ex.id}
                      className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                          : 'border-slate-100 shadow-xs hover:shadow-md'
                      }`}
                    >
                      <div className="p-5 flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5 flex-1">
                          {/* Circular Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleCompleted(ex.id)}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-4 h-4" />}
                          </button>

                          <div
                            onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                            className="cursor-pointer space-y-1 flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {ex.title}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold text-slate-700">
                                {ex.sets}
                              </span>
                              <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold text-slate-700">
                                {ex.reps}
                              </span>
                              {ex.holdTime && (
                                <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                                  {ex.holdTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {ex.externalVideoUrl && (
                            <a
                              href={ex.externalVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200/60 flex items-center gap-1 shrink-0 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="hidden sm:inline">Vídeo</span>
                            </a>
                          )}

                          <button
                            onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Instructions Accordion */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-3 space-y-4 border-t border-slate-100 bg-slate-50/50">
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                              Como Executar:
                            </span>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                              {ex.instructions}
                            </p>
                          </div>

                          {ex.cautionNotes && (
                            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900">
                              <strong className="font-bold block text-[11px] mb-0.5 text-amber-950">Atenção Especial:</strong>
                              <span>{ex.cautionNotes}</span>
                            </div>
                          )}

                          {ex.holdTime && (
                            <div className="pt-1">
                              <WorkoutTimer
                                initialSeconds={30}
                                label={`Tempo de Isometria (${ex.holdTime})`}
                              />
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleCompleted(ex.id)}
                              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                                isDone
                                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {isDone ? 'Desmarcar' : 'Concluir Exercício ✓'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MINHA EVOLUÇÃO (FOTOS ANTES VS DEPOIS) */}
        {activeTab === 'transformation' && (
          <div className="space-y-6">
            <div className="pb-1">
              <h3 className="text-base font-bold text-slate-900">
                Sua Evolução Visual: Início vs. Atual
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Veja o ganho real de postura e amplitude física conquistado nas sessões
              </p>
            </div>

            {beforePhoto || afterPhoto ? (
              <BeforeAfterViewer
                beforePhoto={beforePhoto}
                afterPhoto={afterPhoto}
                title="Sua Transformação Clínica"
                subtitle="Arraste a linha divisória para comparar sua mobilidade"
                metricComparison={
                  primaryRom
                    ? {
                        jointMovement: `${primaryRom.joint} - ${primaryRom.movement}`,
                        degreesBefore: initialRom?.currentDegrees ?? primaryRom.baselineDegrees,
                        degreesAfter: primaryRom.currentDegrees,
                        painBefore: firstEvo?.painEVA,
                        painAfter: latestEvo?.painEVA
                      }
                    : undefined
                }
              />
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-xs text-xs text-slate-500">
                Ainda não há fotos de evolução cadastradas para o seu prontuário.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HISTÓRICO DE TREINOS */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-base font-bold text-slate-900">
                Histórico de Treinos e Sensações
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Registros de dor e esforço comunicados ao seu fisioterapeuta
              </p>
            </div>

            {patient.patientLogs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-xs text-sm text-slate-500">
                Nenhum treino registrado ainda. Finalize o treino de hoje para iniciar seu histórico.
              </div>
            ) : (
              <div className="space-y-3">
                {patient.patientLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {new Date(log.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        log.painPostWorkout <= 2
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        Dor EVA: {log.painPostWorkout}/10
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      <span>Exercícios Concluídos: <strong className="text-slate-800">{log.completedExercisesIds.length}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Esforço Percebido: <strong className="text-slate-800">{log.perceivedEffort}/10</strong></span>
                    </div>

                    {log.patientComment && (
                      <p className="text-xs text-slate-700 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100/60 italic font-medium">
                        &ldquo;{log.patientComment}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Post Workout Feedback Modal */}
      <PostWorkoutFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        completedExercisesIds={completedIds}
        totalExercises={patient.prescriptions.length}
        onSaveFeedback={onSaveFeedback}
      />
    </div>
  );
};
