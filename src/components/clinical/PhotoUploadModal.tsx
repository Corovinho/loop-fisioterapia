import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { EvolutionPhoto } from '../../types';
import { compressImage } from '../../utils/imageCompressor';
import { Camera, Upload, Trash2, Check, Sparkles, Loader2 } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photo: EvolutionPhoto) => void;
  patientName: string;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  patientName
}) => {
  const [stage, setStage] = useState<'antes' | 'durante' | 'depois'>('depois');
  const [label, setLabel] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [compressionInfo, setCompressionInfo] = useState<{ originalKb: number; compressedKb: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStage('depois');
    setLabel('');
    setDate(new Date().toISOString().split('T')[0]);
    setPhotoDataUrl('');
    setCompressionInfo(null);
    setIsProcessing(false);
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await compressImage(file, 1280, 1280, 0.82);
      setPhotoDataUrl(result.dataUrl);
      setCompressionInfo({
        originalKb: result.originalSizeKb,
        compressedKb: result.compressedSizeKb
      });
      if (!label) {
        setLabel(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Erro ao carregar imagem. Tente novamente com outro arquivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoDataUrl) {
      alert('Por favor, selecione uma foto antes de salvar.');
      return;
    }

    const newPhoto: EvolutionPhoto = {
      id: `photo-${Date.now()}`,
      date,
      stage,
      label: label.trim() || (stage === 'antes' ? 'Registro Inicial' : stage === 'depois' ? 'Estado Atual' : 'Evolução Intermediária'),
      imageUrl: photoDataUrl
    };

    onSavePhoto(newPhoto);
    resetState();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetState();
        onClose();
      }}
      title="Anexar Foto Clínica"
      subtitle={`Documentação visual e comparativo de evolução para ${patientName}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Stage selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Classificação do Momento Clínico *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStage('antes')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                stage === 'antes'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="text-xs">Registro Inicial</div>
              <div className="text-[10px] text-slate-400 font-normal">Antes</div>
            </button>

            <button
              type="button"
              onClick={() => setStage('durante')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                stage === 'durante'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="text-xs">Intermediário</div>
              <div className="text-[10px] text-slate-400 font-normal">Durante</div>
            </button>

            <button
              type="button"
              onClick={() => setStage('depois')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                stage === 'depois'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="text-xs">Estado Atual</div>
              <div className="text-[10px] text-slate-400 font-normal">Depois</div>
            </button>
          </div>
        </div>

        {/* Label & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Legenda / Movimento Avaliado *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Flexão Ativa de Joelho, Alinhamento Escapular..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Data do Registro
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Dropzone / Upload area */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Foto do Paciente (Postura, Amplitude ou Teste Funcional) *
          </label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!photoDataUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold">Otimizando imagem para alta performance...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Clique para escolher a foto ou arraste aqui
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Suporta JPG, PNG, WEBP de qualquer resolução (comprime automaticamente)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-1 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
                  >
                    Selecionar Imagem
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="relative max-h-64 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={photoDataUrl}
                  alt="Pré-visualização da foto"
                  className="max-h-64 w-auto object-contain rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoDataUrl('');
                    setCompressionInfo(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-3 right-3 p-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full shadow-md transition-all"
                  title="Remover foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {compressionInfo && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Check className="w-3.5 h-3.5" /> Foto otimizada com sucesso
                  </span>
                  <span>
                    {compressionInfo.originalKb} KB ➔ <strong>{compressionInfo.compressedKb} KB</strong> (Leve & Rápido)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              resetState();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={!photoDataUrl || isProcessing}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Salvar Foto</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
