import React, { useState } from 'react';
import { ExamDocument, ExamType } from '../../types';
import { FileText, Plus, Eye, Trash2, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ExamViewerModal } from './ExamViewerModal';
import { compressImage } from '../../utils/imageCompressor';

interface ExamUploaderProps {
  exams: ExamDocument[];
  onAddExam: (exam: ExamDocument) => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamUploader: React.FC<ExamUploaderProps> = ({
  exams,
  onAddExam,
  onDeleteExam
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamDocument | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ExamType>('ressonancia');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileSizeInfo, setFileSizeInfo] = useState<{ originalKb: number; compressedKb: number } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    setIsProcessing(true);
    try {
      const result = await compressImage(file, 1280, 1280, 0.82);
      setFileUrl(result.dataUrl);
      setFileSizeInfo({
        originalKb: result.originalSizeKb,
        compressedKb: result.compressedSizeKb
      });
    } catch (err) {
      console.error('Error processing exam file:', err);
      alert('Erro ao carregar o arquivo do exame. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl) {
      alert('Por favor, selecione um arquivo de imagem/exame e informe o título.');
      return;
    }

    const newExam: ExamDocument = {
      id: `exam-${Date.now()}`,
      title: title.trim(),
      type,
      date,
      fileUrl,
      fileName,
      notes: notes.trim()
    };

    onAddExam(newExam);
    setIsUploading(false);
    setTitle('');
    setNotes('');
    setFileUrl('');
    setFileName('');
    setFileSizeInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Exames & Documentos Clínicos
          </h2>
          <p className="text-xs text-slate-500">
            Armazenamento de imagens de Raio-X, Ressonâncias e laudos médicos
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploading(!isUploading)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-blue-700 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isUploading ? 'Fechar Formulário' : 'Anexar Exame'}</span>
        </button>
      </div>

      {/* Upload Form */}
      {isUploading && (
        <form onSubmit={handleSave} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Anexar Novo Exame
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Exame *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Ressonância Magnética de Joelho D"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Exame</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ExamType)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              >
                <option value="ressonancia">Ressonância Magnética (RM)</option>
                <option value="raio-x">Raio-X (Radiografia)</option>
                <option value="ultrassom">Ultrassonografia (USG)</option>
                <option value="tomografia">Tomografia Computadorizada</option>
                <option value="laudo">Laudo Médico</option>
                <option value="outro">Outro Documento</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data do Exame</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Arquivo (Foto / Imagem / Laudo) *</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          {/* Upload preview / optimization indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-700 font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Otimizando e comprimindo arquivo para gravação rápida...</span>
            </div>
          )}

          {fileUrl && !isProcessing && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                {fileUrl.startsWith('data:image') || fileUrl.includes('image/') ? (
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div className="truncate text-xs">
                  <span className="font-bold text-slate-900 block truncate">{fileName || 'Arquivo selecionado'}</span>
                  {fileSizeInfo && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Imagem otimizada: {fileSizeInfo.compressedKb} KB (era {fileSizeInfo.originalKb} KB)
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileUrl('');
                  setFileName('');
                  setFileSizeInfo(null);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                title="Trocar arquivo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Achados Clínicos / Notas do Laudo</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva os achados relevantes do exame..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing || !fileUrl}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm disabled:opacity-50 transition-all"
            >
              Salvar Exame
            </button>
          </div>
        </form>
      )}

      {/* Exam Gallery */}
      {exams.length === 0 ? (
        <div className="p-14 text-center rounded-3xl border border-slate-100 bg-white shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Nenhum exame anexado</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Anexe fotos de raios-X ou ressonâncias para consulta rápida durante o tratamento.
          </p>
          <button
            type="button"
            onClick={() => setIsUploading(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
          >
            Anexar Primeiro Exame
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-5 bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default">{exam.type.toUpperCase()}</Badge>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(exam.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Thumbnail Preview */}
                <div
                  onClick={() => setSelectedExam(exam)}
                  className="h-44 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer group relative"
                >
                  {exam.fileUrl.startsWith('data:image') || exam.fileUrl.includes('data:image/svg') || exam.fileUrl.endsWith('.png') || exam.fileUrl.endsWith('.jpg') ? (
                    <img
                      src={exam.fileUrl}
                      alt={exam.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs text-slate-300 font-semibold">{exam.fileName}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    <Eye className="w-5 h-5 mr-1" /> Ver Laudo / Imagem
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{exam.title}</h4>
                  {exam.notes && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{exam.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedExam(exam)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Abrir Exame
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remover exame "${exam.title}"?`)) {
                      onDeleteExam(exam.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewer Modal */}
      {selectedExam && (
        <ExamViewerModal
          exam={selectedExam}
          isOpen={!!selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};
