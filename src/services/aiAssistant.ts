import { AIPrescriptionDraft } from '../types';
import { StorageService } from './storage';

// Built-in evidence-based physiotherapy clinical database for instant drafts
const CLINICAL_KNOWLEDGE_BASE: Record<string, AIPrescriptionDraft> = {
  'lca': {
    condition: 'Reconstrução de Ligamento Cruzado Anterior (LCA)',
    stageName: 'Fase Pós-Operatória Inicial (1ª a 4ª Semana)',
    clinicalRationale: 'O foco primordial desta fase é o restabelecimento imediato da extensão passiva completa (0°), controle álgico e do derrame articular, e reativação reflexa do quadríceps para prevenir inibição artrogênica.',
    redFlags: [
      'Proibido exercícios de extensão em cadeia cinética aberta (cadeira extensora) entre 45° e 0° nesta fase.',
      'Atenção a sinais de TVP (dor na panturrilha, empastamento e calor local).',
      'Evitar flexão forçada além de 90° se houver sutura meniscal associada.'
    ],
    suggestedGoals: [
      'Recuperar extensão completa ativa e passiva (0°)',
      'Alcançar 90° de flexão ativa até a 3ª semana',
      'Eliminar edema e derrame articular significativo',
      'Desmame progressivo de muletas com marcha simétrica'
    ],
    exercises: [
      {
        title: 'Extensão Ativa em Decúbito com Toalha sob o Tornozelo',
        category: 'mobilidade',
        sets: '3 séries',
        reps: '15 repetições',
        holdTime: '5 segundos no ponto máximo',
        frequency: '3x ao dia',
        instructions: 'Deitado ou sentado, coloque um rolo de toalha sob o calcanhar deixando o joelho suspenso. Deixe a gravidade agir e contraia a coxa para esticar a perna completamente.',
        cautionNotes: 'Não apoie o rolo sob o joelho; deve ficar sob o tornozelo para favorecer a extensão.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=extensao+passiva+lca+fisioterapia'
      },
      {
        title: 'Ativação Isométrica de Quadríceps (Quadriceps Sets)',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '15 repetições',
        holdTime: '6 segundos de contração máxima sustentada',
        frequency: '3x ao dia',
        instructions: 'Com a perna esticada na maca, aperte a parte de trás do joelho contra o solo, focando no vasto medial oblíquo.',
        cautionNotes: 'Evite compensar elevando o quadril.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=quadriceps+sets+isometria'
      },
      {
        title: 'Deslizamento de Calcanhar na Parede (Wall Slide)',
        category: 'mobilidade',
        sets: '2 séries',
        reps: '12 repetições',
        holdTime: 'Pausa de 5 segundos no limite',
        frequency: '2x ao dia',
        instructions: 'Deitado de barriga para cima, pernas para a parede. Deixe o calcanhar descer suavemente com apoio da outra perna para ganhar flexão sem impacto.',
        cautionNotes: 'Interromper caso a dor ultrapasse 3/10.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=heel+slide+joelho+parede'
      },
      {
        title: 'Elevação da Perna Estendida (SLR - Straight Leg Raise)',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '10 repetições',
        holdTime: '3 segundos no topo',
        frequency: '2x ao dia',
        instructions: 'Trave o joelho em extensão total a 0° e eleve a perna reta até cerca de 45° do solo. Desça devagar.',
        cautionNotes: 'Se houver flexão involuntária do joelho (lag extensor), reduza a alavanca ou priorize a isometria prévia.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=straight+leg+raise+fisioterapia'
      }
    ]
  },

  'ombro': {
    condition: 'Tendinopatia do Manguito Rotador / Síndrome do Impacto',
    stageName: 'Fase de Controle Álgico e Restabelecimento Biomecânico',
    clinicalRationale: 'Objetivo de normalizar o ritmo escapulotorácico, desativar pontos-gatilho compensatórios em trapézio superior e fortalecer rotadores externos e retratores da escápula abaixo de 90° de elevação.',
    redFlags: [
      'Evitar abdução acima de 90° com rotação interna combinada (posição de pinçamento de Neer).',
      'Não realizar cargas máximas excêntricas na fase inflamatória aguda com dor noturna intensa.'
    ],
    suggestedGoals: [
      'Cessar dor em repouso e dor noturna',
      'Restabelecer ritmo escapular sem elevação compensatória do ombro',
      'Fortalecer rotadores externos (infraespinhal e redondo menor)',
      'Elevação funcional livre a 150°-180° sem dor'
    ],
    exercises: [
      {
        title: 'Depressão e Retração Escapular em Decúbito Ventral',
        category: 'controle_motor',
        sets: '3 séries',
        reps: '12 repetições',
        holdTime: '3 segundos de sustentação',
        frequency: '2x ao dia',
        instructions: 'Deitado de bruços com a testa apoiada, aproxime as escápulas puxando os ombros para baixo e para trás em direção aos bolsos da calça.',
        cautionNotes: 'Evite usar o pescoço ou trapézio superior.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=retracao+escapular+exercicio'
      },
      {
        title: 'Rotação Externa Isométrica contra a Parede',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '10 repetições',
        holdTime: '10 segundos mantendo pressão contínua',
        frequency: '2x ao dia',
        instructions: 'Cotovelo a 90° colado ao tronco, com toalha sob a axila. Pressione as costas da mão contra a parede lateralmente sem mover o cotovelo.',
        cautionNotes: 'Não afaste o cotovelo da costela.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=rotacao+externa+isometrica+ombro'
      },
      {
        title: 'Alongamento da Cápsula Posterior (Sleeper Stretch Modificado)',
        category: 'alongamento',
        sets: '3 repetições',
        reps: '1 por lado',
        holdTime: '30 segundos sustentados',
        frequency: '1x ao dia',
        instructions: 'Deitado de lado sobre o ombro afetado, cotovelo a 90°. Use a outra mão para empurrar suavemente a mão em direção ao chão até sentir tração suave posterior.',
        cautionNotes: 'Não force se houver dor na parte anterior do ombro.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=sleeper+stretch+ombro'
      }
    ]
  },

  'lombar': {
    condition: 'Lombalgia Mecânica / Protrusão Discal Lombar',
    stageName: 'Fase Subaguda de Estabilização Lombo-Pélvica',
    clinicalRationale: 'Visa a descompressão neural, redução do medo do movimento (cinesiofobia), conscientização do neutro espinhal e ativação de estabilizadores profundos (transverso abdominal, multífidos e glúteo médio).',
    redFlags: [
      'Atenção à Síndrome da Cauda Equina: perda súbita de controle de esfíncter (bexiga/intestino) ou anestesia em sela.',
      'Perda de força motora rápida (pé caído / incapacidade de ficar nas pontas dos pés).'
    ],
    suggestedGoals: [
      'Alívio da dor irradiada para membros inferiores (centralização dos sintomas)',
      'Tolerância de permanência sentado por mais de 2 horas',
      'Ativação efetiva de bracing abdominal em atividades de vida diária'
    ],
    exercises: [
      {
        title: 'Extensão Lombar Passiva de McKenzie (Prone Press-up)',
        category: 'mobilidade',
        sets: '2 séries',
        reps: '10 repetições',
        holdTime: '2 segundos no topo',
        frequency: '3x ao dia',
        instructions: 'Deitado de barriga para baixo, apoie as mãos como se fosse fazer flexão e empurre suavemente para erguer o tronco mantendo os glúteos e a bacia totalmente relaxados no solo.',
        cautionNotes: 'Pare imediatamente se a dor se espalhar para as pernas (periferização). Ideal para sintomas que centralizam na coluna.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=mckenzie+extensao+lombar'
      },
      {
        title: 'Perdigueiro (Bird-Dog) com Foco em Neutro Espinhal',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '8 repetições de cada lado',
        holdTime: '5 segundos de sustentação',
        frequency: '1x ao dia',
        instructions: 'Em 4 apoios, estenda um braço à frente e a perna oposta para trás em linha reta com a coluna. Mantenha a bacia nivelada.',
        cautionNotes: 'Não permita hiperextensão lombar ou rotação pélvica.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=bird+dog+estabilidade+lombar'
      },
      {
        title: 'Ponte Pélvica com Bracing Abdominal',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '12 repetições',
        holdTime: '3 segundos no topo',
        frequency: '1x ao dia',
        instructions: 'Deite de costas, joelhos flexionados. Ative o abdômen suavemente como se fosse tossir e suba a bacia contraindo os glúteos.',
        cautionNotes: 'Evite arquear a coluna lombar ao subir.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=ponte+gluteo+lombalgia'
      }
    ]
  },

  'tornozelo': {
    condition: 'Entorse de Tornozelo por Inversão (Ligamento Talofibular Anterior)',
    stageName: 'Fase de Remodelamento Tecidual e Propriocepção',
    clinicalRationale: 'Restauração da dorsiflexão completa em cadeia cinética fechada, fortalecimento de fibulares para prevenir recidivas de entorse e reabilitação do reflexo neuromuscular em apoio unipodal.',
    redFlags: [
      'Regras de Ottawa: incapacidade de dar 4 passos consecutivos ou dor à palpação nos maléolos exige radiografia para descartar fratura.'
    ],
    suggestedGoals: [
      'Alcançar teste lunge do joelho à parede (WBLT) > 10cm',
      'Fortalecimento de fibulares longo e curto (eversão)',
      'Equilíbrio monopodal estável por 30s de olhos abertos e fechados'
    ],
    exercises: [
      {
        title: 'Mobilização de Dorsiflexão em Carga (Knee to Wall)',
        category: 'mobilidade',
        sets: '2 séries',
        reps: '12 repetições',
        holdTime: '2 segundos no final',
        frequency: '2x ao dia',
        instructions: 'De frente para uma parede em posição de passada, toque o joelho na parede sem deixar o calcanhar de trás descolar do chão.',
        cautionNotes: 'Não deixe o arco plantar desabar para dentro.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=dorsiflexao+tornozelo+parede'
      },
      {
        title: 'Fortalecimento de Eversão com Faixa Elástica',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '15 repetições',
        holdTime: 'Pausa de 2 segundos na eversão',
        frequency: '1x ao dia',
        instructions: 'Sentado com as pernas esticadas, prenda o elástico no pé oposto e puxe o pé afetado para fora e para cima contra a resistência.',
        cautionNotes: 'Realize o movimento controlado na volta excêntrica.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=fortalecimento+fibulares+faixa'
      },
      {
        title: 'Equilíbrio Monopodal com Perturbação Visual',
        category: 'propriocepcao',
        sets: '3 séries',
        reps: '30 segundos por série',
        holdTime: '30 segundos contínuos',
        frequency: '2x ao dia',
        instructions: 'Fique apoiado apenas no pé afetado, mantendo joelho levemente destravado. Tente mover suavemente a cabeça de um lado para o outro.',
        cautionNotes: 'Pratique próximo a uma parede para suporte seguro.',
        externalVideoUrl: 'https://www.youtube.com/results?search_query=propriocepcao+tornozelo+unipodal'
      }
    ]
  }
};

export const AIAssistantService = {
  async generateTreatmentPlan(userPrompt: string): Promise<AIPrescriptionDraft> {
    const apiKey = StorageService.getGeminiApiKey();

    if (apiKey) {
      try {
        const result = await this.callGeminiApi(userPrompt, apiKey);
        if (result) return result;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to evidence-based clinical engine:', err);
      }
    }

    // Evidence-based engine fallback
    return this.generateFromKnowledgeBase(userPrompt);
  },

  async testGeminiApiKey(apiKey: string): Promise<{ success: boolean; model?: string; error?: string }> {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        });
        if (response.ok) {
          return { success: true, model };
        }
      } catch (err: any) {
        // continue to next model
      }
    }
    return { success: false, error: 'Chave inválida ou limite excedido. Verifique sua chave no Google AI Studio.' };
  },

  async callGeminiApi(userPrompt: string, apiKey: string): Promise<AIPrescriptionDraft | null> {
    const systemInstruction = `Você é um Fisioterapeuta Especialista e Consultor Clínico Avançado do sistema LOOP.
Sua missão é gerar um plano de tratamento e prescrição de exercícios domiciliares ultra-específico, seguro, baseado em evidências e pronto para uso imediato pelo profissional.
Responda ESTRITAMENTE em formato JSON compatível com a interface AIPrescriptionDraft:
{
  "condition": "Diagnóstico ou lesão formatado profissionalmente",
  "stageName": "Fase clínica recomendada (ex: Fase 1 - Pós-op precoce)",
  "clinicalRationale": "Texto explicativo sucinto com o embasamento fisiológico da conduta",
  "redFlags": ["Contraindicação ou alerta 1", "Alerta 2"],
  "suggestedGoals": ["Meta funcional 1", "Meta funcional 2", "Meta funcional 3"],
  "exercises": [
    {
      "title": "Nome do Exercício Técnico",
      "category": "mobilidade" | "fortalecimento" | "alongamento" | "propriocepcao" | "controle_motor",
      "sets": "Ex: 3 séries",
      "reps": "Ex: 12 repetições",
      "holdTime": "Ex: 5 segundos no topo (opcional)",
      "frequency": "Ex: 2x ao dia",
      "instructions": "Passo a passo claro e direto para o paciente executar em casa",
      "cautionNotes": "Dica de segurança / compensação postural comum",
      "externalVideoUrl": "https://www.youtube.com/results?search_query=nome+do+exercicio"
    }
  ]
}`;

    const promptText = `Crie a prescrição clínica para a seguinte condição ou queixa: "${userPrompt}". Gere de 3 a 5 exercícios domiciliares práticos, objetivos e seguros.`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemInstruction },
                  { text: promptText }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed: AIPrescriptionDraft = JSON.parse(candidateText);
            return parsed;
          }
        }
      } catch (e) {
        console.warn(`Attempt with ${model} failed, trying fallback...`);
      }
    }

    return null;
  },

  generateFromKnowledgeBase(prompt: string): AIPrescriptionDraft {
    const lower = prompt.toLowerCase();

    if (lower.includes('lca') || lower.includes('cruzado') || (lower.includes('joelho') && lower.includes('op'))) {
      return CLINICAL_KNOWLEDGE_BASE['lca'];
    }
    if (lower.includes('ombro') || lower.includes('manguito') || lower.includes('supra') || lower.includes('impacto')) {
      return CLINICAL_KNOWLEDGE_BASE['ombro'];
    }
    if (lower.includes('lombar') || lower.includes('coluna') || lower.includes('hérnia') || lower.includes('hernia') || lower.includes('costas')) {
      return CLINICAL_KNOWLEDGE_BASE['lombar'];
    }
    if (lower.includes('tornozelo') || lower.includes('entorse') || lower.includes('talofibular') || lower.includes('pisada')) {
      return CLINICAL_KNOWLEDGE_BASE['tornozelo'];
    }

    // Dynamic intelligent heuristic template for any other condition
    const cleanTitle = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    return {
      condition: cleanTitle,
      stageName: 'Fase Inicial de Readaptação Tecidual e Controle Álgico',
      clinicalRationale: `Conduta desenhada para ${cleanTitle}. Prioriza a redução de sobrecarga mecânica desfavorável, desativação de reflexos álgicos protetores e ativação neuromuscular gradativa sem irritação tecidual.`,
      redFlags: [
        'Interromper imediatamente qualquer movimento que gere dor aguda em pontada ou queimação > 4/10.',
        'Evitar cargas excessivas até que a estabilização articular esteja consolidada.'
      ],
      suggestedGoals: [
        `Restaurar a amplitude funcional livre de dor para ${cleanTitle}`,
        'Diminuir a pontuação na Escala Visual Analógica de Dor (EVA < 2)',
        'Garantir controle motor e independência nas atividades de vida diária'
      ],
      exercises: [
        {
          title: `Mobilidade Ativa e Descompressão para ${cleanTitle}`,
          category: 'mobilidade',
          sets: '2 séries',
          reps: '12 repetições',
          holdTime: 'Pausa suave de 3 segundos',
          frequency: '2x ao dia',
          instructions: 'Execute o movimento de amplitude controlada até o limiar de desconforto leve, respirando pausadamente sem prender o ar.',
          cautionNotes: 'Não force contra bloqueios mecânicos rígidos.',
          externalVideoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + ' fisioterapia exercicio')}`
        },
        {
          title: `Ativação Isométrica Submáxima com Estabilização`,
          category: 'fortalecimento',
          sets: '3 séries',
          reps: '10 repetições',
          holdTime: '5 a 8 segundos de contração contínua',
          frequency: '1x ao dia',
          instructions: 'Contraia a musculatura adjacente sem mover a articulação, sustentando a pressão de forma firme e indolor.',
          cautionNotes: 'Mantenha a respiração contínua; não faça apneia.',
          externalVideoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + ' isometria')}`
        },
        {
          title: `Alongamento Suave e Relaxamento Miofascial`,
          category: 'alongamento',
          sets: '3 repetições',
          reps: '1 por segmento',
          holdTime: '30 segundos mantidos',
          frequency: 'Ao final do dia',
          instructions: 'Posicione o segmento corporal até sentir uma tensão agradável de alongamento. Mantenha por 30 segundos em relaxamento profundo.',
          cautionNotes: 'Não balance ou force o alongamento com trancos.',
          externalVideoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + ' alongamento')}`
        }
      ]
    };
  }
};
