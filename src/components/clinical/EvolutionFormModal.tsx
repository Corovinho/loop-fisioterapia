import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ClinicalEvolution, RangeOfMotionMetric, MuscleStrengthMetric, EvolutionPhoto, TreatmentGoal, PainLevel } from '../../types';
import { PainScaleSlider } from './PainScaleSlider';
import { Plus, Trash2, Camera, Compass, Dumbbell, Target, ChevronDown, ChevronUp, Zap, Loader2, X } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

interface EvolutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evolution: ClinicalEvolution) => void;
  previousEvolution?: ClinicalEvolution;
}

export const EvolutionFormModal: React.FC<EvolutionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  previousEvolution
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [painEVA, setPainEVA] = useState<PainLevel>(previousEvolution ? Math.max(0, previousEvolution.painEVA - 1) : 4);
  const [conductToday, setConductToday] = useState('');
  const [functionalCurrent, setFunctionalCurrent] = useState('');
  const [functionalPrevious, setFunctionalPrevious] = useState(previousEvolution ? previousEvolution.functionalCurrent : '');

  // Toggle for advanced reassessment section
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mobility metrics (ADM)
  const [mobilityMetrics, setMobilityMetrics] = useState<RangeOfMotionMetric[]>(
    previousEvolution?.mobilityMetrics.map(m => ({ ...m, id: `rom-${Date.now()}-${Math.random()}` })) || [
      {
        id: `rom-1`,
        joint: 'Joelho',
        movement: 'Flexão Ativa',
        baselineDegrees: 45,
        currentDegrees: 90,
        targetDegrees: 135
      }
    ]
  );

  // Strength metrics
  const [strengthMetrics, setStrengthMetrics] = useState<MuscleStrengthMetric[]>(
    previousEvolution?.strengthMetrics.map(s => ({ ...s, id: `str-${Date.now()}-${Math.random()}` })) || [
      {
        id: 'str-1',
        muscleGroup: 'Quadríceps',
        grade: 3,
        notes: ''
      }
    ]
  );

  // Photos
  const [evolutionPhotos, setEvolutionPhotos] = useState<EvolutionPhoto[]>([]);
  const [photoLabel, setPhotoLabel] = useState('');
  const [photoStage, setPhotoStage] = useState<'antes' | 'durante' | 'depois'>('depois');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // Goals
  const [goals, setGoals] = useState<TreatmentGoal[]>(
    previousEvolution?.goals || [
      { id: 'g-1', description: 'Controle de dor em repouso (EVA <= 2)', status: 'in_progress' },
      { id: 'g-2', description: 'Ganho de amplitude funcional', status: 'in_progress' },
      { id: 'g-3', description: 'Independência na marcha e AVDs', status: 'pending' }
    ]
  );
  const [newGoalDesc, setNewGoalDesc] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingPhoto(true);
    try {
      const res = await compressImage(file, 1280, 1280, 0.82);
      const newP: EvolutionPhoto = {
        id: `photo-${Date.now()}`,
        date,
        label: photoLabel.trim() || (photoStage === 'depois' ? 'Estado Atual' : photoStage === 'antes' ? 'Registro Inicial' : 'Evolução Intermediária'),
        stage: photoStage,
        imageUrl: res.dataUrl
      };
      setEvolutionPhotos(prev => [...prev, newP]);
      setPhotoLabel('');
      if (e.target) e.target.value = '';
    } catch (err) {
      console.error('Error compressing photo:', err);
      alert('Erro ao carregar a foto. Tente novamente.');
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const removePhoto = (photoId: string) => {
    setEvolutionPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const addMobilityRow = () => {
    setMobilityMetrics([
      ...mobilityMetrics,
      {
        id: `rom-${Date.now()}`,
        joint: 'Articulação',
        movement: 'Movimento',
        baselineDegrees: 0,
        currentDegrees: 0,
        targetDegrees: 90
      }
    ]);
  };

  const addStrengthRow = () => {
    setStrengthMetrics([
      ...strengthMetrics,
      {
        id: `str-${Date.now()}`,
        muscleGroup: 'Grupo Muscular',
        grade: 3,
        notes: ''
      }
    ]);
  };

  const addGoal = () => {
    if (!newGoalDesc.trim()) return;
    setGoals([
      ...goals,
      {
        id: `g-${Date.now()}`,
        description: newGoalDesc.trim(),
        status: 'in_progress'
      }
    ]);
    setNewGoalDesc('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFunctional = functionalCurrent.trim() || conductToday.trim();
    if (!finalFunctional) {
      alert('Informe a conduta ou evolução do paciente hoje.');
      return;
    }

    const evolution: ClinicalEvolution = {
      id: `evo-${Date.now()}`,
      date,
      functionalPrevious: functionalPrevious.trim() || 'Sem registro anterior',
      functionalCurrent: finalFunctional,
      painEVA,
      mobilityMetrics: showAdvanced ? mobilityMetrics : (previousEvolution?.mobilityMetrics || []),
      strengthMetrics: showAdvanced ? strengthMetrics : (previousEvolution?.strengthMetrics || []),
      evolutionPhotos: evolutionPhotos.length > 0 ? evolutionPhotos : (previousEvolution?.evolutionPhotos || []),
      goals: showAdvanced ? goals : (previousEvolution?.goals || goals),
      notes: conductToday.trim()
    };

    onSave(evolution);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Atendimento do Dia"
      subtitle="Evolução clínica rápida da sessão em menos de 1 minuto"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top Info Bar: Date & Fast Pain EVA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Data da Sessão
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <PainScaleSlider value={painEVA} onChange={setPainEVA} />
          </div>
        </div>

        {/* 1. Conduta realizada hoje */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1.5">
            1. Conduta & O que foi realizado hoje na sessão *
          </label>
          <textarea
            rows={2}
            required
            value={conductToday}
            onChange={(e) => setConductToday(e.target.value)}
            placeholder="Ex: Liberação miofascial de gastrocnêmio, ativação isométrica de VMO e treino de controle de agachamento bipodal."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden font-medium transition-all"
          />
        </div>

        {/* 2. Resposta clínica do paciente */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            2. Resposta do Paciente / Status na Saída
          </label>
          <textarea
            rows={2}
            value={functionalCurrent}
            onChange={(e) => setFunctionalCurrent(e.target.value)}
            placeholder="Ex: Relatou alívio imediato da dor, amplitude com menos bloqueio. Conseguiu apoiar peso sem claudicar."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden font-medium transition-all"
          />
        </div>

        {/* Advanced Accordion Toggle for Gonio, Strength, Photos */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-4 py-3 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Avaliação Avançada Opcional (Amplitude, Força, Fotos & Metas)</span>
            </div>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showAdvanced && (
            <div className="p-4 space-y-5 bg-white border-t border-slate-100">
              {/* Métricas Objetivas: ADM (Graus) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-600" /> Amplitude Articular (ADM em Graus °)
                  </h4>
                  <button
                    type="button"
                    onClick={addMobilityRow}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Medição
                  </button>
                </div>

                <div className="space-y-2">
                  {mobilityMetrics.map((m, idx) => (
                    <div key={m.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={m.joint}
                          onChange={(e) => {
                            const updated = [...mobilityMetrics];
                            updated[idx].joint = e.target.value;
                            setMobilityMetrics(updated);
                          }}
                          placeholder="Articulação"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={m.movement}
                          onChange={(e) => {
                            const updated = [...mobilityMetrics];
                            updated[idx].movement = e.target.value;
                            setMobilityMetrics(updated);
                          }}
                          placeholder="Movimento (ex: Flexão)"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold block">Atual (°)</label>
                        <input
                          type="number"
                          value={m.currentDegrees}
                          onChange={(e) => {
                            const updated = [...mobilityMetrics];
                            updated[idx].currentDegrees = Number(e.target.value);
                            setMobilityMetrics(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-700"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold block">Alvo (°)</label>
                        <input
                          type="number"
                          value={m.targetDegrees}
                          onChange={(e) => {
                            const updated = [...mobilityMetrics];
                            updated[idx].targetDegrees = Number(e.target.value);
                            setMobilityMetrics(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <button
                          type="button"
                          onClick={() => setMobilityMetrics(mobilityMetrics.filter(item => item.id !== m.id))}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas Objetivas: Força Muscular */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-blue-600" /> Força Muscular (Oxford 0 a 5)
                  </h4>
                  <button
                    type="button"
                    onClick={addStrengthRow}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Teste
                  </button>
                </div>

                <div className="space-y-2">
                  {strengthMetrics.map((s, idx) => (
                    <div key={s.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={s.muscleGroup}
                          onChange={(e) => {
                            const updated = [...strengthMetrics];
                            updated[idx].muscleGroup = e.target.value;
                            setStrengthMetrics(updated);
                          }}
                          placeholder="Grupo Muscular (ex: Quadríceps)"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={s.grade}
                          onChange={(e) => {
                            const updated = [...strengthMetrics];
                            updated[idx].grade = Number(e.target.value);
                            setStrengthMetrics(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-700"
                        >
                          <option value={0}>Grau 0 (Nenhuma)</option>
                          <option value={1}>Grau 1 (Vestígio)</option>
                          <option value={2}>Grau 2 (Sem gravidade)</option>
                          <option value={3}>Grau 3 (Vence gravidade)</option>
                          <option value={4}>Grau 4 (Contra resistência)</option>
                          <option value={5}>Grau 5 (Normal)</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={s.notes || ''}
                          onChange={(e) => {
                            const updated = [...strengthMetrics];
                            updated[idx].notes = e.target.value;
                            setStrengthMetrics(updated);
                          }}
                          placeholder="Obs clínica"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => setStrengthMetrics(strengthMetrics.filter(item => item.id !== s.id))}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro Visual: Fotos de Evolução */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-600" /> Anexar Foto de Amplitude ou Postura
                  </h4>
                  {isCompressingPhoto && (
                    <span className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Otimizando foto...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Momento da Foto</label>
                    <select
                      value={photoStage}
                      onChange={(e) => setPhotoStage(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="depois">Estado Atual (Depois)</option>
                      <option value="durante">Evolução Intermediária</option>
                      <option value="antes">Registro Inicial (Antes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Legenda (Opcional)</label>
                    <input
                      type="text"
                      value={photoLabel}
                      onChange={(e) => setPhotoLabel(e.target.value)}
                      placeholder="Ex: Flexão Máxima Ativa"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Selecionar Imagem</label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingPhoto}
                      onChange={handlePhotoUpload}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Display attached evolution photos */}
                {evolutionPhotos.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      Fotos anexadas a este atendimento ({evolutionPhotos.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {evolutionPhotos.map((p) => (
                        <div key={p.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white p-1.5 shadow-2xs">
                          <div className="w-full h-24 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
                            <img src={p.imageUrl} alt={p.label} className="w-full h-full object-contain" />
                          </div>
                          <div className="pt-1 flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-800 truncate" title={p.label}>{p.label}</span>
                            <span className="text-blue-600 uppercase font-semibold">{p.stage}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(p.id)}
                            className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity shadow-xs"
                            title="Remover foto"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Preenchimento rápido em menos de 1 minuto
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Salvar Atendimento</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

