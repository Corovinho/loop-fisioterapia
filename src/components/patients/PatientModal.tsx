import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Patient } from '../../types';
import { Target, User, FileText } from 'lucide-react';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Partial<Patient>) => void;
  initialPatient?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPatient
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Masculino');
  const [occupation, setOccupation] = useState('');
  const [condition, setCondition] = useState('');
  const [injuryDate, setInjuryDate] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [mainGoalCategory, setMainGoalCategory] = useState('Retorno ao Esporte');
  const [clinicalHistory, setClinicalHistory] = useState('');

  const formatCpf = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  useEffect(() => {
    if (initialPatient) {
      setName(initialPatient.name);
      setCpf(initialPatient.cpf || '');
      setPhone(initialPatient.phone || '');
      setEmail(initialPatient.email || '');
      setBirthDate(initialPatient.birthDate || '');
      setGender(initialPatient.gender || 'Masculino');
      setOccupation(initialPatient.occupation || '');
      setCondition(initialPatient.condition);
      setInjuryDate(initialPatient.injuryDate || '');
      setMainGoal(initialPatient.mainGoal);
      setMainGoalCategory(initialPatient.mainGoalCategory || 'Retorno ao Esporte');
      setClinicalHistory(initialPatient.clinicalHistory || '');
    } else {
      setName('');
      setCpf('');
      setPhone('');
      setEmail('');
      setBirthDate('');
      setGender('Masculino');
      setOccupation('');
      setCondition('');
      setInjuryDate(new Date().toISOString().split('T')[0]);
      setMainGoal('');
      setMainGoalCategory('Retorno ao Esporte');
      setClinicalHistory('');
    }
  }, [initialPatient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mainGoal.trim() || !condition.trim()) return;

    onSave({
      id: initialPatient ? initialPatient.id : `pat-${Date.now()}`,
      name: name.trim(),
      cpf: cpf.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      birthDate,
      gender,
      occupation: occupation.trim(),
      condition: condition.trim(),
      injuryDate,
      mainGoal: mainGoal.trim(),
      mainGoalCategory,
      clinicalHistory: clinicalHistory.trim(),
      mainGoalAchieved: initialPatient ? initialPatient.mainGoalAchieved : false,
      exams: initialPatient ? initialPatient.exams : [],
      evolutions: initialPatient ? initialPatient.evolutions : [],
      prescriptions: initialPatient ? initialPatient.prescriptions : [],
      patientLogs: initialPatient ? initialPatient.patientLogs : [],
      createdAt: initialPatient ? initialPatient.createdAt : new Date().toISOString()
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPatient ? 'Editar Prontuário do Paciente' : 'Cadastro Rápido de Paciente'}
      subtitle="Defina os dados clínicos e a métrica norte do plano terapêutico"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FIELD IN PROMINENT HIGHLIGHT: OBJETIVO PRINCIPAL */}
        <div className="p-5 bg-blue-600 text-white rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-300" />
              <label className="text-xs font-bold text-white">
                Objetivo Principal do Tratamento * (Métrica Norte)
              </label>
            </div>
            <select
              value={mainGoalCategory}
              onChange={(e) => setMainGoalCategory(e.target.value)}
              className="bg-white/20 text-xs text-white border border-white/30 rounded-full px-3 py-1 font-semibold focus:outline-hidden"
            >
              <option value="Retorno ao Esporte" className="text-slate-900">Retorno ao Esporte</option>
              <option value="Independência AVD" className="text-slate-900">Independência AVD</option>
              <option value="Alívio de Dor" className="text-slate-900">Alívio de Dor</option>
              <option value="Qualidade de Vida" className="text-slate-900">Qualidade de Vida</option>
            </select>
          </div>

          <p className="text-xs text-white/80">
            A meta final que define o sucesso da alta clínica (ex: &ldquo;Voltar a correr 5km&rdquo;, &ldquo;Elevar o braço a 180° sem dor&rdquo;).
          </p>

          <input
            type="text"
            required
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            placeholder="Ex: Voltar a correr 5km na esteira sem dor no menisco"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/25 rounded-xl text-sm text-white placeholder-white/60 font-semibold focus:outline-hidden focus:bg-white/20 focus:border-white transition-all"
          />
        </div>

        {/* Section 1: Dados Pessoais */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <User className="w-3.5 h-3.5 text-blue-600" /> Dados Pessoais
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lucas Silveira"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CPF (Acesso do Paciente)</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="paciente@email.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Profissão / Ocupação</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Ex: Designer, Corredor amador"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Diagnóstico e Histórico */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <FileText className="w-3.5 h-3.5 text-blue-600" /> Diagnóstico & Histórico Clínico
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patologia / Condição *</label>
              <input
                type="text"
                required
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Ex: Pós-op de LCA Joelho D (4ª semana)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Lesão / Cirurgia</label>
              <input
                type="date"
                value={injuryDate}
                onChange={(e) => setInjuryDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Histórico Clínico Pregresso</label>
              <textarea
                rows={3}
                value={clinicalHistory}
                onChange={(e) => setClinicalHistory(e.target.value)}
                placeholder="Mecanismo de trauma, cirurgias prévias, comorbidades..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
          >
            {initialPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
