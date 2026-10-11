import React, { useState, useEffect } from 'react';
import { PrescriptionExercise, ExerciseCategory, Patient } from '../../types';
import { Plus, Trash2, Edit2, ExternalLink, Printer, ClipboardList, Send, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

interface PrescriptionBuilderProps {
  patient: Patient;
  onUpdatePrescriptions: (exercises: PrescriptionExercise[]) => void;
  onOpenAIAssistant: () => void;
}

export const PrescriptionBuilder: React.FC<PrescriptionBuilderProps> = ({
  patient,
  onUpdatePrescriptions,
  onOpenAIAssistant
}) => {
  const [exercises, setExercises] = useState<PrescriptionExercise[]>(patient.prescriptions || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Synchronize internal state whenever patient or external actions (like AI Assistant) update prescriptions
  useEffect(() => {
    setExercises(patient.prescriptions || []);
  }, [patient.prescriptions]);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('fortalecimento');
  const [sets, setSets] = useState('3 séries');
  const [reps, setReps] = useState('12 repetições');
  const [holdTime, setHoldTime] = useState('');
  const [frequency, setFrequency] = useState('2x ao dia');
  const [instructions, setInstructions] = useState('');
  const [cautionNotes, setCautionNotes] = useState('');
  const [externalVideoUrl, setExternalVideoUrl] = useState('');

  const resetForm = () => {
    setTitle('');
    setCategory('fortalecimento');
    setSets('3 séries');
    setReps('12 repetições');
    setHoldTime('');
    setFrequency('2x ao dia');
    setInstructions('');
    setCautionNotes('');
    setExternalVideoUrl('');
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSendWhatsApp = () => {
    let phone = (patient.phone || '').replace(/\D/g, '');
    if (!phone) {
      const prompted = prompt('Informe o número de WhatsApp do paciente com DDD (ex: 71999998888):');
      if (!prompted) return;
      phone = prompted.replace(/\D/g, '');
    }

    if (exercises.length === 0) {
      alert('Adicione ou gere ao menos um exercício antes de enviar a rotina.');
      return;
    }

    const exList = exercises.map((ex, i) => `${i + 1}. *${ex.title}*\n   • ${ex.sets} x ${ex.reps}${ex.holdTime ? ` (${ex.holdTime})` : ''} - ${ex.frequency}\n   • ${ex.instructions}${ex.externalVideoUrl ? `\n   • Vídeo: ${ex.externalVideoUrl}` : ''}`).join('\n\n');

    const message = `Olá, *${patient.name}*! Aqui está sua rotina de exercícios domiciliares do LOOP:\n\n🎯 *Objetivo:* ${patient.mainGoal}\n\n📋 *Exercícios de Manutenção:*\n\n${exList}\n\n⚠️ *Atenção:* Execute com calma. Caso sinta dor (> 3/10), interrompa e me envie uma mensagem!`;

    const encoded = encodeURIComponent(message);
    const url = phone.length <= 11 
      ? `https://api.whatsapp.com/send?phone=55${phone}&text=${encoded}`
      : `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
    
    window.open(url, '_blank');
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      const updated = exercises.map(ex => {
        if (ex.id === editingId) {
          return {
            ...ex,
            title: title.trim(),
            category,
            sets: sets.trim(),
            reps: reps.trim(),
            holdTime: holdTime.trim() || undefined,
            frequency: frequency.trim(),
            instructions: instructions.trim(),
            cautionNotes: cautionNotes.trim() || undefined,
            externalVideoUrl: externalVideoUrl.trim() || undefined
          };
        }
        return ex;
      });
      setExercises(updated);
      onUpdatePrescriptions(updated);
    } else {
      const newEx: PrescriptionExercise = {
        id: `presc-${Date.now()}`,
        title: title.trim(),
        category,
        sets: sets.trim(),
        reps: reps.trim(),
        holdTime: holdTime.trim() || undefined,
        frequency: frequency.trim(),
        instructions: instructions.trim(),
        cautionNotes: cautionNotes.trim() || undefined,
        externalVideoUrl: externalVideoUrl.trim() || undefined,
        completedToday: false
      };
      const updated = [...exercises, newEx];
      setExercises(updated);
      onUpdatePrescriptions(updated);
    }

    resetForm();
  };

  const handleEdit = (ex: PrescriptionExercise) => {
    setEditingId(ex.id);
    setTitle(ex.title);
    setCategory(ex.category);
    setSets(ex.sets);
    setReps(ex.reps);
    setHoldTime(ex.holdTime || '');
    setFrequency(ex.frequency);
    setInstructions(ex.instructions);
    setCautionNotes(ex.cautionNotes || '');
    setExternalVideoUrl(ex.externalVideoUrl || '');
    setIsAddingNew(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja remover este exercício da prescrição?')) {
      const updated = exercises.filter(e => e.id !== id);
      setExercises(updated);
      onUpdatePrescriptions(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Rotina de Manutenção Domiciliar
          </h2>
          <p className="text-xs text-slate-500">
            Exercícios ativos para o paciente executar com autonomia em casa
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={onOpenAIAssistant}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all active:scale-95"
            title="Gera sugestão de exercícios instantaneamente com Google Gemini"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sugerir com IA</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all active:scale-95"
            title="Enviar rotina formatada no WhatsApp do paciente"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar no WhatsApp</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-full shadow-xs transition-colors"
            title="Imprimir ou Salvar PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddingNew(!isAddingNew);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? 'Fechar' : 'Novo Exercício'}</span>
          </button>
        </div>
      </div>

      {/* Exercise Form */}
      {isAddingNew && (
        <form onSubmit={handleSaveExercise} className="p-6 bg-white rounded-3xl shadow-xs border border-slate-100 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            {editingId ? 'Editar Exercício da Prescrição' : 'Prescrever Novo Exercício'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Exercício *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Extensão ativa de joelho com toalha sob o tornozelo"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
              >
                <option value="fortalecimento">Fortalecimento</option>
                <option value="mobilidade">Mobilidade Articular</option>
                <option value="alongamento">Alongamento</option>
                <option value="propriocepcao">Propriocepção & Equilíbrio</option>
                <option value="controle_motor">Controle Motor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Séries</label>
              <input
                type="text"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Repetições</label>
              <input
                type="text"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sustentação</label>
              <input
                type="text"
                value={holdTime}
                onChange={(e) => setHoldTime(e.target.value)}
                placeholder="Ex: 5 segundos"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Frequência</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Ex: 2x ao dia"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instruções de Execução (Passo a Passo) *
            </label>
            <textarea
              rows={3}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Descreva a postura, apoio e alinhamento anatômico para o paciente..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cuidados Posturais / Evitar
              </label>
              <input
                type="text"
                value={cautionNotes}
                onChange={(e) => setCautionNotes(e.target.value)}
                placeholder="Ex: Não prender a respiração, não hiperextender..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Link de Vídeo Externo (YouTube/Vimeo)
              </label>
              <input
                type="url"
                value={externalVideoUrl}
                onChange={(e) => setExternalVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-full text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm"
            >
              {editingId ? 'Salvar Alteração' : 'Adicionar Exercício'}
            </button>
          </div>
        </form>
      )}

      {/* Exercises List */}
      {exercises.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl shadow-xs border border-slate-100 space-y-3">
          <p className="text-sm text-slate-600 font-medium">Nenhum exercício prescrito para a rotina de casa.</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm"
          >
            Adicionar Primeiro Exercício
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="p-5 sm:p-6 bg-white rounded-3xl shadow-xs border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <Badge variant="neutral">
                    {ex.category}
                  </Badge>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">{ex.title}</h4>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ex.frequency}
                  </span>

                  <button
                    onClick={() => handleEdit(ex)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                    title="Editar exercício"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                    title="Excluir exercício"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dose prescription details */}
              <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {ex.sets}
                </span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {ex.reps}
                </span>
                {ex.holdTime && (
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    Sustentação: {ex.holdTime}
                  </span>
                )}
              </div>

              {/* Instructions */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ex.instructions}
              </p>

              {/* Caution & Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                {ex.cautionNotes ? (
                  <span className="text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 font-medium">
                    Atenção: {ex.cautionNotes}
                  </span>
                ) : <span />}

                {ex.externalVideoUrl && (
                  <a
                    href={ex.externalVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 self-start sm:self-auto bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <span>Ver Vídeo Demonstrativo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
