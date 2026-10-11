import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PatientDailyFeedback, PainLevel } from '../../types';
import { PainScaleSlider } from '../clinical/PainScaleSlider';
import { CheckCircle2, MessageSquare, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostWorkoutFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedExercisesIds: string[];
  totalExercises: number;
  onSaveFeedback: (feedback: PatientDailyFeedback) => void;
}

export const PostWorkoutFeedbackModal: React.FC<PostWorkoutFeedbackModalProps> = ({
  isOpen,
  onClose,
  completedExercisesIds,
  totalExercises,
  onSaveFeedback
}) => {
  const [painPostWorkout, setPainPostWorkout] = useState<PainLevel>(1);
  const [perceivedEffort, setPerceivedEffort] = useState(4); // 1 to 10
  const [patientComment, setPatientComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    confetti({
      particleCount: 60,
      spread: 45,
      origin: { y: 0.7 }
    });

    const feedback: PatientDailyFeedback = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      completedExercisesIds,
      painPostWorkout,
      perceivedEffort,
      patientComment: patientComment.trim() || undefined
    };

    onSaveFeedback(feedback);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Concluir Rotina de Exercícios"
      subtitle="Conte ao seu fisioterapeuta como foi sua execução hoje"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Progress bar */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-emerald-900 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Exercícios Realizados
          </span>
          <span className="text-emerald-800 font-bold bg-white px-3 py-1 rounded-full shadow-xs border border-emerald-100">
            {completedExercisesIds.length} de {totalExercises} feitos
          </span>
        </div>

        {/* Pain EVA Slider */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <label className="block text-xs font-bold text-slate-800 mb-3">
            Qual foi o seu nível de dor durante ou após os exercícios?
          </label>
          <PainScaleSlider value={painPostWorkout} onChange={setPainPostWorkout} />
        </div>

        {/* Perceived Effort (1 to 10) */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-blue-600" />
              Percepção de Esforço Físico (1 a 10)
            </label>
            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Nível {perceivedEffort}/10
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={perceivedEffort}
            onChange={(e) => setPerceivedEffort(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
            <span>1 = Muito Leve</span>
            <span>5 = Moderado</span>
            <span>10 = Esforço Máximo</span>
          </div>
        </div>

        {/* Comment field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            Observações para o Fisioterapeuta (Opcional)
          </label>
          <textarea
            rows={2}
            value={patientComment}
            onChange={(e) => setPatientComment(e.target.value)}
            placeholder="Ex: Consegui esticar bem a perna sem desconforto..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
          >
            Salvar Treino de Hoje ✓
          </button>
        </div>
      </form>
    </Modal>
  );
};
