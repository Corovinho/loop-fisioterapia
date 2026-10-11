import React from 'react';
import { Patient } from '../../types';
import { Target, CheckCircle2, Phone, Calendar, ArrowLeft, Activity, Dumbbell, FolderGit2, Eye, TrendingDown, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';
import { calculateAdherence } from '../../utils/adherence';

export type PatientDetailTab = 'evolution' | 'prescription' | 'records';

interface PatientHeaderProps {
  patient: Patient;
  activeTab: PatientDetailTab;
  onTabChange: (tab: PatientDetailTab) => void;
  onToggleGoalAchieved: (achieved: boolean) => void;
  onEditPatient: () => void;
  onBackToList: () => void;
  onViewAsPatient: () => void;
  onOpenReport?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  activeTab,
  onTabChange,
  onToggleGoalAchieved,
  onEditPatient,
  onBackToList,
  onViewAsPatient,
  onOpenReport
}) => {
  const getAge = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const age = getAge(patient.birthDate);
  const latestEvo = patient.evolutions[0];
  const firstEvo = patient.evolutions[patient.evolutions.length - 1];

  const totalPhotos = patient.evolutions.reduce((acc, evo) => acc + (evo.evolutionPhotos?.length || 0), 0);
  const totalRecords = patient.exams.length + totalPhotos;

  return (
    <div className="pt-6 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={onBackToList}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs transition-colors self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Lista</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 rounded-full shadow-xs transition-colors"
                title="Gera laudo clínico executivo para médicos e convênios"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Gerar Relatório (PDF)</span>
              </button>
            )}

            <button
              onClick={onViewAsPatient}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 rounded-full shadow-xs transition-colors"
              title="Abre a tela simplificada que o paciente acessa em casa"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Ver como Paciente</span>
            </button>

            <button
              onClick={onEditPatient}
              className="px-4 py-2 bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 rounded-full shadow-xs transition-colors"
            >
              Editar Dados
            </button>
          </div>
        </div>

        {/* Patient Identity & Key Data */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {patient.name}
            </h1>
            {age && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {age} anos
              </span>
            )}
            {patient.occupation && (
              <Badge variant="neutral">
                {patient.occupation}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap font-medium">
            <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {patient.condition}
            </span>
            {patient.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {patient.phone}
              </span>
            )}
            {patient.injuryDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Início: {new Date(patient.injuryDate).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        {/* HERO CARD - SOLID ROYAL BLUE */}
        <div className="bg-blue-600 text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  Objetivo Principal do Tratamento (Alta Clínica)
                </span>
                {patient.mainGoalCategory && (
                  <span className="text-[10px] px-2.5 py-0.5 bg-white/20 text-white rounded-full font-bold uppercase">
                    {patient.mainGoalCategory}
                  </span>
                )}
              </div>

              <p className={`text-xl sm:text-2xl font-bold tracking-tight text-white ${patient.mainGoalAchieved ? 'line-through opacity-80' : ''}`}>
                &ldquo;{patient.mainGoal}&rdquo;
              </p>
            </div>

            <button
              onClick={() => onToggleGoalAchieved(!patient.mainGoalAchieved)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs ${
                patient.mainGoalAchieved
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{patient.mainGoalAchieved ? 'Meta Concluída ✓' : 'Marcar como Atingido'}</span>
            </button>
          </div>

          {/* Quick Metrics Bar inside Hero Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 block">
                Dor Atual (EVA)
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-white">
                  {latestEvo ? `${latestEvo.painEVA}/10` : '—'}
                </span>
                {firstEvo && latestEvo && firstEvo.painEVA > latestEvo.painEVA && (
                  <span className="text-[10px] font-bold text-emerald-300 flex items-center bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    -{firstEvo.painEVA - latestEvo.painEVA}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-blue-200 block">
                {firstEvo ? `Inicial: ${firstEvo.painEVA}/10` : 'Primeira sessão'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 block">
                Total de Sessões
              </span>
              <div className="text-lg font-bold text-white mt-0.5">
                {patient.evolutions.length}
              </div>
              <span className="text-[10px] text-blue-200 block">
                {latestEvo ? `Última: ${new Date(latestEvo.date).toLocaleDateString('pt-BR')}` : 'Nenhuma'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 block">
                Rotina Prescrita
              </span>
              <div className="text-lg font-bold text-white mt-0.5">
                {patient.prescriptions.length} exercícios
              </div>
              <span className="text-[10px] text-blue-200 block">
                Prontos para casa
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 block">
                Adesão Domiciliar
              </span>
              <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span>{calculateAdherence(patient).rate}%</span>
                <span className={`w-2 h-2 rounded-full ${calculateAdherence(patient).rate >= 70 ? 'bg-emerald-300' : 'bg-amber-300'}`} />
              </div>
              <span className="text-[10px] text-blue-200 block">
                {calculateAdherence(patient).completedLogs} treinos feitos
              </span>
            </div>
          </div>
        </div>

        {/* 3 PILL TABS - Matching Reference Screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => onTabChange('evolution')}
            className={`px-5 py-2.5 text-xs font-bold rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'evolution'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70 shadow-xs'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. Atendimento & Evoluções ({patient.evolutions.length})</span>
          </button>

          <button
            onClick={() => onTabChange('prescription')}
            className={`px-5 py-2.5 text-xs font-bold rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'prescription'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70 shadow-xs'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>2. Rotina de Casa ({patient.prescriptions.length})</span>
          </button>

          <button
            onClick={() => onTabChange('records')}
            className={`px-5 py-2.5 text-xs font-bold rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70 shadow-xs'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>3. Fotos & Exames ({totalRecords})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
