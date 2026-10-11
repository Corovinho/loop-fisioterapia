import React, { useState } from 'react';
import { Patient } from '../../types';
import { calculateAdherence } from '../../utils/adherence';
import logoIcon from '../../assets/logo-icon.jpg';
import { Printer, X, CheckCircle2, TrendingDown, FileText } from 'lucide-react';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const [physioName, setPhysioName] = useState('Dra. Renata Lopes');
  const [crefito, setCrefito] = useState('CREFITO-3 / 184920-F');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Paciente apresenta excelente resposta ao plano cinesioterapêutico proposto, com ganho progressivo de amplitude articular, diminuição sustentada do quadro álgico e adesão consistente à rotina domiciliar. Indicada progressão de carga e continuidade do acompanhamento.'
  );

  if (!isOpen) return null;

  const firstEvo = patient.evolutions[patient.evolutions.length - 1];
  const latestEvo = patient.evolutions[0];
  const adherence = calculateAdherence(patient);

  const handlePrint = () => {
    window.print();
  };

  const calculatePainDrop = () => {
    if (!firstEvo || !latestEvo) return null;
    const diff = firstEvo.painEVA - latestEvo.painEVA;
    const percent = firstEvo.painEVA > 0 ? Math.round((diff / firstEvo.painEVA) * 100) : 0;
    return { diff, percent };
  };

  const painDrop = calculatePainDrop();

  // Extract photos for report (first vs latest)
  const allPhotos = patient.evolutions.flatMap(e => e.evolutionPhotos || []);
  const beforePhoto = allPhotos.find(p => p.stage === 'antes') || allPhotos[allPhotos.length - 1];
  const afterPhoto = allPhotos.find(p => p.stage === 'depois') || (allPhotos[0] !== beforePhoto ? allPhotos[0] : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Modal Top Bar - Hidden in Print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Relatório Clínico & Laudo de Evolução</h3>
              <p className="text-[11px] text-slate-400">Pronto para imprimir ou salvar em PDF para o médico e paciente</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" className="p-6 sm:p-10 text-slate-800 space-y-6 print:p-0 print:space-y-4">
          
          {/* Header Timbrado */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 bg-white p-0.5 shrink-0 flex items-center justify-center">
                <img src={logoIcon} alt="loop" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-900">loop</span>
                  <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">FISIOTERAPIA</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Clínica de Fisioterapia Especializada & Reabilitação Funcional</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-1">
                Laudo de Evolução Clínica
              </span>
              <p className="text-xs text-slate-500">
                Data: <strong>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
              </p>
            </div>
          </div>

          {/* Dados do Paciente e Diagnóstico */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Paciente</span>
                <strong className="text-slate-900 text-sm font-bold">{patient.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">CPF</span>
                <span className="text-slate-800 font-mono font-medium">{patient.cpf || 'Não informado'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Data de Início</span>
                <span className="text-slate-800 font-medium">
                  {patient.injuryDate ? new Date(patient.injuryDate + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Diagnóstico Clínico / Condição</span>
                <span className="text-slate-900 font-bold">{patient.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Objetivo Terapêutico (Métrica Norte)</span>
                <span className="text-blue-900 font-semibold">&ldquo;{patient.mainGoal}&rdquo;</span>
              </div>
            </div>
          </div>

          {/* 3 Pilares Clínicos da Reabilitação */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Painel Comparativo dos 3 Pilares de Evolução
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pilar 1: Dor EVA */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  1. Nível de Dor (EVA)
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Inicial</span>
                    <span className="text-sm font-bold text-slate-700">{firstEvo ? `${firstEvo.painEVA}/10` : '—'}</span>
                  </div>
                  <span className="text-slate-300 font-bold">➔</span>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Atual</span>
                    <span className="text-base font-extrabold text-blue-700">{latestEvo ? `${latestEvo.painEVA}/10` : '—'}</span>
                  </div>
                </div>
                {painDrop && painDrop.diff > 0 && (
                  <div className="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Redução de {painDrop.percent}% no quadro álgico</span>
                  </div>
                )}
              </div>

              {/* Pilar 2: Amplitude Articular (ADM) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  2. Amplitude de Movimento
                </span>
                {latestEvo?.mobilityMetrics && latestEvo.mobilityMetrics.length > 0 ? (
                  latestEvo.mobilityMetrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="text-xs flex items-center justify-between">
                      <span className="text-slate-600 truncate max-w-[120px]">{m.movement}:</span>
                      <strong className="text-blue-700">{m.currentDegrees}° <span className="text-slate-400 font-normal">/ {m.targetDegrees}°</span></strong>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Goniometria funcional preservada</p>
                )}
              </div>

              {/* Pilar 3: Força Muscular Oxford */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  3. Força Muscular (Oxford 0-5)
                </span>
                {latestEvo?.strengthMetrics && latestEvo.strengthMetrics.length > 0 ? (
                  latestEvo.strengthMetrics.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="text-xs flex items-center justify-between">
                      <span className="text-slate-600 truncate max-w-[120px]">{s.muscleGroup}:</span>
                      <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full font-bold">Grau {s.grade}/5</strong>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Força compatível com fase clínica</p>
                )}
              </div>
            </div>
          </div>

          {/* Registro Fotográfico Comparativo (Antes x Depois) se houver */}
          {beforePhoto && afterPhoto && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Registro Fotográfico Comparativo (Antes vs. Atual)
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 inline-block">
                    Avaliação Inicial ({beforePhoto.date})
                  </span>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <img src={beforePhoto.imageUrl} alt="Antes" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{beforePhoto.label}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block">
                    Situação Atual ({afterPhoto.date})
                  </span>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <img src={afterPhoto.imageUrl} alt="Atual" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{afterPhoto.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Conduta & Adesão Domiciliar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Rotina Ativa Domiciliar ({patient.prescriptions.length} exercícios)
              </h5>
              <div className="space-y-1.5">
                {patient.prescriptions.slice(0, 4).map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-800 truncate mr-2">{p.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{p.sets} • {p.reps}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Adesão ao Tratamento Domiciliar
              </h5>
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">Taxa de Execução Domiciliar:</span>
                  <span className="text-sm font-black text-emerald-700">{adherence.rate}%</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {adherence.completedLogs} sessões domiciliares com feedback registradas no sistema.
                </p>
                {patient.mainGoalAchieved && (
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Meta Principal Concluída em {patient.mainGoalAchievedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parecer Clínico Final & Assinatura */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Parecer Fisioterapêutico & Conduta:
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-blue-500 focus:outline-hidden font-medium print:bg-transparent print:border-none print:p-0"
            />

            {/* Assinatura do Fisioterapeuta */}
            <div className="pt-8 flex flex-col items-center justify-center text-center">
              <div className="w-64 border-t-2 border-slate-900 pt-2 space-y-0.5">
                <input
                  type="text"
                  value={physioName}
                  onChange={(e) => setPhysioName(e.target.value)}
                  className="text-center font-bold text-xs text-slate-900 w-full focus:outline-hidden print:border-none"
                />
                <input
                  type="text"
                  value={crefito}
                  onChange={(e) => setCrefito(e.target.value)}
                  className="text-center text-[11px] text-slate-500 font-medium w-full focus:outline-hidden print:border-none"
                />
                <span className="text-[10px] text-slate-400 block">Fisioterapeuta Responsável</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
