import React from 'react';
import { RangeOfMotionMetric } from '../../types';
import { Compass } from 'lucide-react';

interface RangeOfMotionTrackerProps {
  metrics: RangeOfMotionMetric[];
}

export const RangeOfMotionTracker: React.FC<RangeOfMotionTrackerProps> = ({ metrics }) => {
  if (metrics.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 text-center font-medium">
        Nenhuma métrica de amplitude articular (ADM) registrada.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5 text-blue-600" /> Amplitude de Movimento (ADM em Graus °)
      </h5>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => {
          const totalRange = Math.abs(m.targetDegrees - m.baselineDegrees) || 1;
          const currentGain = Math.abs(m.currentDegrees - m.baselineDegrees);
          const percent = Math.min(100, Math.max(0, Math.round((currentGain / totalRange) * 100)));

          return (
            <div key={m.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{m.joint}</span>
                  <span className="text-xs text-slate-500">{m.movement}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-blue-700">{m.currentDegrees}°</span>
                  <span className="text-[11px] text-slate-400 block font-medium">Alvo: {m.targetDegrees}°</span>
                </div>
              </div>

              {/* Progress bar rounded */}
              <div className="space-y-1.5">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Inicial: {m.baselineDegrees}°</span>
                  <span className="text-blue-700 font-bold">{percent}% da meta</span>
                  <span>Alvo: {m.targetDegrees}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
