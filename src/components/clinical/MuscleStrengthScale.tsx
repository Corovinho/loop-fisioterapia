import React from 'react';
import { MuscleStrengthMetric } from '../../types';
import { Dumbbell } from 'lucide-react';

interface MuscleStrengthScaleProps {
  metrics: MuscleStrengthMetric[];
}

export const MuscleStrengthScale: React.FC<MuscleStrengthScaleProps> = ({ metrics }) => {
  const getOxfordDescription = (grade: number) => {
    switch (grade) {
      case 0: return { label: 'Grau 0', desc: 'Paralisia total (sem contração)' };
      case 1: return { label: 'Grau 1', desc: 'Vestígio de contração perceptível' };
      case 2: return { label: 'Grau 2', desc: 'Movimento ativo eliminando gravidade' };
      case 3: return { label: 'Grau 3', desc: 'Vence gravidade em ADM completa' };
      case 4: return { label: 'Grau 4', desc: 'Movimento contra resistência moderada' };
      case 5: return { label: 'Grau 5', desc: 'Força normal contra resistência máxima' };
      default: return { label: `Grau ${grade}`, desc: '' };
    }
  };

  if (metrics.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 text-center font-medium">
        Nenhum teste de força muscular registrado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <Dumbbell className="w-3.5 h-3.5 text-blue-600" /> Força Muscular (Oxford 0 a 5)
      </h5>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => {
          const info = getOxfordDescription(m.grade);
          return (
            <div key={m.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{m.muscleGroup}</span>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  {info.label} ({m.grade}/5)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{info.desc}</p>
              {m.notes && (
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                  {m.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
