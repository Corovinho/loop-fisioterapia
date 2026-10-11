import React from 'react';
import { Modal } from '../common/Modal';
import { ExamDocument } from '../../types';
import { FileText, Download, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ExamViewerModalProps {
  exam: ExamDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (examId: string) => void;
}

export const ExamViewerModal: React.FC<ExamViewerModalProps> = ({
  exam,
  isOpen,
  onClose,
  onDelete
}) => {
  if (!exam) return null;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'raio-x': return <Badge variant="neutral">Raio-X</Badge>;
      case 'ressonancia': return <Badge variant="default">Ressonância (RM)</Badge>;
      case 'ultrassom': return <Badge variant="neutral">Ultrassom</Badge>;
      case 'laudo': return <Badge variant="warning">Laudo Médico</Badge>;
      default: return <Badge variant="neutral">Documento</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exam.title}
      subtitle={`Registrado em ${new Date(exam.date).toLocaleDateString('pt-BR')}`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Meta Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {getTypeBadge(exam.type)}
            {exam.fileName && (
              <span className="text-xs text-zinc-600 font-semibold">
                {exam.fileName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={exam.fileUrl}
              download={exam.fileName || 'exame-loop'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo</span>
            </a>

            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('Deseja realmente remover este exame?')) {
                    onDelete(exam.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover</span>
              </button>
            )}
          </div>
        </div>

        {/* Image / Preview Display */}
        <div className="bg-slate-950 rounded-2xl flex items-center justify-center min-h-[350px] max-h-[550px] p-2 overflow-hidden shadow-inner">
          {exam.fileUrl.startsWith('data:image') || exam.fileUrl.endsWith('.png') || exam.fileUrl.endsWith('.jpg') || exam.fileUrl.endsWith('.jpeg') || exam.fileUrl.includes('data:image/svg') ? (
            <img
              src={exam.fileUrl}
              alt={exam.title}
              className="max-h-[500px] w-auto object-contain rounded-lg"
            />
          ) : (
            <div className="text-center p-8 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-500" />
              <p className="text-sm font-bold text-slate-200">Documento Clínico Anexado</p>
              <p className="text-xs text-slate-400 mt-1">{exam.fileName || 'Arquivo'}</p>
            </div>
          )}
        </div>

        {/* Clinical Notes */}
        {exam.notes && (
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 space-y-1">
            <h5 className="text-xs font-bold text-blue-900">
              Laudo / Parecer do Fisioterapeuta:
            </h5>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {exam.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
