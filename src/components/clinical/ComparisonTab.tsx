import React, { useState } from 'react';
import { Patient, EvolutionPhoto } from '../../types';
import { BeforeAfterViewer } from './BeforeAfterViewer';
import { Image as ImageIcon, Camera, Trash2, Plus } from 'lucide-react';
import { PhotoUploadModal } from './PhotoUploadModal';

interface ComparisonTabProps {
  patient: Patient;
  onOpenNewEvolution: () => void;
  onAddPhoto: (photo: EvolutionPhoto) => void;
  onDeletePhoto: (photoId: string) => void;
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({
  patient,
  onOpenNewEvolution,
  onAddPhoto,
  onDeletePhoto
}) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Extract all photos
  const allPhotos: EvolutionPhoto[] = [];
  (patient.evolutions || []).forEach((evo) => {
    if (evo.evolutionPhotos) {
      allPhotos.push(...evo.evolutionPhotos);
    }
  });

  const beforePhoto = allPhotos.find(p => p.stage === 'antes') || allPhotos[allPhotos.length - 1];
  const afterPhoto = allPhotos.find(p => p.stage === 'depois') || allPhotos[0];

  const firstEvo = patient.evolutions?.[patient.evolutions.length - 1];
  const latestEvo = patient.evolutions?.[0];
  const primaryRom = latestEvo?.mobilityMetrics?.[0];
  const initialRom = firstEvo?.mobilityMetrics?.find(m => m.movement === primaryRom?.movement);

  const handleDeletePhotoConfirm = (photoId: string, label: string) => {
    if (confirm(`Deseja realmente excluir a foto "${label}"?`)) {
      onDeletePhoto(photoId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
            Comparativo Visual Clínico (Antes vs. Depois)
          </h2>
          <p className="text-xs text-zinc-600">
            Acompanhe visualmente a correção postural, alinhamento biomecânico e ganho angular
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPhotoModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-blue-700 transition-all self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>Anexar Nova Foto</span>
        </button>
      </div>

      {/* Main Interactive Viewer */}
      {beforePhoto || afterPhoto ? (
        <BeforeAfterViewer
          beforePhoto={beforePhoto}
          afterPhoto={afterPhoto}
          title="Evolução da Amplitude & Postura"
          subtitle="Arraste o divisor central para confrontar o estado inicial com a sessão mais recente"
          metricComparison={
            primaryRom
              ? {
                  jointMovement: `${primaryRom.joint} - ${primaryRom.movement}`,
                  degreesBefore: initialRom?.currentDegrees ?? primaryRom.baselineDegrees,
                  degreesAfter: primaryRom.currentDegrees,
                  painBefore: firstEvo?.painEVA,
                  painAfter: latestEvo?.painEVA
                }
              : undefined
          }
        />
      ) : (
        <div className="p-14 text-center bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Nenhuma foto registrada ainda</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Anexe fotos de postura ou amplitude de movimento para ativar o comparativo interativo antes vs. depois.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Anexar Primeira Foto</span>
          </button>
        </div>
      )}

      {/* Photo Log Gallery */}
      {allPhotos.length > 0 && (
        <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Todas as Fotos Registradas ({allPhotos.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar foto</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allPhotos.map((photo, i) => (
              <div
                key={photo.id || i}
                className="group relative border border-slate-100 bg-slate-50/70 rounded-2xl p-3 space-y-2.5 hover:shadow-md hover:bg-white transition-all"
              >
                <div className="h-40 bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.label}
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhotoConfirm(photo.id, photo.label)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Excluir foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block truncate" title={photo.label}>
                    {photo.label}
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase font-bold">
                      {photo.stage}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {photo.date ? new Date(photo.date).toLocaleDateString('pt-BR') : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSavePhoto={onAddPhoto}
        patientName={patient.name}
      />
    </div>
  );
};
