import React, { useState, useEffect, useRef } from 'react';
import { PrescriptionExercise } from '../../types';
import { X, Play, Pause, RotateCcw, Check, ChevronLeft, ChevronRight, AlertCircle, Dumbbell, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: PrescriptionExercise[];
  onFinishWorkout: (completedIds: string[]) => void;
}

export const GuidedWorkoutModal: React.FC<GuidedWorkoutModalProps> = ({
  isOpen,
  onClose,
  exercises,
  onFinishWorkout
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  
  // Timer state
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [initialTimerSeconds, setInitialTimerSeconds] = useState<number>(30);
  const timerRef = useRef<any>(null);

  // Play audio beep using Web Audio API
  const playBeep = (freq: number = 660, duration: number = 0.15) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked by user gesture policy
    }
  };

  const currentExercise = exercises[currentIndex];

  // Set default timer based on holdTime if detected (e.g. "30 segundos" -> 30)
  useEffect(() => {
    if (!currentExercise) return;
    let detectedSeconds = 30;
    if (currentExercise.holdTime) {
      const match = currentExercise.holdTime.match(/\d+/);
      if (match) detectedSeconds = parseInt(match[0], 10);
    }
    setInitialTimerSeconds(detectedSeconds);
    setSecondsLeft(detectedSeconds);
    setTimerRunning(false);
  }, [currentIndex, currentExercise]);

  // Timer countdown effect with beeps
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playBeep(880, 0.4); // Completion beep
            return 0;
          }
          if (prev <= 4) {
            playBeep(520, 0.1); // Countdown warning beep
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  if (!isOpen || !currentExercise) return null;

  const progressPercent = Math.round(((currentIndex + 1) / exercises.length) * 100);

  const handleNext = (markComplete: boolean = true) => {
    const newCompleted = markComplete && !completedIds.includes(currentExercise.id)
      ? [...completedIds, currentExercise.id]
      : completedIds;

    setCompletedIds(newCompleted);

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed last exercise!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      onFinishWorkout(newCompleted);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isCurrentCompleted = completedIds.includes(currentExercise.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Exercício {currentIndex + 1} de {exercises.length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {currentExercise.category}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* Title & Prescription Dose */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentExercise.title}
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                {currentExercise.sets}
              </span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                {currentExercise.reps}
              </span>
              {currentExercise.holdTime && (
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/80">
                  Sustentar: {currentExercise.holdTime}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Countdown Timer */}
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Cronômetro de Execução / Sustentação:
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900">
                {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                  timerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar Contagem</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(initialTimerSeconds);
                }}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Instruções de Postura & Execução:
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              {currentExercise.instructions}
            </p>
          </div>

          {/* Caution note if any */}
          {currentExercise.cautionNotes && (
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Atenção ao executar:</strong>
                <span>{currentExercise.cautionNotes}</span>
              </div>
            </div>
          )}

          {/* External video demonstration link */}
          {currentExercise.externalVideoUrl && (
            <div className="pt-1">
              <a
                href={currentExercise.externalVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-blue-700 rounded-full transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Vídeo Demonstrativo</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNext(false)}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              Pular
            </button>

            <button
              type="button"
              onClick={() => handleNext(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{currentIndex === exercises.length - 1 ? 'Concluir Treino ✓' : 'Concluir & Próximo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
