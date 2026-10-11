# LOOP — Plataforma Minimalista de Evolução Clínica e Prescrição Domiciliar

> **LOOP** é um software web moderno, ultra minimalista e de alta performance desenvolvido especificamente para fisioterapeutas acompanharem a evolução funcional de seus pacientes e prescreverem rotinas domiciliares de manutenção com alta adesão e clareza.

---

## ✦ Filosofia e Design

- **Ultra Minimalismo:** Zero poluição visual, alto contraste, tipografia cirúrgica e foco total na tomada de decisão clínica rápida.
- **Zero Vídeos Pesados:** Apenas suporte a fotos estáticas de alta resolução (postura, exames e amplitude) e links externos (YouTube/Vimeo) para tutoriais de exercícios.
- **Métrica Norte em Destaque:** O **"Objetivo Principal do Tratamento"** permanece sempre no topo do prontuário como bússola de sucesso do paciente.

---

## ✦ Módulos do Sistema

### 1. Painel de Pacientes e Anamnese
- Cadastro ágil com dados pessoais, profissão, diagnóstico da lesão e histórico clínico pregresso.
- **Destaque:** Campo obrigatório *"Objetivo Principal do Tratamento"* (ex: *"Voltar a correr 5km sem dor no menisco"*), com marcador de conquista e celebração.
- **Galeria de Exames & Laudos:** Upload de imagens de Raio-X, Ressonância Magnética, Ultrassom e laudos cirúrgicos com visualizador em alta definição.

### 2. Avaliação Clínica e Evolução
- **Status Funcional Dinâmico:** Comparação explícita entre o *Status Prévio* e o *Status Atual*.
- **Escala Analógica Visual de Dor (EVA 0 a 10):** Segmentação interativa por cores e descritores clínicos.
- **Métricas Objetivas:**
  - **ADM (Amplitude de Movimento):** Acompanhamento em graus (°) com barra de progresso em relação à meta anatômica.
  - **Força Muscular:** Escala de Oxford (Graus 0 a 5).
- **Registro Visual "Antes vs. Depois":** Slider interativo com linha divisória arrastável ou modo lado a lado para comparar postura e amplitude de movimento entre a sessão inicial e atual.
- **Metas do Plano Terapêutico:** Checklist com marcadores de *"Pendente"*, *"Em Progresso"* e *"Atingido"*.

### 3. Assistente Clínico Inteligente (IA)
- Campo rápido para inserção da patologia/lesão (ex: *"Lesão de LCA - 2ª semana pós-op"*, *"Manguito Rotador"*).
- Integração nativa com a **API Google Gemini (Gemini 2.5 Flash)** com chave configurável no navegador.
- **Motor Clínico Offline Baseado em Evidências:** Gera instantaneamente protocolos padrão-ouro estruturados mesmo sem chave de API.
- Apresenta: Racional fisioterápico, alertas de contraindicação/red flags, metas prioritárias e rotina de exercícios com botão **"Aplicar ao Paciente com 1 Clique"**.

### 4. Prescrição e Área do Paciente (Home Care)
- **Prescritor do Fisioterapeuta:** Configuração de dosagem (séries, repetições, sustentação isométrica, frequência, orientações posturais e link externo do YouTube).
- **Área do Paciente (Mobile-friendly):**
  - Visão simplificada para o paciente fazer em casa.
  - Checklist interativo dos exercícios do dia com cronômetro embutido para sustentações isométricas (15s, 30s, 60s).
  - Link direto para demonstrações em vídeo.
  - **Registro Rápido de Sensação:** Feedback pós-treino com nota de dor EVA (0-10), esforço percebido (1-10) e comentário direto para o fisioterapeuta.
  - **Comparativo Visual Final:** O paciente vê a foto do primeiro dia versus o estado atual lado a lado confrontando sua meta inicial.

---

## ✦ Stack Tecnológica & Serviços Gratuitos

- **Frontend:** React 19 + TypeScript + Vite 8
- **Estilização:** Tailwind CSS v4 (design cirúrgico monochrome)
- **Ícones:** Lucide React
- **Efeitos de Conquista:** Canvas Confetti
- **Persistência Local:** LocalStorage & JSON Backup / Restore
- **Integração Gratuita com Nuvem (Opcional):**
  - **Google Gemini API:** Gratuito via [Google AI Studio](https://aistudio.google.com/app/apikey)
  - **Supabase:** Banco de dados PostgreSQL gratuito (Script SQL incluso nas configurações da plataforma)

---

## ✦ Como Rodar Localmente

1. Navegue até a pasta do projeto:
   ```bash
   cd loop-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:5173
   ```
