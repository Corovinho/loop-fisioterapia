import React, { useState } from 'react';
import { Patient, ExamDocument, EvolutionPhoto } from '../../types';
import { ComparisonTab } from './ComparisonTab';
import { ExamUploader } from '../patients/ExamUploader';
import { Image as ImageIcon, FileText } from 'lucide-react';

interface RecordsTabProps {
  patient: Patient;
  onOpenNewEvolution: () => void;
  onAddExam: (exam: ExamDocument) => void;
  onDeleteExam: (examId: string) => void;
  onAddPhoto: (photo: EvolutionPhoto) => void;
  onDeletePhoto: (photoId: string) => void;
}

export const RecordsTab: React.FC<RecordsTabProps> = ({
  patient,
  onOpenNewEvolution,
  onAddExam,
  onDeleteExam,
  onAddPhoto,
  onDeletePhoto
}) => {
  const [subTab, setSubTab] = useState<'photos' | 'exams'>('photos');

  const totalPhotos = (patient.evolutions || []).reduce((acc, evo) => acc + (evo.evolutionPhotos?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="bg-white p-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSubTab('photos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'photos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Fotos & Antes/Depois ({totalPhotos})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('exams')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'exams'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Exames & Laudos ({patient.exams?.length || 0})</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Arquivo e documentação visual de {patient.name}
        </span>
      </div>

      {/* Content */}
      {subTab === 'photos' ? (
        <ComparisonTab
          patient={patient}
          onOpenNewEvolution={onOpenNewEvolution}
          onAddPhoto={onAddPhoto}
          onDeletePhoto={onDeletePhoto}
        />
      ) : (
        <ExamUploader
          exams={patient.exams || []}
          onAddExam={onAddExam}
          onDeleteExam={onDeleteExam}
        />
      )}
    </div>
  );
};
