import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { AIPrescriptionDraft, PrescriptionExercise, Patient, ExerciseCategory } from '../../types';
import { AIAssistantService } from '../../services/aiAssistant';
import { ClipboardList, AlertTriangle, Check, Plus, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onApplyPlan: (exercises: PrescriptionExercise[], suggestedGoals: string[], mode?: 'append' | 'replace') => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  patient,
  onApplyPlan
}) => {
  const [prompt, setPrompt] = useState(patient.condition || 'Lesão de LCA - 2ª semana pós-op');
  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<AIPrescriptionDraft | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const presets = [
    'Lesão de LCA - 2ª semana pós-op',
    'Tendinopatia do Manguito Rotador (Fase Aguda)',
    'Lombalgia Mecânica com Protrusão L5-S1',
    'Entorse de Tornozelo por Inversão (Fase 2)',
    'Tendinopatia Patelar em Corredor',
    'Fascite Plantar Crônica'
  ];

  const handleGenerate = async (queryText?: string) => {
    const textToUse = queryText || prompt;
    if (!textToUse.trim()) return;

    setLoading(true);
    setAppliedSuccess(false);

    try {
      const result = await AIAssistantService.generateTreatmentPlan(textToUse);
      setGeneratedDraft(result);
    } catch (err) {
      console.error('Error generating AI plan:', err);
      alert('Erro ao processar plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToPatient = (mode: 'append' | 'replace' = 'append') => {
    if (!generatedDraft || !generatedDraft.exercises) return;

    const validCategories: ExerciseCategory[] = ['mobilidade', 'fortalecimento', 'alongamento', 'propriocepcao', 'controle_motor'];
    const normalizeCategory = (catStr: any): ExerciseCategory => {
      const lower = String(catStr || '').toLowerCase().trim();
      if (validCategories.includes(lower as ExerciseCategory)) return lower as ExerciseCategory;
      if (lower.includes('mob') || lower.includes('mov')) return 'mobilidade';
      if (lower.includes('along') || lower.includes('flex')) return 'alongamento';
      if (lower.includes('prop') || lower.includes('eq')) return 'propriocepcao';
      if (lower.includes('motor') || lower.includes('estabil')) return 'controle_motor';
      return 'fortalecimento';
    };

    const newExercises: PrescriptionExercise[] = generatedDraft.exercises.map((ex, idx) => ({
      id: `presc-ai-${Date.now()}-${idx}`,
      title: ex.title || 'Exercício Prescrito',
      category: normalizeCategory(ex.category),
      sets: ex.sets || '3 séries',
      reps: ex.reps || '12 repetições',
      holdTime: ex.holdTime,
      frequency: ex.frequency || '1x ao dia',
      instructions: ex.instructions || 'Execute com controle motor conforme orientação clínica.',
      cautionNotes: ex.cautionNotes,
      externalVideoUrl: ex.externalVideoUrl,
      completedToday: false
    }));

    onApplyPlan(newExercises, generatedDraft.suggestedGoals || [], mode);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assistente de Protocolos Clínicos"
      subtitle="Gere condutas e exercícios domiciliares inteligentes em segundos"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Prompt Input Box */}
        <div className="space-y-3.5 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <label className="block text-xs font-bold text-slate-800">
            Diagnóstico, Lesão ou Fase Cirúrgica:
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Ex: Pós-op de LCA 2ª semana, Hérnia discal L5-S1 aguda, Epicondilite..."
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all font-medium"
            />
            <button
              type="button"
              disabled={loading || !prompt.trim()}
              onClick={() => handleGenerate()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Sugerir Protocolo</span>
                </>
              )}
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs text-slate-400 font-semibold">Atalhos rápidos:</span>
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-xs px-3 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-full text-slate-700 font-medium transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {generatedDraft && (
          <div className="space-y-5">
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-md space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{generatedDraft.condition}</h4>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {generatedDraft.stageName}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {appliedSuccess ? (
                    <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">
                      <Check className="w-4 h-4" />
                      <span>Plano Aplicado com Sucesso!</span>
                    </span>
                  ) : patient.prescriptions && patient.prescriptions.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApplyToPatient('append')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all"
                        title="Acrescenta estes exercícios sem apagar os que já foram prescritos"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        <span>Adicionar aos Existentes ({patient.prescriptions.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyToPatient('replace')}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                        title="Substitui a rotina inteira por esta nova sugestão de IA"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Substituir Rotina Atual</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyToPatient('replace')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Aplicar à Rotina do Paciente</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rationale */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 text-xs text-slate-700 space-y-1">
                <strong className="font-bold text-blue-950 block">
                  Racional Clínico & Fisiológico:
                </strong>
                <p className="leading-relaxed">{generatedDraft.clinicalRationale}</p>
              </div>

              {/* Red flags */}
              {generatedDraft.redFlags && generatedDraft.redFlags.length > 0 && (
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Contraindicações & Cuidados Desta Fase:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-900 space-y-0.5 pl-1 font-medium">
                    {generatedDraft.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Exercises */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Exercícios Domiciliares Sugeridos ({generatedDraft.exercises.length})
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedDraft.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="neutral">
                          {ex.category}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500">
                          {ex.frequency}
                        </span>
                      </div>

                      <h6 className="text-sm font-bold text-slate-900">{ex.title}</h6>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{ex.sets}</span>
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{ex.reps}</span>
                        {ex.holdTime && (
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">{ex.holdTime}</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {ex.instructions}
                      </p>

                      {ex.cautionNotes && (
                        <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                          Atenção: {ex.cautionNotes}
                        </p>
                      )}
                    </div>

                    {ex.externalVideoUrl && (
                      <div className="pt-2 border-t border-slate-100">
                        <a
                          href={ex.externalVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          <span>Ver demonstração técnica externa</span>
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
