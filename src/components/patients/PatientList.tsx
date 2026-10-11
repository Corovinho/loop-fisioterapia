import React, { useState } from 'react';
import { Patient } from '../../types';
import { Search, Plus, ArrowRight, CheckCircle2, SlidersHorizontal, Activity, Dumbbell, Calendar, Heart } from 'lucide-react';
import { Badge } from '../common/Badge';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNewPatient: () => void;
  onClearDemoData?: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onSelectPatient,
  onNewPatient,
  onClearDemoData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'achieved'>('all');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mainGoal.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'in_progress') return !patient.mainGoalAchieved;
    if (statusFilter === 'achieved') return patient.mainGoalAchieved;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Friendly Page Header - Similar to Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
            Painel da Fisioterapeuta
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Como estão seus pacientes hoje?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Acompanhamento de evolução clínica, metas de reabilitação e rotinas para casa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {patients.length > 0 && onClearDemoData && (
            <button
              onClick={onClearDemoData}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              title="Apagar dados fictícios de demonstração"
            >
              Limpar Demonstração
            </button>
          )}

          <button
            onClick={onNewPatient}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Paciente</span>
          </button>
        </div>
      </div>

      {/* Modern Rounded Search Bar with mic/filter pill (Reference style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, lesão, objetivo ou diagnóstico..."
            className="w-full pl-11 pr-11 py-3.5 text-sm bg-white rounded-2xl border border-slate-200/80 shadow-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded-full bg-slate-100"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pill Category Filters - Matching reference screenshot [All, Cardiology, etc.] */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            Todos ({patients.length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              statusFilter === 'in_progress'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            Em Tratamento ({patients.filter(p => !p.mainGoalAchieved).length})
          </button>
          <button
            onClick={() => setStatusFilter('achieved')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              statusFilter === 'achieved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            Metas Atingidas ({patients.filter(p => p.mainGoalAchieved).length})
          </button>
        </div>
      </div>

      {/* Patient Cards List - Modern Soft Cards */}
      <div className="space-y-4">
        {patients.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 space-y-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Nenhum paciente cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Cadastre seu primeiro paciente com dados clínicos e métrica norte para iniciar o acompanhamento.
            </p>
            <button
              onClick={onNewPatient}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
            >
              + Cadastrar Primeiro Paciente
            </button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-sm text-slate-500 shadow-sm border border-slate-100">
            Nenhum paciente encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const lastEvo = patient.evolutions[0];
            const initials = patient.name
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient.id)}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  {/* Clean Avatar with Initials */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                    {initials}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {patient.name}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {patient.condition}
                      </span>
                      {patient.mainGoalAchieved ? (
                        <Badge variant="success">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Meta Atingida
                        </Badge>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          Em Tratamento
                        </span>
                      )}
                    </div>

                    {/* Objective Box - Soft modern blue tint */}
                    <div className="bg-slate-50 group-hover:bg-blue-50/50 rounded-2xl p-3 border border-slate-100 group-hover:border-blue-100/60 transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        Objetivo Principal do Tratamento:
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        &ldquo;{patient.mainGoal}&rdquo;
                      </p>
                    </div>

                    {/* Quantitative metrics row */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap font-medium">
                      {lastEvo && (
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dor:</span>
                          <strong className="text-slate-900 font-bold">EVA {lastEvo.painEVA}/10</strong>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                        <span>Rotina de Casa:</span>
                        <strong className="text-slate-900 font-bold">{patient.prescriptions.length} ex.</strong>
                      </span>
                      {lastEvo && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Última sessão: {new Date(lastEvo.date).toLocaleDateString('pt-BR')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Modern Pill Button */}
                <div className="shrink-0 flex items-center justify-end pt-2 sm:pt-0">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-bold transition-all shadow-xs group-hover:shadow-sm">
                    <span>Ver Prontuário</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
