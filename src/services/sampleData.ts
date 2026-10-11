import { Patient } from '../types';

// Helper to create clean clinical SVG representations for mock images (before/after & exams)
function createSvgDataUrl(title: string, subtitle: string, angleOrText: string, color: string = '#18181b', bgColor: string = '#f4f4f5'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="${bgColor}"/>
    <rect x="20" y="20" width="560" height="410" fill="none" stroke="#e4e4e7" stroke-width="2" stroke-dasharray="6 6" rx="8"/>
    <circle cx="300" cy="180" r="70" fill="none" stroke="${color}" stroke-width="4" opacity="0.8"/>
    <line x1="300" y1="180" x2="360" y2="120" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <text x="300" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="${color}" text-anchor="middle">${title}</text>
    <text x="300" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#71717a" text-anchor="middle">${subtitle}</text>
    <rect x="230" y="325" width="140" height="36" rx="18" fill="${color}"/>
    <text x="300" y="348" font-family="monospace" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">${angleOrText}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_SAMPLE_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Lucas Silveira',
    phone: '(11) 98765-4321',
    email: 'lucas.silveira@email.com',
    birthDate: '1996-04-15',
    gender: 'Masculino',
    occupation: 'Engenheiro de Software / Corredor amador',
    condition: 'Pós-operatório Reconstrução LCA Direito (Tendão Flexores)',
    injuryDate: '2026-08-12',
    clinicalHistory: 'Entorse com rotação de joelho durante treino de futebol. Cirurgia realizada por artroscopia com enxerto de semitendíneo/grácil. Sem lesão meniscal associada. Sem outras comorbidades.',
    
    // North Star Metric
    mainGoal: 'Voltar a correr 5km na esteira e retornar ao futebol recreativo sem instabilidade',
    mainGoalCategory: 'Retorno ao Esporte',
    mainGoalAchieved: false,

    exams: [
      {
        id: 'exam-1',
        title: 'Ressonância Magnética de Joelho D',
        date: '2026-08-15',
        type: 'ressonancia',
        fileName: 'RM_Joelho_Direito_Laudo.pdf',
        fileUrl: createSvgDataUrl('RESSONÂNCIA MAGNÉTICA', 'Corte Sagital T2 - Joelho D', 'Ruptura Completa LCA', '#09090b', '#f4f4f5'),
        notes: 'Ruptura completa do ligamento cruzado anterior no terço médio. Meniscos íntegros, sem edema ósseo subcondral grave.'
      },
      {
        id: 'exam-2',
        title: 'Raio-X de Controle Pós-Operatório',
        date: '2026-08-25',
        type: 'raio-x',
        fileName: 'RX_Controle_PosOp_Joelho.png',
        fileUrl: createSvgDataUrl('RAIO-X CONTROLE PÓS-OP', 'Túneis Ósseos Fêmur e Tíbia', 'Fixação Estável OK', '#27272a', '#e4e4e7'),
        notes: 'Túneis ósseos com posicionamento anatômico preservado, parafusos de interferência fixos.'
      }
    ],

    evolutions: [
      {
        id: 'evo-1',
        date: '2026-08-26',
        functionalPrevious: 'Sem apoio de carga, dependente de 2 muletas canadenses.',
        functionalCurrent: 'Iniciando apoio bipodal parcial com órtese estabilizadora travada em 0°. Dor em repouso ao estender.',
        painEVA: 7,
        mobilityMetrics: [
          {
            id: 'rom-1',
            joint: 'Joelho Direito',
            movement: 'Extensão Passiva',
            baselineDegrees: -5,
            currentDegrees: -3,
            targetDegrees: 0
          },
          {
            id: 'rom-2',
            joint: 'Joelho Direito',
            movement: 'Flexão Ativa',
            baselineDegrees: 35,
            currentDegrees: 50,
            targetDegrees: 135
          }
        ],
        strengthMetrics: [
          {
            id: 'str-1',
            muscleGroup: 'Quadríceps (VMO)',
            grade: 2,
            notes: 'Ativação muscular com atraso reflexo perceptível'
          },
          {
            id: 'str-2',
            muscleGroup: 'Glúteo Médio',
            grade: 3,
            notes: 'Sustenta na gravidade sem resistência'
          }
        ],
        evolutionPhotos: [
          {
            id: 'photo-1',
            date: '2026-08-26',
            label: 'Avaliação Inicial - Flexão Máxima',
            stage: 'antes',
            imageUrl: createSvgDataUrl('FOTO INICIAL (D1)', 'Flexão Ativa de Joelho Limitada', 'ADM: 50° | EVA: 7', '#dc2626', '#fef2f2'),
            notes: 'Restrição mecânica importante e apreensão álgica'
          }
        ],
        goals: [
          { id: 'g-1', description: 'Controle de edema (grau 0-1) e dor', status: 'achieved' },
          { id: 'g-2', description: 'Extensão completa 0° sem déficit', status: 'in_progress' },
          { id: 'g-3', description: 'Flexão ativa até 90°', status: 'achieved' },
          { id: 'g-4', description: 'Desmame de muletas com marcha simétrica', status: 'in_progress' },
          { id: 'g-5', description: 'Retorno ao trote e corrida leve', status: 'pending' }
        ],
        notes: 'Paciente focado, ótima tolerância à crioterapia e mobilização patelar superior/inferior.'
      },
      {
        id: 'evo-2',
        date: '2026-09-24',
        functionalPrevious: 'Marcha claudicante com 1 muleta, flexão em 80°.',
        functionalCurrent: 'Marcha livre sem muletas, apoio monopodal estável por 20 segundos. Sobe e desce escadas com apoio leve.',
        painEVA: 2,
        mobilityMetrics: [
          {
            id: 'rom-1',
            joint: 'Joelho Direito',
            movement: 'Extensão Passiva',
            baselineDegrees: -5,
            currentDegrees: 0,
            targetDegrees: 0
          },
          {
            id: 'rom-2',
            joint: 'Joelho Direito',
            movement: 'Flexão Ativa',
            baselineDegrees: 35,
            currentDegrees: 118,
            targetDegrees: 135
          }
        ],
        strengthMetrics: [
          {
            id: 'str-1',
            muscleGroup: 'Quadríceps (VMO)',
            grade: 4,
            notes: 'Boa força contra resistência moderada, sem perda de controle'
          },
          {
            id: 'str-2',
            muscleGroup: 'Glúteo Médio',
            grade: 4,
            notes: 'Estabilidade pélvica preservada no teste monopodal'
          }
        ],
        evolutionPhotos: [
          {
            id: 'photo-2',
            date: '2026-09-24',
            label: 'Evolução Semana 4 - Flexão Ganha',
            stage: 'depois',
            imageUrl: createSvgDataUrl('FOTO ATUAL (SEM 4)', 'Ganho Notável de Mobilidade', 'ADM: 118° | EVA: 2', '#16a34a', '#f0fdf4'),
            notes: 'Extensão em 0° restabelecida e flexão livre sem dor'
          }
        ],
        goals: [
          { id: 'g-1', description: 'Controle de edema (grau 0-1) e dor', status: 'achieved' },
          { id: 'g-2', description: 'Extensão completa 0° sem déficit', status: 'achieved' },
          { id: 'g-3', description: 'Flexão ativa até 90°', status: 'achieved' },
          { id: 'g-4', description: 'Desmame de muletas com marcha simétrica', status: 'achieved' },
          { id: 'g-5', description: 'Retorno ao trote e corrida leve', status: 'in_progress' }
        ],
        notes: 'Evolução clínica exemplar. Liberado para intensificar cadeia cinética fechada e propriocepção dinâmica.'
      }
    ],

    prescriptions: [
      {
        id: 'presc-1',
        title: 'Extensão Ativa de Joelho com Rolo (Co-contração)',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '15 repetições',
        holdTime: '5 segundos em isometria no topo',
        frequency: '2x ao dia (manhã e noite)',
        instructions: 'Sentado com apoio lombar, coloque uma toalha enrolada sob o tornozelo. Contraia a coxa empurrando a parte de trás do joelho para baixo até travar a perna esticada. Segure 5s e desça suavemente.',
        cautionNotes: 'Não deixe a patela desviar lateralmente; concentre a força no músculo interno da coxa (VMO).',
        externalVideoUrl: 'https://www.youtube.com/watch?v=D3f3v0t2A2k',
        completedToday: true
      },
      {
        id: 'presc-2',
        title: 'Ponte Bipodal com Foco em Isquiotibiais e Glúteos',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '12 repetições',
        holdTime: '3 segundos no topo',
        frequency: '1x ao dia',
        instructions: 'Deitado de barriga para cima, joelhos dobrados a 90° e pés alinhados na largura do quadril. Eleve o quadril até formar uma linha reta entre ombros e joelhos.',
        cautionNotes: 'Não hiperextenda a coluna lombar; o movimento deve vir estritamente dos glúteos.',
        externalVideoUrl: 'https://www.youtube.com/watch?v=OUgsJ8-Vigk',
        completedToday: true
      },
      {
        id: 'presc-3',
        title: 'Deslizamento de Calcanhar na Parede (Wall Slide)',
        category: 'mobilidade',
        sets: '2 séries',
        reps: '10 repetições',
        holdTime: '10 segundos na flexão tolerada',
        frequency: '2x ao dia',
        instructions: 'Deitado próximo a uma parede, apoie os pés e permita que a gravidade ajude a dobrar o joelho direito confortavelmente até o limite de sensação de alongamento, sem dor aguda.',
        cautionNotes: 'Pare caso a dor ultrapasse 3 na escala EVA.',
        externalVideoUrl: 'https://www.youtube.com/watch?v=0kFqB1u7D9U',
        completedToday: false
      },
      {
        id: 'presc-4',
        title: 'Equilíbrio Monopodal em Superfície Estável',
        category: 'propriocepcao',
        sets: '3 séries',
        reps: '1 repetição por perna',
        holdTime: '30 segundos por série',
        frequency: '1x ao dia',
        instructions: 'Fique em apoio em uma perna só (perna direita operada), mantendo micro-flexão de joelho de 5°. Olhe para um ponto fixo à frente.',
        cautionNotes: 'Realize próximo a uma parede ou bancada para apoio imediato em caso de desequilíbrio.',
        externalVideoUrl: 'https://www.youtube.com/watch?v=3VjW3t21Jkw',
        completedToday: false
      }
    ],

    patientLogs: [
      {
        id: 'log-1',
        date: '2026-10-07',
        completedExercisesIds: ['presc-1', 'presc-2', 'presc-3'],
        painPostWorkout: 2,
        perceivedEffort: 5,
        patientComment: 'Consegui estender bem a perna no rolo sem estalo. Senti um leve cansaço na coxa, mas dor super tranquila!'
      },
      {
        id: 'log-2',
        date: '2026-10-08',
        completedExercisesIds: ['presc-1', 'presc-2'],
        painPostWorkout: 1,
        perceivedEffort: 4,
        patientComment: 'Fiz a rotina da manhã sem nenhuma dor. Joelho tá bem mais leve.'
      }
    ],

    createdAt: '2026-08-26T10:00:00Z',
    updatedAt: '2026-10-08T15:30:00Z'
  },
  {
    id: 'pat-2',
    name: 'Mariana Vasconcelos',
    phone: '(21) 97123-4567',
    email: 'mariana.vasconcelos@email.com',
    birthDate: '1990-09-18',
    gender: 'Feminino',
    occupation: 'Arquiteta e Designer',
    condition: 'Tendinopatia do Manguito Rotador (Supraespinhal) - Ombro Esquerdo',
    injuryDate: '2026-07-20',
    clinicalHistory: 'Dor insidiosa há 4 meses piorando com movimentos acima de 90° de abdução/flexão. Sem trauma prévio. Piora noturna ao deitar sobre o lado esquerdo.',
    
    // North Star Metric
    mainGoal: 'Elevar o braço a 180° e pegar objetos na prateleira alta sem dor aguda ou bloqueio',
    mainGoalCategory: 'Independência AVD',
    mainGoalAchieved: false,

    exams: [
      {
        id: 'exam-201',
        title: 'Ultrassonografia de Ombro E',
        date: '2026-07-28',
        type: 'ultrassom',
        fileName: 'USG_Ombro_Esquerdo.pdf',
        fileUrl: createSvgDataUrl('ULTRASSONOGRAFIA OMBRO', 'Tendão Supraespinhal', 'Tendinose s/ Ruptura', '#09090b', '#f4f4f5'),
        notes: 'Espessamento do tendão do supraespinhal com discreto halo hipoecogênico peritendíneo. Sem rotura parcial ou total.'
      }
    ],

    evolutions: [
      {
        id: 'evo-201',
        date: '2026-08-01',
        functionalPrevious: 'Dor intensa ao pentear o cabelo e vestir jaqueta.',
        functionalCurrent: 'Arco doloroso entre 70° e 120° de abdução. Consegue elevar até 110° com compensação escapular.',
        painEVA: 6,
        mobilityMetrics: [
          {
            id: 'rom-201',
            joint: 'Ombro Esquerdo',
            movement: 'Flexão Anterior',
            baselineDegrees: 110,
            currentDegrees: 115,
            targetDegrees: 180
          },
          {
            id: 'rom-202',
            joint: 'Ombro Esquerdo',
            movement: 'Rotação Externa',
            baselineDegrees: 35,
            currentDegrees: 40,
            targetDegrees: 70
          }
        ],
        strengthMetrics: [
          {
            id: 'str-201',
            muscleGroup: 'Rotadores Externos (Infra/Redondo Menor)',
            grade: 3,
            notes: 'Fadiga rápida com dor leve'
          }
        ],
        evolutionPhotos: [
          {
            id: 'photo-201',
            date: '2026-08-01',
            label: 'Abdução de Ombro - Dia 1',
            stage: 'antes',
            imageUrl: createSvgDataUrl('POSTURA INICIAL', 'Elevação Lateral com Compensação', 'ADM: 110° | EVA: 6', '#dc2626', '#fef2f2'),
            notes: 'Elevação da escápula visível para compensar fraqueza'
          }
        ],
        goals: [
          { id: 'g-201', description: 'Alívio da dor noturna e repouso', status: 'achieved' },
          { id: 'g-202', description: 'Correção da discinese escapular', status: 'in_progress' },
          { id: 'g-203', description: 'Elevação completa sem dor (180°)', status: 'pending' }
        ],
        notes: 'Boa resposta ao trabalho escapulotorácico inicial.'
      }
    ],

    prescriptions: [
      {
        id: 'presc-201',
        title: 'Retração e Depressão Escapular na Parede',
        category: 'controle_motor',
        sets: '3 séries',
        reps: '12 repetições',
        holdTime: '4 segundos',
        frequency: '2x ao dia',
        instructions: 'De pé com as costas apoiadas na parede, deslize os ombros para baixo e para trás aproximando as escápulas da coluna sem curvar a lombar.',
        cautionNotes: 'Não encolha os ombros em direção às orelhas.',
        externalVideoUrl: 'https://www.youtube.com/watch?v=sample_rotator',
        completedToday: true
      },
      {
        id: 'presc-202',
        title: 'Rotação Externa com Faixa Elástica Leve (Theraband)',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '10 repetições',
        holdTime: 'Pausa de 2 segundos',
        frequency: '1x ao dia',
        instructions: 'Cotovelo colado ao corpo a 90° com uma toalha dobrada sob o braço. Gire o antebraço para fora contra a resistência leve.',
        cautionNotes: 'Mantenha o punho reto e evite afastar o cotovelo da costela.',
        externalVideoUrl: 'https://www.youtube.com/watch?v=sample_rotator_band',
        completedToday: false
      }
    ],

    patientLogs: [
      {
        id: 'log-201',
        date: '2026-10-08',
        completedExercisesIds: ['presc-201'],
        painPostWorkout: 3,
        perceivedEffort: 4,
        patientComment: 'A ativação das costas aliviou bastante a pressão na frente do ombro.'
      }
    ],

    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-10-08T11:00:00Z'
  },
  {
    id: 'pat-3',
    name: 'Carlos Eduardo Mendes',
    phone: '(31) 99876-5432',
    email: 'carlos.mendes@email.com',
    birthDate: '1974-11-03',
    gender: 'Masculino',
    occupation: 'Contador',
    condition: 'Lombalgia Mecânica Crônica e Protrusão Discal L5-S1',
    injuryDate: '2026-06-10',
    clinicalHistory: 'Histórico de dor lombar em queimação há 2 anos, acentuada após longas jornadas sentado. Sem déficit motor agudo nos membros inferiores.',
    
    // North Star Metric
    mainGoal: 'Trabalhar 6 horas sentado sem travamento lombar e caminhar 30min sem dor irradiada',
    mainGoalCategory: 'Qualidade de Vida',
    mainGoalAchieved: true,
    mainGoalAchievedDate: '2026-10-05',

    exams: [
      {
        id: 'exam-301',
        title: 'RM de Coluna Lombar',
        date: '2026-06-18',
        type: 'ressonancia',
        fileName: 'RM_Coluna_Lombar_L5S1.pdf',
        fileUrl: createSvgDataUrl('RESSONÂNCIA COLUNA LOMBAR', 'Espaço Intervertebral L5-S1', 'Protrusão Discal Focal', '#09090b', '#f4f4f5'),
        notes: 'Discreta protrusão discal póstero-central L5-S1 sem compressão radicular significativa.'
      }
    ],

    evolutions: [
      {
        id: 'evo-301',
        date: '2026-06-25',
        functionalPrevious: 'Incapacidade de ficar mais de 30 minutos sentado.',
        functionalCurrent: 'Tolerando 3 horas com pausas ativas. Dor matinal reduzida significativamente.',
        painEVA: 5,
        mobilityMetrics: [
          {
            id: 'rom-301',
            joint: 'Coluna Lombar',
            movement: 'Flexão Anterior (Dedos ao Chão)',
            baselineDegrees: 30,
            currentDegrees: 18,
            targetDegrees: 0
          }
        ],
        strengthMetrics: [
          {
            id: 'str-301',
            muscleGroup: 'Transverso do Abdômen e Multífidos',
            grade: 2,
            notes: 'Dificuldade em manter ativação na respiração diafragmática'
          }
        ],
        evolutionPhotos: [
          {
            id: 'photo-301',
            date: '2026-06-25',
            label: 'Avaliação Postural Estática',
            stage: 'antes',
            imageUrl: createSvgDataUrl('POSTURA INICIAL', 'Hiperlordose e Projeção Pélvica', 'EVA: 5 | Rigidez', '#dc2626', '#fef2f2'),
            notes: 'Anteversão pélvica acentuada com encurtamento de iliopsoas'
          }
        ],
        goals: [
          { id: 'g-301', description: 'Dominar manobra de bracing abdominal', status: 'achieved' },
          { id: 'g-302', description: 'Eliminar episódios agudos de travamento', status: 'achieved' },
          { id: 'g-303', description: 'Retorno seguro a caminhadas diárias de 30min', status: 'achieved' }
        ],
        notes: 'Alta com prescrição para manutenção domiciliar independente.'
      }
    ],

    prescriptions: [
      {
        id: 'presc-301',
        title: 'Bird-Dog (Perdigueiro) com Foco em Estabilidade do Core',
        category: 'fortalecimento',
        sets: '3 séries',
        reps: '10 repetições alternadas',
        holdTime: '4 segundos de sustentação',
        frequency: 'Diariamente pela manhã',
        instructions: 'Em posição de 4 apoios, alinhe mãos sob ombros e joelhos sob quadris. Estenda o braço direito à frente e a perna esquerda para trás sem deixar a bacia rodar.',
        cautionNotes: 'Não arqueie as costas; imagine uma xícara d água apoiada na sua lombar.',
        externalVideoUrl: 'https://www.youtube.com/watch?v=sample_birddog',
        completedToday: true
      }
    ],

    patientLogs: [
      {
        id: 'log-301',
        date: '2026-10-06',
        completedExercisesIds: ['presc-301'],
        painPostWorkout: 0,
        perceivedEffort: 3,
        patientComment: 'Sem dores hoje! Sentei durante toda a manhã no trabalho sem nenhum incômodo.'
      }
    ],

    createdAt: '2026-06-25T14:00:00Z',
    updatedAt: '2026-10-06T18:00:00Z'
  }
];
