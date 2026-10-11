import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface WorkoutTimerProps {
  initialSeconds?: number;
  label?: string;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  initialSeconds = 30,
  label = 'Cronômetro de Isometria'
}) => {
  const [targetSeconds, setTargetSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(targetSeconds);
  };

  const handleSelectTime = (sec: number) => {
    setIsRunning(false);
    setTargetSeconds(sec);
    setSecondsLeft(sec);
  };

  return (
    <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center">
          <Timer className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            {label}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-extrabold tracking-tight ${secondsLeft === 0 ? 'text-emerald-400' : 'text-white'}`}>
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </span>
            {secondsLeft === 0 && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Concluído!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-full">
          {[15, 30, 45, 60].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelectTime(s)}
              className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                targetSeconds === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}s
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-xs"
          title={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Reiniciar"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
