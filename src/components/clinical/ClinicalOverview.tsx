import React, { useState } from 'react';
import { Patient, ClinicalEvolution } from '../../types';
import { RangeOfMotionTracker } from './RangeOfMotionTracker';
import { MuscleStrengthScale } from './MuscleStrengthScale';
import { GoalChecklist } from './GoalChecklist';
import { EvolutionFormModal } from './EvolutionFormModal';
import { Plus, Calendar } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ClinicalOverviewProps {
  patient: Patient;
  onAddEvolution: (evolution: ClinicalEvolution) => void;
  onUpdateGoalStatus: (goalId: string, status: any) => void;
}

export const ClinicalOverview: React.FC<ClinicalOverviewProps> = ({
  patient,
  onAddEvolution,
  onUpdateGoalStatus
}) => {
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);

  const firstEvo = patient.evolutions[patient.evolutions.length - 1];
  const latestEvo = patient.evolutions[0];
  const primaryRom = latestEvo?.mobilityMetrics?.[0];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Atendimento Clínico & Evoluções
          </h2>
          <p className="text-xs text-slate-500">
            Registro ágil da sessão do dia, conduta terapêutica e evolução da dor
          </p>
        </div>

        <button
          onClick={() => setIsEvolutionModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Atendimento do Dia</span>
        </button>
      </div>

      {/* Summary KPI Bar - Modern Soft White Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Dor (EVA Atual)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {latestEvo ? `EVA ${latestEvo.painEVA}/10` : '—'}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {firstEvo && latestEvo
              ? `Inicial: EVA ${firstEvo.painEVA}/10`
              : 'Primeira sessão'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Amplitude (ADM)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {primaryRom ? `${primaryRom.currentDegrees}°` : '—'}
          </div>
          <span className="text-[11px] text-slate-500 block truncate">
            {primaryRom ? `Alvo: ${primaryRom.targetDegrees}° (${primaryRom.joint})` : 'Sem medição'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Metas Atingidas
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {latestEvo ? latestEvo.goals.filter(g => g.status === 'achieved').length : 0}
            <span className="text-xs font-normal text-slate-400"> / {latestEvo ? latestEvo.goals.length : 0}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {latestEvo && latestEvo.goals.every(g => g.status === 'achieved')
              ? 'Todas as metas atingidas ✓'
              : 'Em progresso'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total de Sessões
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {patient.evolutions.length}
          </div>
          <span className="text-[11px] text-slate-500 block truncate">
            {latestEvo ? `Última: ${new Date(latestEvo.date).toLocaleDateString('pt-BR')}` : 'Nenhuma'}
          </span>
        </div>
      </div>

      {/* Timeline of Evolutions */}
      <div className="space-y-4">
        {patient.evolutions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-slate-100 text-xs text-slate-500">
            Nenhuma evolução registrada ainda. Clique no botão acima para adicionar o primeiro atendimento.
          </div>
        ) : (
          patient.evolutions.map((evo, idx) => (
            <div
              key={evo.id}
              className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    Sessão #{patient.evolutions.length - idx}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {new Date(evo.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Escala de Dor:
                  </span>
                  <Badge variant={evo.painEVA <= 2 ? 'success' : evo.painEVA <= 5 ? 'warning' : 'danger'}>
                    EVA {evo.painEVA}/10
                  </Badge>
                </div>
              </div>

              {/* Functional Status Box: Prévio vs Atual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Conduta / O que foi realizado:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {evo.functionalPrevious || 'Registro inicial'}
                  </p>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Resposta Clínica do Paciente:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {evo.functionalCurrent}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                {evo.mobilityMetrics && evo.mobilityMetrics.length > 0 && (
                  <RangeOfMotionTracker metrics={evo.mobilityMetrics} />
                )}

                {evo.strengthMetrics && evo.strengthMetrics.length > 0 && (
                  <MuscleStrengthScale metrics={evo.strengthMetrics} />
                )}
              </div>

              {/* Goals */}
              {evo.goals && evo.goals.length > 0 && (
                <div className="pt-1">
                  <GoalChecklist
                    goals={evo.goals}
                    onToggleGoalStatus={onUpdateGoalStatus}
                  />
                </div>
              )}

              {/* Clinical Notes */}
              {evo.notes && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">
                    Parecer Fisioterapêutico:
                  </span>
                  <p className="leading-relaxed">{evo.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <EvolutionFormModal
        isOpen={isEvolutionModalOpen}
        onClose={() => setIsEvolutionModalOpen(false)}
        onSave={onAddEvolution}
        previousEvolution={latestEvo}
      />
    </div>
  );
};
