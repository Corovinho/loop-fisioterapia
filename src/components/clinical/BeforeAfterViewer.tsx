import React, { useState, useRef } from 'react';
import { EvolutionPhoto } from '../../types';
import { ArrowLeftRight, Columns2 } from 'lucide-react';

interface BeforeAfterViewerProps {
  beforePhoto?: EvolutionPhoto;
  afterPhoto?: EvolutionPhoto;
  title?: string;
  subtitle?: string;
  metricComparison?: {
    painBefore?: number;
    painAfter?: number;
    degreesBefore?: number;
    degreesAfter?: number;
    jointMovement?: string;
  };
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforePhoto,
  afterPhoto,
  title = 'Evolução Visual: Antes vs. Depois',
  subtitle = 'Comparativo de amplitude e alinhamento postural',
  metricComparison
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  if (!beforePhoto && !afterPhoto) {
    return null;
  }

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs space-y-5 p-5 sm:p-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            {title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {beforePhoto && afterPhoto && (
          <div className="bg-slate-100 p-1 rounded-full flex gap-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'slider'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Slider</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'side-by-side'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Lado a Lado</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      {metricComparison && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-100/60 text-xs">
          {metricComparison.jointMovement && (
            <div className="col-span-2 sm:col-span-1">
              <span className="text-blue-900/60 uppercase tracking-wider font-bold text-[10px] block">Movimento</span>
              <strong className="text-blue-950 text-sm font-extrabold">{metricComparison.jointMovement}</strong>
            </div>
          )}
          {metricComparison.degreesBefore !== undefined && metricComparison.degreesAfter !== undefined && (
            <div>
              <span className="text-blue-900/60 uppercase tracking-wider font-bold text-[10px] block">Ganho Angular (ADM)</span>
              <span className="text-slate-800 text-sm">
                {metricComparison.degreesBefore}° &rarr; <strong className="text-blue-700 font-extrabold">{metricComparison.degreesAfter}°</strong>
                <span className="text-emerald-600 font-bold ml-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +{metricComparison.degreesAfter - metricComparison.degreesBefore}°
                </span>
              </span>
            </div>
          )}
          {metricComparison.painBefore !== undefined && metricComparison.painAfter !== undefined && (
            <div>
              <span className="text-blue-900/60 uppercase tracking-wider font-bold text-[10px] block">Redução de Dor (EVA)</span>
              <span className="text-slate-800 text-sm">
                EVA {metricComparison.painBefore} &rarr; <strong className="text-emerald-700 font-extrabold">EVA {metricComparison.painAfter}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Visual Component Render */}
      {viewMode === 'slider' && beforePhoto && afterPhoto ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[420px] select-none bg-slate-950 rounded-2xl cursor-ew-resize overflow-hidden shadow-inner"
        >
          {/* AFTER (Current) Image (Background) */}
          <img
            src={afterPhoto.imageUrl}
            alt={afterPhoto.label}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Badge: DEPOIS */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-md">
              ATUAL • {afterPhoto.label}
            </span>
          </div>

          {/* BEFORE (Initial) Image (Clipped Overlay) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforePhoto.imageUrl}
              alt={beforePhoto.label}
              className="absolute inset-0 w-full h-full object-contain max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: '100%'
              }}
            />
            {/* Badge: ANTES */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-900/90 text-white shadow-md">
                INICIAL • {beforePhoto.label}
              </span>
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="absolute top-0 bottom-0 z-30 w-0.5 bg-white shadow-lg cursor-ew-resize flex items-center justify-center -translate-x-1/2"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        /* SIDE-BY-SIDE MODE */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {beforePhoto && (
            <div className="space-y-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/70">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-800">Estado Inicial (Antes)</span>
                <span className="text-slate-400 font-medium">{new Date(beforePhoto.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="h-72 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <img
                  src={beforePhoto.imageUrl}
                  alt={beforePhoto.label}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-700 font-semibold">{beforePhoto.label}</p>
            </div>
          )}

          {afterPhoto && (
            <div className="space-y-2 border border-emerald-100 rounded-2xl p-4 bg-emerald-50/30">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-emerald-900">Estado Atual (Depois)</span>
                <span className="text-emerald-600/70 font-medium">{new Date(afterPhoto.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="h-72 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <img
                  src={afterPhoto.imageUrl}
                  alt={afterPhoto.label}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-700 font-semibold">{afterPhoto.label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
