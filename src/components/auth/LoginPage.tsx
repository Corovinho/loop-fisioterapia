import React, { useState } from 'react';
import { Patient } from '../../types';
import { ArrowRight, Lock, User, Stethoscope } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

interface LoginPageProps {
  patients: Patient[];
  onLoginAsPhysio: () => void;
  onLoginAsPatient: (patientId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  patients,
  onLoginAsPhysio,
  onLoginAsPatient
}) => {
  const [role, setRole] = useState<'physio' | 'patient'>('physio');

  // Physio form state
  const [physioEmail, setPhysioEmail] = useState('renata.lopes@clinica.com');
  const [physioPassword, setPhysioPassword] = useState('••••••••');

  // Patient form state
  const [patientCpf, setPatientCpf] = useState(patients[0]?.cpf || '111.222.333-44');
  const [cpfError, setCpfError] = useState('');

  const formatCpf = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handlePhysioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAsPhysio();
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCpfError('');
    const cleanInput = patientCpf.replace(/\D/g, '');
    const matched = patients.find(p => {
      const pCpf = (p.cpf || '').replace(/\D/g, '');
      return pCpf === cleanInput;
    });

    if (matched) {
      onLoginAsPatient(matched.id);
    } else {
      setCpfError('Nenhum paciente cadastrado com este CPF.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Brand Header */}
      <div className="w-full max-w-md text-center mb-8 flex flex-col items-center">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white p-3 mb-2 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <img src={logoImg} alt="loop FISIOTERAPIA" className="w-full h-full object-contain" />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
          Acompanhamento clínico inteligente & engajamento domiciliar
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 p-6 sm:p-8">
        {/* Role Selector Tabs (Pill style) */}
        <div className="bg-slate-100/80 p-1.5 rounded-full flex gap-1 mb-6">
          <button
            type="button"
            onClick={() => setRole('physio')}
            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'physio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Fisioterapeuta</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'patient'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Paciente</span>
          </button>
        </div>

        {/* Content Body */}
        <div>
          {role === 'physio' ? (
            /* PHYSIOTHERAPIST LOGIN */
            <form onSubmit={handlePhysioSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  E-mail Profissional
                </label>
                <input
                  type="email"
                  required
                  value={physioEmail}
                  onChange={(e) => setPhysioEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  required
                  value={physioPassword}
                  onChange={(e) => setPhysioPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Entrar no Prontuário</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 text-center">
                <span className="text-xs text-slate-400">
                  Acesso rápido com perfil demonstrativo: Dra. Renata Lopes (CREFITO-3)
                </span>
              </div>
            </form>
          ) : (
            /* PATIENT LOGIN */
            <form onSubmit={handlePatientSubmit} className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-relaxed font-medium">
                Acesse seus exercícios domiciliares e registre sua evolução diária digitando seu CPF.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>CPF do Paciente</span>
                  <span className="text-[11px] text-slate-400 font-normal">Apenas números</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientCpf}
                  onChange={(e) => {
                    setPatientCpf(formatCpf(e.target.value));
                    if (cpfError) setCpfError('');
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all font-mono font-medium tracking-wide"
                />
                {cpfError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{cpfError}</p>
                )}
              </div>

              {/* Demo quick-picks */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                  Atalhos de demonstração (1 clique):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {patients.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPatientCpf(p.cpf || '');
                        setCpfError('');
                        onLoginAsPatient(p.id);
                      }}
                      className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/80 rounded-full text-slate-600 font-medium transition-colors"
                    >
                      {p.name.split(' ')[0]} ({p.cpf})
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Acessar Meu Plano de Exercícios</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-400 font-medium">
        LOOP Fisioterapia • Sistema Clínico e Domiciliar
      </div>
    </div>
  );
};
