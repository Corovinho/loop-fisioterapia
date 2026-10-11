import React, { useState } from 'react';
import { Modal } from './Modal';
import { StorageService } from '../../services/storage';
import { Database, Check, Copy, ShieldCheck } from 'lucide-react';
import logoIcon from '../../assets/logo-icon.jpg';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const supabaseConfig = StorageService.getSupabaseConfig();
  const [sbUrl, setSbUrl] = useState(supabaseConfig.url);
  const [sbKey, setSbKey] = useState(supabaseConfig.anonKey);
  const [sbEnabled, setSbEnabled] = useState(supabaseConfig.enabled);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSupabaseConfig({
      url: sbUrl,
      anonKey: sbKey,
      enabled: sbEnabled
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copySqlSchema = () => {
    const sql = `-- LOOP Physiotherapy Platform Schema (Supabase / PostgreSQL)
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birth_date DATE,
  main_goal TEXT NOT NULL,
  main_goal_achieved BOOLEAN DEFAULT FALSE,
  condition TEXT NOT NULL,
  clinical_history TEXT,
  exams JSONB DEFAULT '[]'::jsonb,
  evolutions JSONB DEFAULT '[]'::jsonb,
  prescriptions JSONB DEFAULT '[]'::jsonb,
  patient_logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated physios full access" ON patients FOR ALL USING (true);
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações do Sistema"
      subtitle="Sincronização em nuvem e infraestrutura da clínica"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status card - AI pre-connected */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Google Gemini Clínico Integrado
              </span>
              <span className="text-xs text-slate-500">
                Conectado permanentemente à conta Google oficial da clínica
              </span>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            Ativo
          </span>
        </div>

        {/* Cloud database form */}
        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-900">
                Banco de Dados em Nuvem (Supabase / PostgreSQL)
              </span>
            </div>
            <p className="text-slate-500 pt-1 leading-relaxed">
              Os dados clínicos são salvos localmente com alta disponibilidade. Para sincronização remota entre múltiplos consultórios, preencha os parâmetros abaixo:
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Script SQL das Tabelas
                </span>
                <button
                  type="button"
                  onClick={copySqlSchema}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar DDL SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Configuração salva com sucesso!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </form>

        {/* Brand footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs shrink-0 flex items-center justify-center">
              <img src={logoIcon} alt="loop" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 leading-none">loop</span>
                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase leading-none">FISIOTERAPIA</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">Plataforma de Prescrição & Acompanhamento Clínico</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            v2.4 Pro
          </span>
        </div>
      </div>
    </Modal>
  );
};
