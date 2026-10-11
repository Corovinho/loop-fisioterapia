import React from 'react';
import { TreatmentGoal } from '../../types';
import { CheckCircle2, Clock, Circle, Target } from 'lucide-react';

interface GoalChecklistProps {
  goals: TreatmentGoal[];
  onToggleGoalStatus?: (goalId: string, currentStatus: TreatmentGoal['status']) => void;
  readOnly?: boolean;
}

export const GoalChecklist: React.FC<GoalChecklistProps> = ({
  goals,
  onToggleGoalStatus,
  readOnly = false
}) => {
  if (goals.length === 0) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 text-center">
        Nenhum objetivo específico cadastrado para esta fase.
      </div>
    );
  }

  const handleNextStatus = (goalId: string, currentStatus: TreatmentGoal['status']) => {
    if (readOnly || !onToggleGoalStatus) return;
    let next: TreatmentGoal['status'] = 'in_progress';
    if (currentStatus === 'pending') next = 'in_progress';
    else if (currentStatus === 'in_progress') next = 'achieved';
    else if (currentStatus === 'achieved') next = 'pending';
    onToggleGoalStatus(goalId, next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-600" /> Metas do Plano Terapêutico
        </h5>
        <span className="text-xs font-semibold text-slate-400">
          {goals.filter(g => g.status === 'achieved').length}/{goals.length} atingidos
        </span>
      </div>

      <div className="space-y-2">
        {goals.map((g) => {
          const isAchieved = g.status === 'achieved';
          const isInProgress = g.status === 'in_progress';

          return (
            <div
              key={g.id}
              onClick={() => handleNextStatus(g.id, g.status)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:shadow-xs'
              } ${
                isAchieved
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : isInProgress
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {isAchieved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isInProgress ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}

                <span className={`text-xs font-semibold ${isAchieved ? 'line-through text-emerald-900/70' : ''}`}>
                  {g.description}
                </span>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isAchieved
                    ? 'border-emerald-200 bg-emerald-100/70 text-emerald-800'
                    : isInProgress
                    ? 'border-amber-200 bg-amber-100/70 text-amber-800'
                    : 'border-slate-200 bg-slate-100 text-slate-600'
                }`}
              >
                {isAchieved ? 'Atingido' : isInProgress ? 'Em Progresso' : 'Pendente'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
