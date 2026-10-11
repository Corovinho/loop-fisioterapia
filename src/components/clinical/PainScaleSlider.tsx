import React from 'react';

interface PainScaleSliderProps {
  value: number; // 0 to 10
  onChange?: (val: number) => void;
  readOnly?: boolean;
}

export const PainScaleSlider: React.FC<PainScaleSliderProps> = ({
  value,
  onChange,
  readOnly = false
}) => {
  const getDescriptor = (val: number) => {
    if (val === 0) return { label: 'Sem Dor', desc: 'Conforto total', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
    if (val <= 2) return { label: 'Dor Leve', desc: 'Perceptível, sem perda funcional', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
    if (val <= 4) return { label: 'Dor Moderada Leve', desc: 'Tolerável sem analgésico', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    if (val <= 6) return { label: 'Dor Moderada', desc: 'Interfere na amplitude', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    if (val <= 8) return { label: 'Dor Intensa', desc: 'Dificulta movimento e repouso', color: 'text-rose-800 bg-rose-50 border-rose-300' };
    return { label: 'Dor Insuportável', desc: 'Incapacitante', color: 'text-rose-900 bg-rose-100 border-rose-400' };
  };

  const currentDesc = getDescriptor(value);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">
          Escala Visual Analógica de Dor (EVA)
        </span>
        <div className={`px-3 py-1 text-xs font-bold rounded-full border ${currentDesc.color}`}>
          {value}/10 • {currentDesc.label}
        </div>
      </div>

      {/* Segmented Rounded Buttons */}
      <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
        {Array.from({ length: 11 }).map((_, i) => {
          const isSelected = value === i;
          let btnColor = 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200';
          if (isSelected) {
            if (i <= 2) btnColor = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
            else if (i <= 6) btnColor = 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs';
            else btnColor = 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(i)}
              className={`h-9 flex flex-col items-center justify-center rounded-xl border text-xs font-bold transition-all ${btnColor} ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-105'
              }`}
            >
              <span>{i}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
        <span>0 = Nenhuma Dor</span>
        <span>5 = Dor Moderada</span>
        <span>10 = Dor Máxima</span>
      </div>
    </div>
  );
};
