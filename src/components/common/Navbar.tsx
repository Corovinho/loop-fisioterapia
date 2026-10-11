import React from 'react';
import { LogOut, Settings, Download, RefreshCw, ChevronLeft, Bell, User } from 'lucide-react';
import logoIcon from '../../assets/logo-icon.jpg';

interface NavbarProps {
  userRole: 'physio' | 'patient';
  userName?: string;
  onLogout: () => void;
  onOpenSettings?: () => void;
  onExportData?: () => void;
  onResetData?: () => void;
  onBackToPatientList?: () => void;
  showingPatientDetail?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  userName,
  onLogout,
  onOpenSettings,
  onExportData,
  onResetData,
  onBackToPatientList,
  showingPatientDetail
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200/80 bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center">
              <img src={logoIcon} alt="loop" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900 leading-none">
                  loop
                </span>
                <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase leading-none">
                  FISIOTERAPIA
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 leading-tight mt-0.5">
                {userRole === 'physio' ? 'Portal Clínico' : 'Portal do Paciente'}
              </span>
            </div>
          </div>

          {userRole === 'physio' && showingPatientDetail && onBackToPatientList && (
            <button
              onClick={onBackToPatientList}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors ml-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Lista de Pacientes</span>
            </button>
          )}
        </div>

        {/* Right: User Status & Actions */}
        <div className="flex items-center gap-3">
          {userName && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {userRole === 'physio' ? 'Fisioterapeuta Responsável' : 'Paciente em Acompanhamento'}
                </span>
              </div>
            </div>
          )}

          {userRole === 'physio' && (
            <div className="flex items-center gap-1.5 pl-2">
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
                  title="Configurações e Integrações"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              {onExportData && (
                <button
                  onClick={onExportData}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
                  title="Exportar Dados (Backup)"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              {onResetData && (
                <button
                  onClick={onResetData}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                  title="Restaurar Pacientes Padrão"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
