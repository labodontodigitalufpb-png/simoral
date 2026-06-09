const state = {
  language: "pt",
  cases: [],
  currentCase: null,
  revealed: new Set(),
  askedIntents: new Map(),
  selectedHypotheses: new Set(),
  selectedActions: new Set(),
  transcript: [],
  flowEvents: [],
  outOfOrderEvents: [],
  structuredQuestions: {},
  structuredQuestionTotals: {},
  hdaQuestionAxes: new Set(),
  lastReport: null,
  pendingAnamnesisUpdate: null,
  pendingClinicalDatum: null,
  physicalExamUnlocked: false,
  student: {
    name: "",
    id: "",
    college: ""
  },
  voiceEnabled: false,
  voices: [],
  recognition: null,
  recognizing: false
};

const els = {
  studentForm: document.querySelector("#studentForm"),
  languageSelect: document.querySelector("#languageSelect"),
  studentName: document.querySelector("#studentName"),
  studentId: document.querySelector("#studentId"),
  studentCollege: document.querySelector("#studentCollege"),
  caseSelect: document.querySelector("#caseSelect"),
  caseSummary: document.querySelector("#caseSummary"),
  chartList: document.querySelector("#chartList"),
  progressList: document.querySelector("#progressList"),
  patientName: document.querySelector("#patientName"),
  emotionBadge: document.querySelector("#emotionBadge"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  avatar: document.querySelector("#avatar"),
  patientImage: document.querySelector("#patientImage"),
  flowList: document.querySelector("#flowList"),
  physicalExamBox: document.querySelector("#physicalExamBox"),
  chatLog: document.querySelector("#chatLog"),
  chatForm: document.querySelector("#chatForm"),
  questionInput: document.querySelector("#questionInput"),
  voiceToggle: document.querySelector("#voiceToggle"),
  micBtn: document.querySelector("#micBtn"),
  voiceStatus: document.querySelector("#voiceStatus"),
  hypothesisList: document.querySelector("#hypothesisList"),
  actionList: document.querySelector("#actionList"),
  finishBtn: document.querySelector("#finishBtn"),
  osceNotes: document.querySelector("#osceNotes"),
  saveOsceBtn: document.querySelector("#saveOsceBtn"),
  exportCurrentOsceBtn: document.querySelector("#exportCurrentOsceBtn"),
  exportAllOsceBtn: document.querySelector("#exportAllOsceBtn"),
  clearOsceBtn: document.querySelector("#clearOsceBtn"),
  osceStatus: document.querySelector("#osceStatus"),
  report: document.querySelector("#report")
};

const I18N = {
  pt: {
    tagline: "Simulador inteligente de anamnese odontológica",
    language: "Idioma",
    student: "Aluno",
    studentName: "Nome do aluno",
    studentId: "Matrícula",
    studentCollege: "Faculdade",
    clinicalCase: "Caso clínico",
    selectCase: "Selecionar caso clínico",
    chart: "Prontuário",
    progress: "Progresso",
    physicalExam: "Exame físico",
    physicalExamLocked: "O exame físico será liberado após cobrir a HDA com perguntas sobre quando, onde, como e por quê, além de pelo menos 2 perguntas nas demais etapas e a maioria dos dados essenciais obtida.",
    physicalExamUnlocked: "Detalhes do exame clínico físico liberados",
    physicalExamUnavailable: "Exame físico detalhado não cadastrado para este caso.",
    stageLocked: "Etapa registrada fora da sequência esperada.",
    virtualOffice: "Consultório virtual 3D",
    patient: "Paciente",
    patientVoice: "Voz do paciente",
    askQuestion: "Pergunte ao paciente, por exemplo: ha quanto tempo esta com a ferida?",
    speakQuestion: "Falar pergunta",
    send: "Enviar",
    anamnesisSequence: "Sequência da anamnese",
    diagnosticHypotheses: "Hipóteses diagnósticas",
    examsConduct: "Exames e conduta",
    evaluation: "Avaliação",
    finishCare: "Finalizar atendimento",
    years: "anos",
    difficulty: "Dificuldade",
    calm: "Calmo",
    anxious: "Ansioso",
    pain: "Dor",
    neutral: "Neutro",
    done: "feito",
    pending: "pendente",
    stageRed: "0/3",
    stageYellow: "em andamento",
    stageGreen: "completo",
    outOfOrder: "fora da ordem",
    currentStage: "etapa atual",
    questionsShort: "perg.",
    dataShort: "dados",
    noStageData: "sem dados críticos nesta etapa",
    anamnesisLink: "Anamnese",
    registeredInStage: "registrado em",
    alreadyRegisteredInStage: "já constava em",
    questionCountedInStage: "pergunta registrada em",
    sequenceAlerts: "Alertas de sequência",
    noSequenceAlerts: "sequência conduzida sem saltos relevantes",
    chiefComplaint: "Queixa principal",
    profile: "Perfil",
    base: "Base",
    objective: "Objetivo",
    baseText: "roteiro clínico extraído do arquivo Word importado.",
    objectiveText: "siga a sequência: HDA, história familiar, médica, odontológica e hábitos/dependências; na HDA, valorize quando, onde, como e por quê.",
    studentMissing: "nao cadastrado",
    notInformed: "nao informado",
    collegeMissing: "nao informada",
    complaint: "Queixa",
    expectedScript: "Roteiro esperado: história da doença atual, história familiar, história médica, história odontológica e hábitos/dependências. Na HDA, investigue quando, onde, como e por quê; perguntas amplas ou específicas liberam dados do prontuário.",
    unavailableRecognition: "Reconhecimento de fala indisponivel neste navegador.",
    unavailableMic: "Microfone por voz indisponivel neste navegador.",
    listening: "Ouvindo a pergunta do profissional...",
    micReady: "Microfone pronto para nova pergunta.",
    micError: "Nao consegui captar o audio. Tente novamente.",
    micAvailable: "Microfone disponível no Chrome/Edge.",
    score: "Nota",
    diagnosis: "Diagnostico",
    diagnosisHit: "hipotese principal correta",
    diagnosisMiss: "hipotese principal nao selecionada",
    expectedDiagnosis: "Diagnostico esperado",
    sequence: "Sequencia da anamnese",
    observedOrder: "Ordem observada",
    gaps: "Pendencias",
    omittedQuestions: "Perguntas omitidas",
    missedActions: "Condutas pendentes",
    safetyAlerts: "Alertas de seguranca",
    automaticSoap: "SOAP automatico",
    noOmitted: "nenhuma pergunta critica omitida",
    noMissed: "condutas essenciais selecionadas",
    noUnsafe: "nenhuma conduta insegura marcada",
    allSteps: "todas as etapas foram abordadas",
    noStep: "nenhuma etapa identificada",
    insufficientSubjective: "Dados subjetivos insuficientes.",
    objectiveSoap: "Exame clinico orientado pelas informacoes coletadas durante a anamnese simulada.",
    langCode: "pt-BR"
  },
  en: {
    tagline: "Intelligent dental anamnesis simulator",
    language: "Language",
    student: "Student",
    studentName: "Student name",
    studentId: "Registration number",
    studentCollege: "College",
    clinicalCase: "Clinical case",
    selectCase: "Select clinical case",
    chart: "Chart",
    progress: "Progress",
    physicalExam: "Physical exam",
    physicalExamLocked: "The physical exam will unlock after the HPI covers when, where, how, and why, plus at least 2 questions in the other stages and most essential data obtained.",
    physicalExamUnlocked: "Physical clinical exam details unlocked",
    physicalExamUnavailable: "Detailed physical exam is not registered for this case.",
    stageLocked: "Stage recorded outside the expected sequence.",
    virtualOffice: "3D virtual office",
    patient: "Patient",
    patientVoice: "Patient voice",
    askQuestion: "Ask the patient, for example: how long have you had the sore?",
    speakQuestion: "Speak question",
    send: "Send",
    anamnesisSequence: "Anamnesis sequence",
    diagnosticHypotheses: "Diagnostic hypotheses",
    examsConduct: "Exams and management",
    evaluation: "Evaluation",
    finishCare: "Finish appointment",
    years: "years old",
    difficulty: "Difficulty",
    calm: "Calm",
    anxious: "Anxious",
    pain: "Pain",
    neutral: "Neutral",
    done: "done",
    pending: "pending",
    stageRed: "0/3",
    stageYellow: "in progress",
    stageGreen: "complete",
    outOfOrder: "out of order",
    currentStage: "current stage",
    questionsShort: "q.",
    dataShort: "data",
    noStageData: "no critical data in this stage",
    anamnesisLink: "Anamnesis",
    registeredInStage: "recorded in",
    alreadyRegisteredInStage: "already recorded in",
    questionCountedInStage: "question recorded in",
    sequenceAlerts: "Sequence alerts",
    noSequenceAlerts: "sequence conducted without relevant jumps",
    chiefComplaint: "Chief complaint",
    profile: "Profile",
    base: "Source",
    objective: "Objective",
    baseText: "clinical script extracted from the imported Word file.",
    objectiveText: "follow this sequence: HPI, family, medical, dental history, and habits/dependencies; in HPI, value when, where, how, and why.",
    studentMissing: "not registered",
    notInformed: "not informed",
    collegeMissing: "not informed",
    complaint: "Complaint",
    expectedScript: "Expected script: history of present illness, family history, medical history, dental history, and habits/dependencies. In HPI, investigate when, where, how, and why; broad or specific questions reveal chart data.",
    unavailableRecognition: "Speech recognition is unavailable in this browser.",
    unavailableMic: "Voice microphone is unavailable in this browser.",
    listening: "Listening to the clinician's question...",
    micReady: "Microphone ready for a new question.",
    micError: "I could not capture the audio. Please try again.",
    micAvailable: "Microphone available in Chrome/Edge.",
    score: "Score",
    diagnosis: "Diagnosis",
    diagnosisHit: "main hypothesis correct",
    diagnosisMiss: "main hypothesis not selected",
    expectedDiagnosis: "Expected diagnosis",
    sequence: "Anamnesis sequence",
    observedOrder: "Observed order",
    gaps: "Gaps",
    omittedQuestions: "Omitted questions",
    missedActions: "Pending management",
    safetyAlerts: "Safety alerts",
    automaticSoap: "Automatic SOAP",
    noOmitted: "no critical question omitted",
    noMissed: "essential management selected",
    noUnsafe: "no unsafe management selected",
    allSteps: "all steps were addressed",
    noStep: "no step identified",
    insufficientSubjective: "Insufficient subjective data.",
    objectiveSoap: "Clinical exam guided by the information collected during the simulated anamnesis.",
    langCode: "en-US"
  },
  es: {
    tagline: "Simulador inteligente de anamnesis odontológica",
    language: "Idioma",
    student: "Estudiante",
    studentName: "Nombre del estudiante",
    studentId: "Matrícula",
    studentCollege: "Facultad",
    clinicalCase: "Caso clínico",
    selectCase: "Seleccionar caso clínico",
    chart: "Historia clínica",
    progress: "Progreso",
    physicalExam: "Examen físico",
    physicalExamLocked: "El examen físico se liberará después de cubrir la enfermedad actual con cuándo, dónde, cómo y por qué, además de al menos 2 preguntas en las demás etapas y la mayoría de los datos esenciales obtenidos.",
    physicalExamUnlocked: "Detalles del examen clínico físico liberados",
    physicalExamUnavailable: "Examen físico detallado no registrado para este caso.",
    stageLocked: "Etapa registrada fuera de la secuencia esperada.",
    virtualOffice: "Consultorio virtual 3D",
    patient: "Paciente",
    patientVoice: "Voz del paciente",
    askQuestion: "Pregunte al paciente, por ejemplo: ¿desde cuándo tiene la lesión?",
    speakQuestion: "Hablar pregunta",
    send: "Enviar",
    anamnesisSequence: "Secuencia de anamnesis",
    diagnosticHypotheses: "Hipótesis diagnósticas",
    examsConduct: "Exámenes y conducta",
    evaluation: "Evaluación",
    finishCare: "Finalizar atención",
    years: "años",
    difficulty: "Dificultad",
    calm: "Tranquilo",
    anxious: "Ansioso",
    pain: "Dolor",
    neutral: "Neutro",
    done: "hecho",
    pending: "pendiente",
    stageRed: "0/3",
    stageYellow: "en progreso",
    stageGreen: "completo",
    outOfOrder: "fuera de orden",
    currentStage: "etapa actual",
    questionsShort: "preg.",
    dataShort: "datos",
    noStageData: "sin datos críticos en esta etapa",
    anamnesisLink: "Anamnesis",
    registeredInStage: "registrado en",
    alreadyRegisteredInStage: "ya constaba en",
    questionCountedInStage: "pregunta registrada en",
    sequenceAlerts: "Alertas de secuencia",
    noSequenceAlerts: "secuencia conducida sin saltos relevantes",
    chiefComplaint: "Motivo de consulta",
    profile: "Perfil",
    base: "Base",
    objective: "Objetivo",
    baseText: "guion clínico extraído del archivo Word importado.",
    objectiveText: "siga la secuencia: enfermedad actual, historia familiar, médica, odontológica y hábitos/dependencias; en enfermedad actual, valore cuándo, dónde, cómo y por qué.",
    studentMissing: "no registrado",
    notInformed: "no informado",
    collegeMissing: "no informada",
    complaint: "Queja",
    expectedScript: "Guion esperado: enfermedad actual, historia familiar, historia médica, historia odontológica y hábitos/dependencias. En enfermedad actual, investigue cuándo, dónde, cómo y por qué; las preguntas amplias o específicas revelan datos de la historia clínica.",
    unavailableRecognition: "El reconocimiento de voz no está disponible en este navegador.",
    unavailableMic: "El micrófono por voz no está disponible en este navegador.",
    listening: "Escuchando la pregunta del profesional...",
    micReady: "Micrófono listo para una nueva pregunta.",
    micError: "No pude captar el audio. Inténtelo nuevamente.",
    micAvailable: "Micrófono disponible en Chrome/Edge.",
    score: "Nota",
    diagnosis: "Diagnóstico",
    diagnosisHit: "hipótesis principal correcta",
    diagnosisMiss: "hipótesis principal no seleccionada",
    expectedDiagnosis: "Diagnóstico esperado",
    sequence: "Secuencia de anamnesis",
    observedOrder: "Orden observado",
    gaps: "Pendientes",
    omittedQuestions: "Preguntas omitidas",
    missedActions: "Conductas pendientes",
    safetyAlerts: "Alertas de seguridad",
    automaticSoap: "SOAP automático",
    noOmitted: "ninguna pregunta crítica omitida",
    noMissed: "conductas esenciales seleccionadas",
    noUnsafe: "ninguna conducta insegura marcada",
    allSteps: "todas las etapas fueron abordadas",
    noStep: "ninguna etapa identificada",
    insufficientSubjective: "Datos subjetivos insuficientes.",
    objectiveSoap: "Examen clínico orientado por la información recolectada durante la anamnesis simulada.",
    langCode: "es-ES"
  }
};

const ANAMNESIS_FLOW = [
  {
    id: "currentIllness",
    label: "História da doença atual",
    keywords: ["historia da doenca", "historia da lesao", "historia do problema", "doenca atual", "problema atual", "queixa atual", "hda", "evolucao", "comecou", "tempo", "dor", "sintoma", "lesao", "ferida", "mancha", "caroco"]
  },
  {
    id: "familyHistory",
    label: "História familiar",
    keywords: ["familia", "familiar", "pai", "mae", "irmao", "irma", "parentes", "hereditario"]
  },
  {
    id: "medicalHistory",
    label: "História médica",
    keywords: ["historia medica", "saude", "doenca", "diabetes", "pressao", "remedio", "medicamento", "alergia"]
  },
  {
    id: "dentalHistory",
    label: "História odontológica",
    keywords: ["historia odontologica", "dentista", "protese", "canal", "extracao", "restauracao", "tratamento odontologico"]
  },
  {
    id: "habits",
    label: "Hábitos e dependências",
    keywords: ["habito", "fuma", "cigarro", "alcool", "bebida", "dieta", "trabalho", "sono", "estresse", "dependencia"]
  }
];

const FLOW_TRANSLATIONS = {
  currentIllness: {
    pt: "História da doença atual",
    en: "History of present illness",
    es: "Historia de la enfermedad actual"
  },
  familyHistory: {
    pt: "História familiar",
    en: "Family history",
    es: "Historia familiar"
  },
  medicalHistory: {
    pt: "História médica",
    en: "Medical history",
    es: "Historia médica"
  },
  dentalHistory: {
    pt: "História odontológica",
    en: "Dental history",
    es: "Historia odontológica"
  },
  habits: {
    pt: "Hábitos e dependências",
    en: "Habits and dependencies",
    es: "Hábitos y dependencias"
  }
};

const FLOW_KEYWORDS = {
  en: {
    currentIllness: ["history of present illness", "history of the lesion", "history of the problem", "hpi", "current illness", "current problem", "chief complaint", "evolution", "started", "time", "pain", "symptom", "lesion", "sore", "spot", "lump"],
    familyHistory: ["family", "father", "mother", "brother", "sister", "relatives", "hereditary"],
    medicalHistory: ["medical history", "health", "disease", "diabetes", "pressure", "medicine", "medication", "allergy"],
    dentalHistory: ["dental history", "dentist", "prosthesis", "root canal", "extraction", "restoration", "dental treatment"],
    habits: ["habit", "smoke", "cigarette", "alcohol", "drink", "diet", "work", "sleep", "stress", "dependency"]
  },
  es: {
    currentIllness: ["enfermedad actual", "historia de la lesion", "historia del problema", "problema actual", "motivo actual", "evolucion", "empezo", "tiempo", "dolor", "sintoma", "lesion", "herida", "mancha", "bulto"],
    familyHistory: ["familia", "familiar", "padre", "madre", "hermano", "hermana", "parientes", "hereditario"],
    medicalHistory: ["historia medica", "salud", "enfermedad", "diabetes", "presion", "remedio", "medicamento", "alergia"],
    dentalHistory: ["historia odontologica", "dentista", "protesis", "conducto", "extraccion", "restauracion", "tratamiento dental"],
    habits: ["habito", "fuma", "cigarrillo", "alcohol", "bebida", "dieta", "trabajo", "sueno", "estres", "dependencia"]
  }
};

const MIN_STRUCTURED_QUESTIONS_PER_STAGE = 2;
const HDA_REQUIRED_AXES = ["when", "where", "how", "why"];
const HDA_AXIS_LABELS = {
  when: { pt: "quando", en: "when", es: "cuándo" },
  where: { pt: "onde", en: "where", es: "dónde" },
  how: { pt: "como", en: "how", es: "cómo" },
  why: { pt: "por quê", en: "why", es: "por qué" }
};
const HDA_AXIS_BY_INTENT = {
  duration: "when",
  location: "where",
  appearance: "how",
  growth: "how",
  migration: "how",
  frequency: "how",
  pain: "how",
  symptoms: "how",
  bleeding: "how",
  odor: "how",
  feeding: "how",
  scraping: "how",
  ulcer: "how",
  trauma: "why",
  triggerEvent: "why",
  prosthesis: "why",
  stress: "why",
  sun: "why",
  medications: "why",
  treatmentHistory: "why",
  previousTreatment: "why"
};
const HDA_AXIS_INTENT_PREFERENCES = {
  when: ["duration", "frequency"],
  where: ["location"],
  how: ["appearance", "growth", "symptoms", "pain", "migration", "feeding", "bleeding", "odor", "scraping", "ulcer"],
  why: ["trauma", "prosthesis", "stress", "sun", "medications", "treatmentHistory"]
};

const CLINICAL_TERMS = {
  en: {
    "carcinoma espinocelular": "squamous cell carcinoma",
    "carcinoma espinocelular de labio": "squamous cell carcinoma of the lip",
    "leucoplasia oral": "oral leukoplakia",
    "candidiase oral associada a protese": "denture-associated oral candidiasis",
    "liquen plano oral erosivo": "erosive oral lichen planus",
    "estomatite aftosa recorrente menor": "minor recurrent aphthous stomatitis",
    "mucocele": "mucocele",
    "gengivoestomatite herpetica primaria": "primary herpetic gingivostomatitis",
    "penfigo vulgar": "pemphigus vulgaris",
    "gengivite ulcerativa necrosante": "necrotizing ulcerative gingivitis",
    "lingua geografica": "geographic tongue",
    "queilite actinica": "actinic cheilitis",
    "masculino": "male",
    "feminino": "female",
    "baixa": "low",
    "media": "medium",
    "alta": "high",
    "Historia da doenca atual": "History of present illness",
    "Sintomas": "Symptoms",
    "Habitos": "Habits",
    "Historia medica": "Medical history",
    "Historia odontologica": "Dental history",
    "Historia familiar": "Family history",
    "Caracteristicas da lesao": "Lesion characteristics",
    "Sinais de alerta": "Warning signs",
    "Exame fisico": "Physical examination",
    "Fatores locais": "Local factors",
    "Historia epidemiologica": "Epidemiological history",
    "Duracao": "Duration",
    "Dor": "Pain",
    "Ardencia": "Burning sensation",
    "Aspecto": "Appearance",
    "Tabagismo": "Smoking",
    "Alcool": "Alcohol",
    "Perda de peso": "Weight loss",
    "Linfonodos": "Lymph nodes",
    "Historia medica geral": "General medical history",
    "Historia odontologica": "Dental history",
    "Historia familiar": "Family history",
    "Exame intraoral completo": "complete intraoral examination"
    ,
    "exame intraoral completo": "complete intraoral examination",
    "palpacao de linfonodos cervicais": "cervical lymph node palpation",
    "biopsia incisional": "incisional biopsy",
    "encaminhamento para estomatologia": "referral to oral medicine",
    "prescricao de antibiotico sem investigacao": "antibiotic prescription without investigation",
    "antibiotico sem investigacao": "antibiotic without investigation",
    "antibiotico sem sinais de infeccao": "antibiotic without signs of infection",
    "antibiotico sem sinal bacteriano": "antibiotic without bacterial signs",
    "antifungico topico": "topical antifungal",
    "antifungico sem exame clinico": "antifungal without clinical exam",
    "testar raspagem da placa": "test whether the plaque can be scraped off",
    "remocao de fatores irritativos": "removal of irritative factors",
    "biopsia se persistente ou heterogenea": "biopsy if persistent or heterogeneous",
    "orientacao para cessar tabagismo": "smoking cessation counseling",
    "remover protese para exame": "remove denture for examination",
    "orientar higiene da protese": "denture hygiene guidance",
    "avaliar ajuste da protese": "evaluate denture fit",
    "investigar diabetes ou imunossupressao": "investigate diabetes or immunosuppression",
    "clareamento dental": "tooth whitening",
    "excisao cirurgica se persistente": "surgical excision if persistent",
    "investigar trauma por mordida": "investigate biting trauma",
    "orientar evitar manipulacao": "advise avoiding manipulation",
    "avaliar hidratacao": "assess hydration",
    "controle de dor e febre": "pain and fever control",
    "orientar alimentacao fria e liquida": "recommend cold liquid diet",
    "evitar procedimentos eletivos": "avoid elective procedures",
    "avaliar sinal de Nikolsky": "assess Nikolsky sign",
    "investigar lesoes cutaneas": "investigate skin lesions",
    "revisar medicamentos": "review medications",
    "biopsia perilesional com imunofluorescencia": "perilesional biopsy with immunofluorescence",
    "avaliar papilas necrosadas": "assess necrotic papillae",
    "desbridamento suave e controle de placa": "gentle debridement and plaque control",
    "orientar higiene oral": "oral hygiene guidance",
    "investigar imunossupressao": "investigate immunosuppression",
    "analgesia e acompanhamento curto": "analgesia and short follow-up",
    "reconhecer padrao migratorio": "recognize migratory pattern",
    "investigar sintomas e gatilhos": "investigate symptoms and triggers",
    "tranquilizar sobre benignidade": "reassure about benign nature",
    "orientar evitar irritantes se sintomatica": "advise avoiding irritants if symptomatic",
    "acompanhar se houver mudanca atipica": "follow up if atypical change occurs",
    "investigar exposicao solar ocupacional": "investigate occupational sun exposure",
    "avaliar apagamento do limite vermelhao-cutaneo": "assess blurring of the vermilion-skin border",
    "orientar fotoprotecao labial": "recommend lip photoprotection",
    "biopsia em area ulcerada ou endurecida": "biopsy ulcerated or indurated area",
    "acompanhamento por potencial maligno": "follow-up due to malignant potential",
    "ulcera traumatica": "traumatic ulcer",
    "candidiase cronica": "chronic candidiasis",
    "candidiase oral": "oral candidiasis",
    "candidiase pseudomembranosa": "pseudomembranous candidiasis",
    "candidiase eritematosa": "erythematous candidiasis",
    "queimadura termica": "thermal burn",
    "queimadura quimica": "chemical burn",
    "queratose friccional": "frictional keratosis",
    "fibroma traumatico": "traumatic fibroma",
    "hemangioma": "hemangioma",
    "abscesso periodontal": "periodontal abscess",
    "abscesso odontogenico": "odontogenic abscess",
    "herpangina": "herpangina",
    "doenca mao-pe-boca": "hand-foot-and-mouth disease",
    "penfigoide das membranas mucosas": "mucous membrane pemphigoid",
    "eritema multiforme": "erythema multiforme",
    "periodontite agressiva": "aggressive periodontitis",
    "leucemia aguda": "acute leukemia",
    "deficiencia de vitamina B12": "vitamin B12 deficiency",
    "deficiencia de ferro ou vitamina B12": "iron or vitamin B12 deficiency",
    "deficiencia nutricional": "nutritional deficiency",
    "eritroplasia": "erythroplakia",
    "queilite irritativa": "irritant cheilitis",
    "herpes labial recorrente": "recurrent herpes labialis",
    "herpes recorrente intraoral": "recurrent intraoral herpes",
    "lupus eritematoso oral": "oral lupus erythematosus",
    "reacao liquenoide a medicamento": "lichenoid drug reaction",
    "doenca de Behcet": "Behcet disease",
    "neutropenia ciclica": "cyclic neutropenia",
    "sialolitiase": "sialolithiasis",
    "ranula": "ranula",
    "cisto linfoepitelial": "lymphoepithelial cyst",
    "dermatite de contato": "contact dermatitis",
    "estomatite aftosa maior": "major aphthous stomatitis",
    "estomatite protetica bacteriana": "bacterial denture stomatitis",
    "estomatite protetica traumatica": "traumatic denture stomatitis",
    "herpes simples recorrente": "recurrent herpes simplex",
    "leucemia com manifestacao gengival": "leukemia with gingival manifestation",
    "leucoplasia": "leukoplakia",
    "liquen plano": "lichen planus",
    "liquen plano erosivo": "erosive lichen planus",
    "liquen plano oral": "oral lichen planus",
    "liquen plano reticular": "reticular lichen planus",
    "nevo branco esponjoso": "white sponge nevus",
    "papiloma escamoso": "squamous papilloma",
    "pericoronarite": "pericoronitis",
    "queilite angular": "angular cheilitis",
    "reacao liquenoide medicamentosa": "lichenoid drug reaction",
    "ferida": "sore",
    "lesao": "lesion",
    "lesoes": "lesions",
    "boca": "mouth",
    "lingua": "tongue",
    "labio": "lip",
    "labio inferior": "lower lip",
    "gengiva": "gum",
    "palato": "palate",
    "ceu da boca": "palate",
    "bochecha": "cheek",
    "assoalho da boca": "floor of the mouth",
    "mancha branca": "white patch",
    "manchas vermelhas": "red patches",
    "bolinha": "small lump",
    "bolhas": "blisters",
    "ulceras": "ulcers",
    "ulcera": "ulcer",
    "ardencia": "burning sensation",
    "dor": "pain",
    "sangramento": "bleeding",
    "sangrando": "bleeding",
    "mau halito": "bad breath",
    "febre": "fever",
    "protese": "denture",
    "dentadura": "denture",
    "fuma": "smokes",
    "cigarro": "cigarette",
    "alcool": "alcohol",
    "sol": "sun",
    "ressecado": "dry",
    "rachado": "cracked",
    "esbranquicado": "whitish",
    "nao cicatriza": "does not heal",
    "que nao cicatriza": "that does not heal",
    "que aumentou": "that grew",
    "que voltam": "that recur",
    "que mudam de lugar": "that change location",
    "ha anos": "for years",
    "todo mes": "every month"
    ,
    "crescimento": "growth",
    "ultimas semanas": "recent weeks",
    "piora rapida": "rapid worsening",
    "sem regressao": "without regression",
    "oscilacao de tamanho": "size fluctuation",
    "episodios intermitentes": "intermittent episodes",
    "crises de piora": "flare-ups",
    "episodios mensais": "monthly episodes",
    "semanas de prova": "exam weeks",
    "controle irregular": "irregular control",
    "uso recente": "recent use",
    "ha 1 mes": "one month ago",
    "ha 25 anos": "for 25 years",
    "ha 35 anos": "for 35 years",
    "ha decadas": "for decades",
    "por 40 anos": "for 40 years",
    "parou ha 3 anos": "stopped 3 years ago",
    "fins de semana": "weekends",
    "diario": "daily",
    "diaria": "daily",
    "pescador": "fisherman",
    "sem protetor labial": "without lip sunscreen",
    "feridas labiais recentes": "recent lip sores",
    "febre ate": "fever up to",
    "perdeu": "lost",
    "reducao da alimentacao": "reduced food intake",
    "nega": "denies",
    "sem": "without",
    "com": "with",
    "ha": "for",
    "meses": "months",
    "semanas": "weeks",
    "dias": "days",
    "anos": "years",
    "recorrente": "recurrent",
    "persistente": "persistent",
    "difuso": "diffuse",
    "bilaterais": "bilateral",
    "bilateral": "bilateral",
    "endurecido": "indurated",
    "ulcerada": "ulcerated",
    "vermelha": "red",
    "vermelho": "red",
    "branca": "white",
    "branco": "white",
    "azulada": "bluish",
    "mole": "soft",
    "dolorosas": "painful",
    "dolorosa": "painful",
    "indolor": "painless",
    "moderada": "moderate",
    "leve": "mild",
    "intensa": "severe",
    "dificuldade": "difficulty",
    "mastigar": "chewing",
    "alimentacao": "eating",
    "alimentos acidos": "acidic foods",
    "pimenta": "spicy food",
    "diabetes": "diabetes",
    "hipertensao": "hypertension",
    "controlada": "controlled",
    "losartana": "losartan",
    "metformina": "metformin",
    "antibiotico": "antibiotic",
    "rinite alergica": "allergic rhinitis",
    "estresse": "stress",
    "sono": "sleep",
    "familia": "family",
    "cancer de boca": "oral cancer",
    "cancer bucal": "oral cancer",
    "cancer de pele": "skin cancer",
    "doenca bolhosa": "blistering disease",
    "doencas hematologicas": "hematologic diseases",
    "imunodeficiencia": "immunodeficiency",
    "imunossupressao": "immunosuppression",
    "restauracao fraturada": "fractured restoration",
    "acompanhamento odontologico regular": "regular dental follow-up",
    "higiene irregular": "irregular hygiene",
    "protese superior": "upper denture",
    "protese inferior": "lower denture"
  },
  es: {
    "carcinoma espinocelular": "carcinoma espinocelular",
    "carcinoma espinocelular de labio": "carcinoma espinocelular de labio",
    "leucoplasia oral": "leucoplasia oral",
    "candidiase oral associada a protese": "candidiasis oral asociada a prótesis",
    "liquen plano oral erosivo": "liquen plano oral erosivo",
    "estomatite aftosa recorrente menor": "estomatitis aftosa recurrente menor",
    "mucocele": "mucocele",
    "gengivoestomatite herpetica primaria": "gingivoestomatitis herpética primaria",
    "penfigo vulgar": "pénfigo vulgar",
    "gengivite ulcerativa necrosante": "gingivitis ulcerativa necrosante",
    "lingua geografica": "lengua geográfica",
    "queilite actinica": "queilitis actínica",
    "masculino": "masculino",
    "feminino": "femenino",
    "baixa": "baja",
    "media": "media",
    "alta": "alta",
    "Historia da doenca atual": "Historia de la enfermedad actual",
    "Sintomas": "Síntomas",
    "Habitos": "Hábitos",
    "Historia medica": "Historia médica",
    "Historia odontologica": "Historia odontológica",
    "Historia familiar": "Historia familiar",
    "Caracteristicas da lesao": "Características de la lesión",
    "Sinais de alerta": "Signos de alerta",
    "Exame fisico": "Examen físico",
    "Fatores locais": "Factores locales",
    "Historia epidemiologica": "Historia epidemiológica",
    "Duracao": "Duración",
    "Dor": "Dolor",
    "Ardencia": "Ardor",
    "Aspecto": "Aspecto",
    "Tabagismo": "Tabaquismo",
    "Alcool": "Alcohol",
    "Perda de peso": "Pérdida de peso",
    "Linfonodos": "Ganglios linfáticos",
    "Historia medica geral": "Historia médica general",
    "Historia odontologica": "Historia odontológica",
    "Historia familiar": "Historia familiar",
    "Exame intraoral completo": "examen intraoral completo",
    "exame intraoral completo": "examen intraoral completo",
    "palpacao de linfonodos cervicais": "palpacion de ganglios cervicales",
    "biopsia incisional": "biopsia incisional",
    "encaminhamento para estomatologia": "derivacion a estomatologia",
    "prescricao de antibiotico sem investigacao": "prescripcion de antibiotico sin investigacion",
    "antibiotico sem investigacao": "antibiotico sin investigacion",
    "antibiotico sem sinais de infeccao": "antibiotico sin signos de infeccion",
    "antibiotico sem sinal bacteriano": "antibiotico sin signos bacterianos",
    "antifungico topico": "antifungico topico",
    "antifungico sem exame clinico": "antifungico sin examen clinico",
    "testar raspagem da placa": "probar si la placa se desprende por raspado",
    "remocao de fatores irritativos": "remocion de factores irritativos",
    "biopsia se persistente ou heterogenea": "biopsia si es persistente o heterogenea",
    "orientacao para cessar tabagismo": "orientacion para cesar el tabaquismo",
    "remover protese para exame": "retirar la protesis para examen",
    "orientar higiene da protese": "orientar higiene de la protesis",
    "avaliar ajuste da protese": "evaluar ajuste de la protesis",
    "investigar diabetes ou imunossupressao": "investigar diabetes o inmunosupresion",
    "clareamento dental": "blanqueamiento dental",
    "excisao cirurgica se persistente": "excision quirurgica si persiste",
    "investigar trauma por mordida": "investigar trauma por mordedura",
    "orientar evitar manipulacao": "orientar evitar manipulacion",
    "avaliar hidratacao": "evaluar hidratacion",
    "controle de dor e febre": "control de dolor y fiebre",
    "orientar alimentacao fria e liquida": "orientar dieta fria y liquida",
    "evitar procedimentos eletivos": "evitar procedimientos electivos",
    "avaliar sinal de Nikolsky": "evaluar signo de Nikolsky",
    "investigar lesoes cutaneas": "investigar lesiones cutaneas",
    "revisar medicamentos": "revisar medicamentos",
    "biopsia perilesional com imunofluorescencia": "biopsia perilesional con inmunofluorescencia",
    "avaliar papilas necrosadas": "evaluar papilas necrosadas",
    "desbridamento suave e controle de placa": "desbridamiento suave y control de placa",
    "orientar higiene oral": "orientar higiene oral",
    "investigar imunossupressao": "investigar inmunosupresion",
    "analgesia e acompanhamento curto": "analgesia y seguimiento corto",
    "reconhecer padrao migratorio": "reconocer patron migratorio",
    "investigar sintomas e gatilhos": "investigar sintomas y desencadenantes",
    "tranquilizar sobre benignidade": "tranquilizar sobre benignidad",
    "orientar evitar irritantes se sintomatica": "orientar evitar irritantes si es sintomatica",
    "acompanhar se houver mudanca atipica": "hacer seguimiento si hay cambio atipico",
    "investigar exposicao solar ocupacional": "investigar exposicion solar ocupacional",
    "avaliar apagamento do limite vermelhao-cutaneo": "evaluar borramiento del limite bermellon-cutaneo",
    "orientar fotoprotecao labial": "orientar fotoproteccion labial",
    "biopsia em area ulcerada ou endurecida": "biopsia en area ulcerada o endurecida",
    "acompanhamento por potencial maligno": "seguimiento por potencial maligno",
    "ulcera traumatica": "ulcera traumatica",
    "candidiase cronica": "candidiasis cronica",
    "candidiase oral": "candidiasis oral",
    "candidiase pseudomembranosa": "candidiasis pseudomembranosa",
    "candidiase eritematosa": "candidiasis eritematosa",
    "queimadura termica": "quemadura termica",
    "queimadura quimica": "quemadura quimica",
    "queratose friccional": "queratosis friccional",
    "fibroma traumatico": "fibroma traumatico",
    "hemangioma": "hemangioma",
    "abscesso periodontal": "absceso periodontal",
    "abscesso odontogenico": "absceso odontogenico",
    "herpangina": "herpangina",
    "doenca mao-pe-boca": "enfermedad mano-pie-boca",
    "penfigoide das membranas mucosas": "penfigoide de membranas mucosas",
    "eritema multiforme": "eritema multiforme",
    "periodontite agressiva": "periodontitis agresiva",
    "leucemia aguda": "leucemia aguda",
    "deficiencia de vitamina B12": "deficiencia de vitamina B12",
    "deficiencia de ferro ou vitamina B12": "deficiencia de hierro o vitamina B12",
    "deficiencia nutricional": "deficiencia nutricional",
    "eritroplasia": "eritroplasia",
    "queilite irritativa": "queilitis irritativa",
    "herpes labial recorrente": "herpes labial recurrente",
    "herpes recorrente intraoral": "herpes recurrente intraoral",
    "lupus eritematoso oral": "lupus eritematoso oral",
    "reacao liquenoide a medicamento": "reaccion liquenoide a medicamento",
    "doenca de Behcet": "enfermedad de Behcet",
    "neutropenia ciclica": "neutropenia ciclica",
    "sialolitiase": "sialolitiasis",
    "ranula": "ranula",
    "cisto linfoepitelial": "quiste linfoepitelial",
    "dermatite de contato": "dermatitis de contacto",
    "estomatite aftosa maior": "estomatitis aftosa mayor",
    "estomatite protetica bacteriana": "estomatitis protésica bacteriana",
    "estomatite protetica traumatica": "estomatitis protésica traumática",
    "herpes simples recorrente": "herpes simple recurrente",
    "leucemia com manifestacao gengival": "leucemia con manifestación gingival",
    "leucoplasia": "leucoplasia",
    "liquen plano": "liquen plano",
    "liquen plano erosivo": "liquen plano erosivo",
    "liquen plano oral": "liquen plano oral",
    "liquen plano reticular": "liquen plano reticular",
    "nevo branco esponjoso": "nevo blanco esponjoso",
    "papiloma escamoso": "papiloma escamoso",
    "pericoronarite": "pericoronitis",
    "queilite angular": "queilitis angular",
    "reacao liquenoide medicamentosa": "reacción liquenoide medicamentosa",
    "ferida": "herida",
    "lesao": "lesion",
    "lesoes": "lesiones",
    "boca": "boca",
    "lingua": "lengua",
    "labio": "labio",
    "labio inferior": "labio inferior",
    "gengiva": "encia",
    "palato": "paladar",
    "ceu da boca": "paladar",
    "bochecha": "mejilla",
    "assoalho da boca": "piso de la boca",
    "mancha branca": "mancha blanca",
    "manchas vermelhas": "manchas rojas",
    "bolinha": "pequeno bulto",
    "bolhas": "ampollas",
    "ulceras": "ulceras",
    "ulcera": "ulcera",
    "ardencia": "ardor",
    "dor": "dolor",
    "sangramento": "sangrado",
    "sangrando": "sangrando",
    "mau halito": "mal aliento",
    "febre": "fiebre",
    "protese": "protesis",
    "dentadura": "dentadura",
    "fuma": "fuma",
    "cigarro": "cigarrillo",
    "alcool": "alcohol",
    "sol": "sol",
    "ressecado": "reseco",
    "rachado": "agrietado",
    "esbranquicado": "blanquecino",
    "nao cicatriza": "no cicatriza",
    "que nao cicatriza": "que no cicatriza",
    "que aumentou": "que aumento",
    "que voltam": "que vuelven",
    "que mudam de lugar": "que cambian de lugar",
    "ha anos": "hace anos",
    "todo mes": "todos los meses"
    ,
    "crescimento": "crecimiento",
    "ultimas semanas": "ultimas semanas",
    "piora rapida": "empeoramiento rapido",
    "sem regressao": "sin regresion",
    "oscilacao de tamanho": "oscilacion de tamano",
    "episodios intermitentes": "episodios intermitentes",
    "crises de piora": "crisis de empeoramiento",
    "episodios mensais": "episodios mensuales",
    "semanas de prova": "semanas de examenes",
    "controle irregular": "control irregular",
    "uso recente": "uso reciente",
    "ha 1 mes": "hace 1 mes",
    "ha 25 anos": "desde hace 25 anos",
    "ha 35 anos": "desde hace 35 anos",
    "ha decadas": "desde hace decadas",
    "por 40 anos": "durante 40 anos",
    "parou ha 3 anos": "dejo hace 3 anos",
    "fins de semana": "fines de semana",
    "diario": "diario",
    "diaria": "diaria",
    "pescador": "pescador",
    "sem protetor labial": "sin protector labial",
    "feridas labiais recentes": "heridas labiales recientes",
    "febre ate": "fiebre hasta",
    "perdeu": "perdio",
    "reducao da alimentacao": "reduccion de la alimentacion",
    "nega": "niega",
    "sem": "sin",
    "com": "con",
    "ha": "hace",
    "meses": "meses",
    "semanas": "semanas",
    "dias": "dias",
    "anos": "anos",
    "recorrente": "recurrente",
    "persistente": "persistente",
    "difuso": "difuso",
    "bilaterais": "bilaterales",
    "bilateral": "bilateral",
    "endurecido": "endurecido",
    "ulcerada": "ulcerada",
    "vermelha": "roja",
    "vermelho": "rojo",
    "branca": "blanca",
    "branco": "blanco",
    "azulada": "azulada",
    "mole": "blanda",
    "dolorosas": "dolorosas",
    "dolorosa": "dolorosa",
    "indolor": "indolora",
    "moderada": "moderada",
    "leve": "leve",
    "intensa": "intensa",
    "dificuldade": "dificultad",
    "mastigar": "masticar",
    "alimentacao": "alimentacion",
    "alimentos acidos": "alimentos acidos",
    "pimenta": "picante",
    "diabetes": "diabetes",
    "hipertensao": "hipertension",
    "controlada": "controlada",
    "losartana": "losartan",
    "metformina": "metformina",
    "antibiotico": "antibiotico",
    "rinite alergica": "rinitis alergica",
    "estresse": "estres",
    "sono": "sueno",
    "familia": "familia",
    "cancer de boca": "cancer oral",
    "cancer bucal": "cancer oral",
    "cancer de pele": "cancer de piel",
    "doenca bolhosa": "enfermedad ampollosa",
    "doencas hematologicas": "enfermedades hematologicas",
    "imunodeficiencia": "inmunodeficiencia",
    "imunossupressao": "inmunosupresion",
    "restauracao fraturada": "restauracion fracturada",
    "acompanhamento odontologico regular": "seguimiento odontologico regular",
    "higiene irregular": "higiene irregular",
    "protese superior": "protesis superior",
    "protese inferior": "protesis inferior"
  }
};

const EXACT_CLINICAL_TEXT = {
  en: {
    "aftas dolorosas recorrentes": "recurrent painful canker sores",
    "aftas pequenas que voltam todo mes": "small canker sores that return every month",
    "ardencia bilateral na bochecha": "bilateral burning sensation in the cheeks",
    "ardencia nas bochechas com linhas brancas": "burning sensation in the cheeks with white lines",
    "ardencia no ceu da boca e placas brancas": "burning sensation on the palate and white plaques",
    "ardencia no ceu da boca embaixo da protese": "burning sensation on the palate under the denture",
    "bolhas na boca que viram feridas dolorosas": "blisters in the mouth that become painful sores",
    "bolhas que viram feridas dolorosas na boca": "blisters that become painful sores in the mouth",
    "bolinha azulada no labio inferior": "bluish small lump on the lower lip",
    "bolinha no labio inferior": "small lump on the lower lip",
    "caroco dolorido no assoalho da boca que aumentou": "painful lump on the floor of the mouth that has grown",
    "dor gengival intensa e mau halito": "intense gingival pain and bad breath",
    "ferida na lateral da lingua que nao cicatriza": "non-healing sore on the side of the tongue",
    "feridas na boca com febre": "mouth sores with fever",
    "feridinhas na boca com febre": "small mouth sores with fever",
    "gengiva sangrando com mau halito forte": "bleeding gums with strong bad breath",
    "labio inferior rachado e esbranquicado ha anos": "cracked whitish lower lip for years",
    "labio inferior ressecado e descamando": "dry peeling lower lip",
    "mancha branca na borda da lingua": "white patch on the border of the tongue",
    "mancha branca na mucosa jugal": "white patch on the buccal mucosa",
    "manchas que mudam de lugar na lingua": "patches on the tongue that change location",
    "manchas vermelhas na lingua que mudam de lugar": "red patches on the tongue that change location",
    "aciclovir sem suspeita de herpes": "acyclovir without suspicion of herpes",
    "acompanhamento periodico": "periodic follow-up",
    "acompanhamento por potencial maligno": "follow-up due to malignant potential",
    "acompanhar se houver mudanca atipica": "follow up if atypical change occurs",
    "acompanhar sem tratamento invasivo": "follow up without invasive treatment",
    "analgesia e acompanhamento curto": "analgesia and short follow-up",
    "antibiotico sem investigacao": "antibiotic without investigation",
    "antibiotico sem sinais de infeccao": "antibiotic without signs of infection",
    "antibiotico sem sinal bacteriano": "antibiotic without bacterial signs",
    "antibiotico sistemico": "systemic antibiotic",
    "antifungico sem exame clinico": "antifungal without clinical examination",
    "antifungico topico": "topical antifungal",
    "apenas ajuste oclusal e observacao prolongada": "only occlusal adjustment and prolonged observation",
    "avaliar ajuste da protese": "evaluate denture fit",
    "avaliar apagamento do limite vermelhao-cutaneo": "assess blurring of the vermilion-skin border",
    "avaliar deficiencias nutricionais se recorrente": "evaluate nutritional deficiencies if recurrent",
    "avaliar dor com alimentos acidos": "evaluate pain with acidic foods",
    "avaliar hidratacao": "assess hydration",
    "avaliar higiene e adaptacao da protese": "evaluate denture hygiene and adaptation",
    "avaliar historia de trauma ou mordiscamento": "evaluate history of trauma or biting",
    "avaliar localizacao em mucosa nao queratinizada": "evaluate location on non-keratinized mucosa",
    "avaliar padrao de recorrencia": "evaluate recurrence pattern",
    "avaliar papilas interdentais necrosadas": "evaluate necrotic interdental papillae",
    "avaliar papilas necrosadas": "evaluate necrotic papillae",
    "avaliar se a placa e removivel por raspagem": "evaluate whether the plaque can be removed by scraping",
    "avaliar sinal de Nikolsky": "evaluate Nikolsky sign",
    "biopsia com exame histopatologico": "biopsy with histopathological examination",
    "biopsia de rotina em toda crianca": "routine biopsy in every child",
    "biopsia em area ulcerada ou endurecida": "biopsy in ulcerated or indurated area",
    "biopsia imediata de toda afta pequena": "immediate biopsy of every small aphtha",
    "biopsia imediata sem criterio clinico": "immediate biopsy without clinical criteria",
    "biopsia imediata sem tentativa de remocao": "immediate biopsy without attempted removal",
    "biopsia incisional": "incisional biopsy",
    "biopsia perilesional com imunofluorescencia": "perilesional biopsy with immunofluorescence",
    "biopsia se apresentacao atipica": "biopsy if presentation is atypical",
    "biopsia se persistente ou heterogenea": "biopsy if persistent or heterogeneous",
    "biopsia se persistente ou nao removivel": "biopsy if persistent or non-removable",
    "bochecho alcoolico como unica conduta": "alcohol-based mouthwash as the only management",
    "clareamento dental": "tooth whitening",
    "clareamento dental como conduta inicial": "tooth whitening as initial management",
    "clareamento dental como prioridade": "tooth whitening as priority",
    "considerar antiviral se inicio recente e grave": "consider antiviral if recent onset and severe",
    "considerar antiviral se inicio recente e quadro importante": "consider antiviral if recent onset and significant presentation",
    "considerar corticoide topico": "consider topical corticosteroid",
    "controle de dor e febre": "control pain and fever",
    "corticoide topico quando indicado": "topical corticosteroid when indicated",
    "corticoide topico se indicado": "topical corticosteroid if indicated",
    "desbridamento cuidadoso e controle de placa": "careful debridement and plaque control",
    "desbridamento suave e controle de placa": "gentle debridement and plaque control",
    "encaminhamento para dermatologia/estomatologia": "referral to dermatology/oral medicine",
    "encaminhamento para estomatologia": "referral to oral medicine",
    "encaminhamento para estomatologia ou dermatologia": "referral to oral medicine or dermatology",
    "enviar material para histopatologico": "send specimen for histopathology",
    "evitar procedimentos eletivos": "avoid elective procedures",
    "exame intraoral completo": "complete intraoral examination",
    "examinar consistencia e cor da lesao": "examine lesion consistency and color",
    "examinar gengiva e mucosa oral": "examine gingiva and oral mucosa",
    "examinar padrao bilateral das lesoes": "examine bilateral pattern of lesions",
    "excisao cirurgica se persistente": "surgical excision if persistent",
    "extracao dentaria como primeira conduta": "tooth extraction as first management",
    "investigar bolhas e erosoes recorrentes": "investigate recurrent blisters and erosions",
    "investigar deficiencias nutricionais se frequente": "investigate nutritional deficiencies if frequent",
    "investigar diabetes e xerostomia": "investigate diabetes and xerostomia",
    "investigar diabetes ou imunossupressao": "investigate diabetes or immunosuppression",
    "investigar estresse, sono e imunossupressao": "investigate stress, sleep, and immunosuppression",
    "investigar exposicao solar ocupacional": "investigate occupational sun exposure",
    "investigar febre e inicio agudo": "investigate fever and acute onset",
    "investigar frequencia e duracao das ulceras": "investigate frequency and duration of ulcers",
    "investigar higiene oral e sangramento": "investigate oral hygiene and bleeding",
    "investigar imunossupressao": "investigate immunosuppression",
    "investigar lesoes cutaneas": "investigate skin lesions",
    "investigar medicamentos em uso": "investigate current medications",
    "investigar mudanca de localizacao das manchas": "investigate change in patch location",
    "investigar sinais sistemicos": "investigate systemic signs",
    "investigar sintomas e gatilhos": "investigate symptoms and triggers",
    "investigar sintomas sistemicos": "investigate systemic symptoms",
    "investigar tabagismo": "investigate smoking",
    "investigar trauma por mordida": "investigate biting trauma",
    "observacao em lesao pequena recente": "observation for a small recent lesion",
    "observacao por 60 dias como unica conduta": "60-day observation as the only management",
    "orientacao para cessar tabagismo": "smoking cessation counseling",
    "orientar alimentacao fria e liquida": "recommend cold liquid diet",
    "orientar analgesia e corticoide topico quando indicado": "recommend analgesia and topical corticosteroid when indicated",
    "orientar analgesia e suporte": "recommend analgesia and supportive care",
    "orientar controle de dor e higiene": "recommend pain control and hygiene",
    "orientar evitar irritantes quando sintomatica": "advise avoiding irritants when symptomatic",
    "orientar evitar irritantes se sintomatica": "advise avoiding irritants if symptomatic",
    "orientar evitar manipulacao": "advise avoiding manipulation",
    "orientar fotoprotecao labial": "recommend lip photoprotection",
    "orientar higiene da protese": "provide denture hygiene guidance",
    "orientar higiene e analgesia": "recommend hygiene and analgesia",
    "orientar higiene oral": "provide oral hygiene guidance",
    "orientar remocao cirurgica se persistente": "recommend surgical removal if persistent",
    "orientar remocao noturna da protese": "advise removing denture at night",
    "palpacao de linfonodos cervicais": "cervical lymph node palpation",
    "pomada antibiotica prolongada sem exame": "prolonged antibiotic ointment without examination",
    "prescrever antifungico quando indicado": "prescribe antifungal when indicated",
    "prescricao de antibiotico sem investigacao": "antibiotic prescription without investigation",
    "procedimento odontologico eletivo imediato": "immediate elective dental procedure",
    "raspagem periodontal como primeira conduta": "periodontal scaling as first management",
    "reconhecer padrao migratorio": "recognize migratory pattern",
    "remocao de fatores irritativos": "remove irritative factors",
    "remover protese para exame": "remove denture for examination",
    "revisar medicamentos": "review medications",
    "somente hidratante sem retorno": "moisturizer only without follow-up",
    "testar raspagem da placa": "test plaque removal by scraping",
    "teste de remocao das placas por raspagem": "test removal of plaques by scraping",
    "tranquilizar paciente e responsavel": "reassure patient and guardian",
    "tranquilizar sobre benignidade": "reassure about benign nature"
  },
  es: {
    "aftas dolorosas recorrentes": "aftas dolorosas recurrentes",
    "aftas pequenas que voltam todo mes": "aftas pequeñas que vuelven todos los meses",
    "ardencia bilateral na bochecha": "ardor bilateral en las mejillas",
    "ardencia nas bochechas com linhas brancas": "ardor en las mejillas con líneas blancas",
    "ardencia no ceu da boca e placas brancas": "ardor en el paladar y placas blancas",
    "ardencia no ceu da boca embaixo da protese": "ardor en el paladar debajo de la prótesis",
    "bolhas na boca que viram feridas dolorosas": "ampollas en la boca que se vuelven heridas dolorosas",
    "bolhas que viram feridas dolorosas na boca": "ampollas que se vuelven heridas dolorosas en la boca",
    "bolinha azulada no labio inferior": "pequeño bulto azulado en el labio inferior",
    "bolinha no labio inferior": "pequeño bulto en el labio inferior",
    "caroco dolorido no assoalho da boca que aumentou": "bulto doloroso en el piso de la boca que aumentó",
    "dor gengival intensa e mau halito": "dolor gingival intenso y mal aliento",
    "ferida na lateral da lingua que nao cicatriza": "herida en el lateral de la lengua que no cicatriza",
    "feridas na boca com febre": "heridas en la boca con fiebre",
    "feridinhas na boca com febre": "pequeñas heridas en la boca con fiebre",
    "gengiva sangrando com mau halito forte": "encía sangrante con mal aliento fuerte",
    "labio inferior rachado e esbranquicado ha anos": "labio inferior agrietado y blanquecino desde hace años",
    "labio inferior ressecado e descamando": "labio inferior reseco y descamado",
    "mancha branca na borda da lingua": "mancha blanca en el borde de la lengua",
    "mancha branca na mucosa jugal": "mancha blanca en la mucosa yugal",
    "manchas que mudam de lugar na lingua": "manchas en la lengua que cambian de lugar",
    "manchas vermelhas na lingua que mudam de lugar": "manchas rojas en la lengua que cambian de lugar",
    "aciclovir sem suspeita de herpes": "aciclovir sin sospecha de herpes",
    "acompanhamento periodico": "seguimiento periódico",
    "acompanhamento por potencial maligno": "seguimiento por potencial maligno",
    "acompanhar se houver mudanca atipica": "hacer seguimiento si hay cambio atípico",
    "acompanhar sem tratamento invasivo": "hacer seguimiento sin tratamiento invasivo",
    "analgesia e acompanhamento curto": "analgesia y seguimiento corto",
    "antibiotico sem investigacao": "antibiótico sin investigación",
    "antibiotico sem sinais de infeccao": "antibiótico sin signos de infección",
    "antibiotico sem sinal bacteriano": "antibiótico sin signos bacterianos",
    "antibiotico sistemico": "antibiótico sistémico",
    "antifungico sem exame clinico": "antifúngico sin examen clínico",
    "antifungico topico": "antifúngico tópico",
    "apenas ajuste oclusal e observacao prolongada": "solo ajuste oclusal y observación prolongada",
    "avaliar ajuste da protese": "evaluar ajuste de la prótesis",
    "avaliar apagamento do limite vermelhao-cutaneo": "evaluar borramiento del límite bermellón-cutáneo",
    "avaliar deficiencias nutricionais se recorrente": "evaluar deficiencias nutricionales si es recurrente",
    "avaliar dor com alimentos acidos": "evaluar dolor con alimentos ácidos",
    "avaliar hidratacao": "evaluar hidratación",
    "avaliar higiene e adaptacao da protese": "evaluar higiene y adaptación de la prótesis",
    "avaliar historia de trauma ou mordiscamento": "evaluar historia de trauma o mordisqueo",
    "avaliar localizacao em mucosa nao queratinizada": "evaluar localización en mucosa no queratinizada",
    "avaliar padrao de recorrencia": "evaluar patrón de recurrencia",
    "avaliar papilas interdentais necrosadas": "evaluar papilas interdentales necrosadas",
    "avaliar papilas necrosadas": "evaluar papilas necrosadas",
    "avaliar se a placa e removivel por raspagem": "evaluar si la placa es removible por raspado",
    "avaliar sinal de Nikolsky": "evaluar signo de Nikolsky",
    "biopsia com exame histopatologico": "biopsia con examen histopatológico",
    "biopsia de rotina em toda crianca": "biopsia de rutina en todo niño",
    "biopsia em area ulcerada ou endurecida": "biopsia en área ulcerada o endurecida",
    "biopsia imediata de toda afta pequena": "biopsia inmediata de toda afta pequeña",
    "biopsia imediata sem criterio clinico": "biopsia inmediata sin criterio clínico",
    "biopsia imediata sem tentativa de remocao": "biopsia inmediata sin intento de remoción",
    "biopsia incisional": "biopsia incisional",
    "biopsia perilesional com imunofluorescencia": "biopsia perilesional con inmunofluorescencia",
    "biopsia se apresentacao atipica": "biopsia si la presentación es atípica",
    "biopsia se persistente ou heterogenea": "biopsia si es persistente o heterogénea",
    "biopsia se persistente ou nao removivel": "biopsia si es persistente o no removible",
    "bochecho alcoolico como unica conduta": "enjuague alcohólico como única conducta",
    "clareamento dental": "blanqueamiento dental",
    "clareamento dental como conduta inicial": "blanqueamiento dental como conducta inicial",
    "clareamento dental como prioridade": "blanqueamiento dental como prioridad",
    "considerar antiviral se inicio recente e grave": "considerar antiviral si el inicio es reciente y grave",
    "considerar antiviral se inicio recente e quadro importante": "considerar antiviral si el inicio es reciente y el cuadro es importante",
    "considerar corticoide topico": "considerar corticoide tópico",
    "controle de dor e febre": "control del dolor y la fiebre",
    "corticoide topico quando indicado": "corticoide tópico cuando esté indicado",
    "corticoide topico se indicado": "corticoide tópico si está indicado",
    "desbridamento cuidadoso e controle de placa": "desbridamiento cuidadoso y control de placa",
    "desbridamento suave e controle de placa": "desbridamiento suave y control de placa",
    "encaminhamento para dermatologia/estomatologia": "derivación a dermatología/estomatología",
    "encaminhamento para estomatologia": "derivación a estomatología",
    "encaminhamento para estomatologia ou dermatologia": "derivación a estomatología o dermatología",
    "enviar material para histopatologico": "enviar material para histopatología",
    "evitar procedimentos eletivos": "evitar procedimientos electivos",
    "exame intraoral completo": "examen intraoral completo",
    "examinar consistencia e cor da lesao": "examinar consistencia y color de la lesión",
    "examinar gengiva e mucosa oral": "examinar encía y mucosa oral",
    "examinar padrao bilateral das lesoes": "examinar patrón bilateral de las lesiones",
    "excisao cirurgica se persistente": "escisión quirúrgica si persiste",
    "extracao dentaria como primeira conduta": "extracción dental como primera conducta",
    "investigar bolhas e erosoes recorrentes": "investigar ampollas y erosiones recurrentes",
    "investigar deficiencias nutricionais se frequente": "investigar deficiencias nutricionales si es frecuente",
    "investigar diabetes e xerostomia": "investigar diabetes y xerostomía",
    "investigar diabetes ou imunossupressao": "investigar diabetes o inmunosupresión",
    "investigar estresse, sono e imunossupressao": "investigar estrés, sueño e inmunosupresión",
    "investigar exposicao solar ocupacional": "investigar exposición solar ocupacional",
    "investigar febre e inicio agudo": "investigar fiebre e inicio agudo",
    "investigar frequencia e duracao das ulceras": "investigar frecuencia y duración de las úlceras",
    "investigar higiene oral e sangramento": "investigar higiene oral y sangrado",
    "investigar imunossupressao": "investigar inmunosupresión",
    "investigar lesoes cutaneas": "investigar lesiones cutáneas",
    "investigar medicamentos em uso": "investigar medicamentos en uso",
    "investigar mudanca de localizacao das manchas": "investigar cambio de localización de las manchas",
    "investigar sinais sistemicos": "investigar signos sistémicos",
    "investigar sintomas e gatilhos": "investigar síntomas y desencadenantes",
    "investigar sintomas sistemicos": "investigar síntomas sistémicos",
    "investigar tabagismo": "investigar tabaquismo",
    "investigar trauma por mordida": "investigar trauma por mordida",
    "observacao em lesao pequena recente": "observación en lesión pequeña reciente",
    "observacao por 60 dias como unica conduta": "observación por 60 días como única conducta",
    "orientacao para cessar tabagismo": "orientación para cesar el tabaquismo",
    "orientar alimentacao fria e liquida": "orientar alimentación fría y líquida",
    "orientar analgesia e corticoide topico quando indicado": "orientar analgesia y corticoide tópico cuando esté indicado",
    "orientar analgesia e suporte": "orientar analgesia y soporte",
    "orientar controle de dor e higiene": "orientar control del dolor e higiene",
    "orientar evitar irritantes quando sintomatica": "orientar evitar irritantes cuando sea sintomática",
    "orientar evitar irritantes se sintomatica": "orientar evitar irritantes si es sintomática",
    "orientar evitar manipulacao": "orientar evitar manipulación",
    "orientar fotoprotecao labial": "orientar fotoprotección labial",
    "orientar higiene da protese": "orientar higiene de la prótesis",
    "orientar higiene e analgesia": "orientar higiene y analgesia",
    "orientar higiene oral": "orientar higiene oral",
    "orientar remocao cirurgica se persistente": "orientar remoción quirúrgica si persiste",
    "orientar remocao noturna da protese": "orientar remoción nocturna de la prótesis",
    "palpacao de linfonodos cervicais": "palpación de ganglios cervicales",
    "pomada antibiotica prolongada sem exame": "pomada antibiótica prolongada sin examen",
    "prescrever antifungico quando indicado": "prescribir antifúngico cuando esté indicado",
    "prescricao de antibiotico sem investigacao": "prescripción de antibiótico sin investigación",
    "procedimento odontologico eletivo imediato": "procedimiento odontológico electivo inmediato",
    "raspagem periodontal como primeira conduta": "raspado periodontal como primera conducta",
    "reconhecer padrao migratorio": "reconocer patrón migratorio",
    "remocao de fatores irritativos": "remoción de factores irritativos",
    "remover protese para exame": "retirar prótesis para examen",
    "revisar medicamentos": "revisar medicamentos",
    "somente hidratante sem retorno": "solo hidratante sin retorno",
    "testar raspagem da placa": "probar raspado de la placa",
    "teste de remocao das placas por raspagem": "prueba de remoción de placas por raspado",
    "tranquilizar paciente e responsavel": "tranquilizar al paciente y responsable",
    "tranquilizar sobre benignidade": "tranquilizar sobre benignidad"
  }
};

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function t(key) {
  return I18N[state.language]?.[key] || I18N.pt[key] || key;
}

function flowLabel(id) {
  return FLOW_TRANSLATIONS[id]?.[state.language] || FLOW_TRANSLATIONS[id]?.pt || id;
}

function clinicalText(text) {
  if (!text || state.language === "pt") return text;
  const exactMap = EXACT_CLINICAL_TEXT[state.language] || {};
  const exactTranslation = exactMap[text] || Object.entries(exactMap).find(([source]) => normalize(source) === normalize(text))?.[1];
  if (exactTranslation) return exactTranslation;

  const map = CLINICAL_TERMS[state.language] || {};
  const normalizedText = normalize(text);
  const exactEntry = Object.entries(map).find(([source]) => normalize(source) === normalizedText);
  const exact = map[text] || exactEntry?.[1];
  if (exact) return exact;

  let translated = text;
  Object.entries(map)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([source, target]) => {
      translated = translated.replace(new RegExp(escapeRegExp(source), "gi"), target);
    });

  return translated;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function localizedPatient(patient) {
  return `${patient.name}, ${patient.age} ${t("years")}`;
}

function localizedPatientProfile(patient) {
  const profile = patientBehaviorProfile(patient);
  if (state.language === "pt") return `paciente ${patient.gender}, ${patient.personality}; perfil ${profile.label}`;
  if (state.language === "en") return `${clinicalText(patient.gender)} patient`;
  return `paciente ${clinicalText(patient.gender)}`;
}

function localizedCaseTitle(caseItem) {
  if (state.language === "pt") return `${caseItem.patient.name} - ${caseItem.chiefComplaint}`;
  return `${caseItem.patient.name} - ${clinicalText(caseItem.chiefComplaint)}`;
}

function localizedChiefComplaint(caseItem) {
  return clinicalText(caseItem.chiefComplaint);
}

function patientOpeningLine() {
  const complaint = localizedChiefComplaint(state.currentCase);
  if (state.language === "en") return `I came in because I have ${complaint}.`;
  if (state.language === "es") return `Vine porque tengo ${complaint}.`;
  return openingLineForBehavior(state.currentCase.openingLine);
}

function patientAnswerText(item, originalAnswer, context = {}) {
  const key = hiddenDataKeyForItem(item);
  if (state.language === "pt") {
    return applyPatientBehavior(originalAnswer, key, item, context);
  }

  const value = localizedPatientDetailValue(key, item);
  const answer = NATURAL_PATIENT_ANSWERS[state.language]?.[key]?.(value, item);
  if (answer) return applyPatientBehavior(answer, key, item, context);

  const label = localizedFieldLabel(key, item).toLowerCase();
  const fallback = state.language === "en" ? `What I can tell you is that ${value}.` : `Lo que puedo decirle es que ${value}.`;
  return applyPatientBehavior(`${fallback} (${label}).`.replace(/\s+/g, " ").trim(), key, item, context);
}

function hiddenDataKeyForItem(targetItem) {
  return Object.entries(state.currentCase?.hiddenData || {}).find(([, item]) => item === targetItem)?.[0] || "";
}

const PATIENT_BEHAVIOR_PROFILES = {
  collaborative: {
    label: "colaborativo",
    prompt: "Responde de forma direta, clara e proporcional ao que foi perguntado."
  },
  anxious: {
    label: "ansioso",
    prompt: "Demonstra preocupacao, pode acrescentar uma frase curta de medo ou urgencia quando o dado for preocupante.",
    cues: ["Minha esposa insistiu muito para eu vir.", "Eu fico preocupado porque nao melhora."]
  },
  evasive: {
    label: "evasivo",
    prompt: "Minimiza habitos e sintomas sensiveis na primeira pergunta, mas revela quantidades quando o aluno aprofunda.",
    sensitiveKeys: ["tobacco", "smoking", "alcohol", "habitsGeneral"]
  },
  talkative: {
    label: "falante",
    prompt: "Fala um pouco alem da pergunta, mas sem entregar diagnostico nem dados ainda bloqueados."
  },
  confusedOlder: {
    label: "idoso confuso",
    prompt: "Pode hesitar em datas e ordenar lembrancas com alguma incerteza, mantendo o dado clinico correto."
  },
  lowEducation: {
    label: "baixa escolaridade",
    prompt: "Usa linguagem leiga e evita termos tecnicos; troca termos como linfonodo por caroco no pescoco."
  }
};

function patientBehaviorProfile(patient = {}) {
  const explicit = patient.behaviorProfile || {};
  const base = explicit.base || inferBehaviorBase(patient);
  const traits = new Set([base, ...(explicit.traits || [])]);
  if (patient.age >= 70) traits.add("confusedOlder");
  if (normalize(patient.personality || "").includes("evasivo")) traits.add("evasive");
  if (normalize(patient.personality || "").includes("ansioso")) traits.add("anxious");

  const label = Array.from(traits)
    .map((trait) => PATIENT_BEHAVIOR_PROFILES[trait]?.label)
    .filter(Boolean)
    .join(", ") || PATIENT_BEHAVIOR_PROFILES.collaborative.label;

  return {
    base,
    traits: Array.from(traits),
    label,
    education: explicit.education || "",
    fear: explicit.fear || ""
  };
}

function inferBehaviorBase(patient = {}) {
  const text = normalize(`${patient.personality || ""} ${patient.gender || ""}`);
  if (text.includes("evasivo")) return "evasive";
  if (text.includes("ansioso")) return "anxious";
  if (text.includes("falante")) return "talkative";
  if ((patient.age || 0) >= 70) return "confusedOlder";
  return "collaborative";
}

function patientBehaviorForPrompt(patient = state.currentCase?.patient) {
  const profile = patientBehaviorProfile(patient);
  const instructions = profile.traits
    .map((trait) => PATIENT_BEHAVIOR_PROFILES[trait]?.prompt)
    .filter(Boolean);
  return {
    base: profile.base,
    traits: profile.traits,
    label: profile.label,
    education: profile.education,
    fear: profile.fear,
    instructions
  };
}

function openingLineForBehavior(defaultOpening) {
  const profile = patientBehaviorProfile(state.currentCase.patient);
  const cues = profile.traits.flatMap((trait) => PATIENT_BEHAVIOR_PROFILES[trait]?.cues || []);
  const cue = cues[Math.abs(hashText(state.currentCase.id || "") + state.currentCase.patient.age) % Math.max(cues.length, 1)];
  if (profile.traits.includes("anxious") && cue) return `${defaultOpening} ${cue}`;
  return defaultOpening;
}

function applyPatientBehavior(answer, key, item, context = {}) {
  const profile = patientBehaviorProfile(state.currentCase.patient);
  let text = answer;

  if (profile.traits.includes("lowEducation") || profile.education) {
    text = layPatientTerms(text);
  }

  if (profile.traits.includes("evasive") && isSensitiveBehaviorKey(key) && context.askedCount === 0) {
    text = evasiveFirstAnswer(text, key);
  } else if (profile.traits.includes("confusedOlder") && key === "duration") {
    text = addOlderDateHesitation(text);
  } else if (profile.traits.includes("anxious") && isWorryingKey(key)) {
    text = addAnxiousCue(text);
  } else if (profile.traits.includes("talkative") && !context.wasRevealed) {
    text = addTalkativeCue(text);
  }

  return text.replace(/\s+/g, " ").trim();
}

function isSensitiveBehaviorKey(key) {
  return ["tobacco", "smoking", "alcohol", "habitsGeneral"].includes(key);
}

function isWorryingKey(key) {
  return ["duration", "pain", "feeding", "weightLoss", "lymphNodes", "growth", "ulcer"].includes(key);
}

function layPatientTerms(text) {
  return text
    .replace(/\blinfonodos?\b/gi, "carocos no pescoco")
    .replace(/\bganglios?\b/gi, "carocos")
    .replace(/nodulo cervical endurecido/gi, "caroco duro no pescoco")
    .replace(/lesao/gi, "ferida")
    .replace(/mucosa/gi, "parte de dentro da boca");
}

function evasiveFirstAnswer(answer, key) {
  if (key === "tobacco" || key === "smoking") return "Eu fumo, mas e pouco... nao sei dizer assim de cabeca.";
  if (key === "alcohol") return "Bebo mais em fim de semana, nada demais... pelo menos eu acho.";
  return `Ah, isso eu nao costumo comentar muito. ${answer}`;
}

function addOlderDateHesitation(answer) {
  return `Olha, eu me confundo um pouco com data, mas acho que e isso mesmo: ${answer}`;
}

function addAnxiousCue(answer) {
  if (/[.!?]$/.test(answer)) return `${answer} Eu estou preocupado porque nao melhora.`;
  return `${answer}. Eu estou preocupado porque nao melhora.`;
}

function addTalkativeCue(answer) {
  if (/[.!?]$/.test(answer)) return `${answer} Foi isso que me fez procurar atendimento.`;
  return `${answer}. Foi isso que me fez procurar atendimento.`;
}

const NATURAL_PATIENT_ANSWERS = {
  en: {
    alcohol: (value) => `I do drink; ${value}.`,
    appearance: (value) => `The way it looks worries me: ${value}.`,
    atopy: (value) => `I have this background: ${value}.`,
    bilateral: (value) => `It is not just on one side; ${value}.`,
    bleeding: (value) => `Yes, it bleeds. ${value}.`,
    blisters: (value) => `First I notice blisters, then ${value}.`,
    border: (value) => `The edge of the lip does look different; ${value}.`,
    contact: (value) => `There was a recent contact that may matter: ${value}.`,
    dentalGeneral: (value) => `About my dental history, ${value}.`,
    diabetes: (value) => `About diabetes, ${value}.`,
    diet: (value) => `My diet has not been ideal; ${value}.`,
    distribution: (value) => `The sores are spread out; ${value}.`,
    duration: (value) => `It has been going on for ${value}.`,
    familyHistory: (value) => `In my family history, ${value}.`,
    feeding: (value) => `Eating and drinking have been difficult; ${value}.`,
    fever: (value) => `Yes, there has been fever: ${value}.`,
    food: (value) => `Food makes it worse; ${value}.`,
    frequency: (value) => `This keeps coming back; ${value}.`,
    gingiva: (value) => `My gums are involved too; ${value}.`,
    growth: (value) => `It changes in size; ${value}.`,
    habitsGeneral: (value) => `About my habits, ${value}.`,
    hygiene: (value) => `About hygiene, ${value}.`,
    lesions: (value) => `There are several spots or sores; ${value}.`,
    location: (value) => `It usually appears in this area: ${value}.`,
    lymphNodes: (value) => `I noticed something in the neck area; ${value}.`,
    medicalGeneral: (value) => `About my general health, ${value}.`,
    medications: (value) => `About medications, ${value}.`,
    migration: (value) => `The patches do move around; ${value}.`,
    odor: (value) => `The bad breath is noticeable; ${value}.`,
    pain: (value) => `It hurts or burns; ${value}.`,
    prosthesis: (value) => `About my denture, ${value}.`,
    scraping: (value) => `When someone tries to wipe or scrape it, ${value}.`,
    skin: (value) => `About my skin or other areas, ${value}.`,
    smoking: (value) => `About smoking, ${value}.`,
    stress: (value) => `Stress and sleep have been an issue; ${value}.`,
    sun: (value) => `I have had a lot of sun exposure; ${value}.`,
    systemic: (value) => `As far as general symptoms, ${value}.`,
    texture: (value) => `The surface feels or looks different; ${value}.`,
    tobacco: (value) => `About tobacco, ${value}.`,
    trauma: (value) => `There may be local trauma; ${value}.`,
    ulcer: (value) => `There is a sore or crack that worries me; ${value}.`,
    weightLoss: (value) => `I have lost weight; ${value}.`
  },
  es: {
    alcohol: (value) => `Sí consumo alcohol; ${value}.`,
    appearance: (value) => `El aspecto me preocupa: ${value}.`,
    atopy: (value) => `Tengo este antecedente: ${value}.`,
    bilateral: (value) => `No está solo de un lado; ${value}.`,
    bleeding: (value) => `Sí, sangra. ${value}.`,
    blisters: (value) => `Primero noto ampollas y después ${value}.`,
    border: (value) => `El borde del labio se ve diferente; ${value}.`,
    contact: (value) => `Hubo un contacto reciente que puede importar: ${value}.`,
    dentalGeneral: (value) => `Sobre mi historia odontológica, ${value}.`,
    diabetes: (value) => `Sobre la diabetes, ${value}.`,
    diet: (value) => `Mi alimentación no ha sido ideal; ${value}.`,
    distribution: (value) => `Las lesiones están distribuidas; ${value}.`,
    duration: (value) => `Esto lleva ${value}.`,
    familyHistory: (value) => `En mi historia familiar, ${value}.`,
    feeding: (value) => `Comer y beber se ha vuelto difícil; ${value}.`,
    fever: (value) => `Sí, hubo fiebre: ${value}.`,
    food: (value) => `La comida lo empeora; ${value}.`,
    frequency: (value) => `Esto vuelve a aparecer; ${value}.`,
    gingiva: (value) => `La encía también está afectada; ${value}.`,
    growth: (value) => `Cambia de tamaño; ${value}.`,
    habitsGeneral: (value) => `Sobre mis hábitos, ${value}.`,
    hygiene: (value) => `Sobre la higiene, ${value}.`,
    lesions: (value) => `Hay varias manchas o heridas; ${value}.`,
    location: (value) => `Suele aparecer en esta zona: ${value}.`,
    lymphNodes: (value) => `Noté algo en la zona del cuello; ${value}.`,
    medicalGeneral: (value) => `Sobre mi salud general, ${value}.`,
    medications: (value) => `Sobre medicamentos, ${value}.`,
    migration: (value) => `Las manchas sí cambian de lugar; ${value}.`,
    odor: (value) => `El mal aliento se nota bastante; ${value}.`,
    pain: (value) => `Me duele o me arde; ${value}.`,
    prosthesis: (value) => `Sobre mi prótesis, ${value}.`,
    scraping: (value) => `Cuando intentan limpiarlo o rasparlo, ${value}.`,
    skin: (value) => `Sobre la piel u otras zonas, ${value}.`,
    smoking: (value) => `Sobre el tabaquismo, ${value}.`,
    stress: (value) => `El estrés y el sueño han influido; ${value}.`,
    sun: (value) => `He tenido mucha exposición al sol; ${value}.`,
    systemic: (value) => `En cuanto a síntomas generales, ${value}.`,
    texture: (value) => `La superficie se ve o se siente diferente; ${value}.`,
    tobacco: (value) => `Sobre el tabaco, ${value}.`,
    trauma: (value) => `Puede haber trauma local; ${value}.`,
    ulcer: (value) => `Hay una herida o grieta que me preocupa; ${value}.`,
    weightLoss: (value) => `He perdido peso; ${value}.`
  }
};

const FIELD_LABELS = {
  en: {
    alcohol: "alcohol use",
    appearance: "lesion appearance",
    atopy: "atopy",
    bilateral: "bilateral distribution",
    bleeding: "bleeding",
    blisters: "blisters",
    border: "lip border",
    contact: "contact history",
    dentalGeneral: "dental history",
    diabetes: "diabetes",
    diet: "diet",
    distribution: "distribution",
    duration: "duration",
    familyHistory: "family history",
    feeding: "feeding",
    fever: "fever",
    food: "food triggers",
    frequency: "frequency",
    gingiva: "gingival condition",
    growth: "growth pattern",
    habitsGeneral: "general habits",
    hygiene: "hygiene",
    lesions: "lesions",
    location: "location",
    lymphNodes: "lymph nodes",
    medicalGeneral: "medical history",
    medications: "medications",
    migration: "migration",
    odor: "bad breath",
    pain: "pain",
    prosthesis: "denture use",
    scraping: "scraping test",
    skin: "skin involvement",
    smoking: "smoking",
    stress: "stress",
    sun: "sun exposure",
    systemic: "systemic symptoms",
    texture: "surface texture",
    tobacco: "tobacco use",
    trauma: "local trauma",
    ulcer: "ulceration",
    weightLoss: "weight loss"
  },
  es: {
    alcohol: "consumo de alcohol",
    appearance: "aspecto de la lesion",
    atopy: "atopia",
    bilateral: "distribucion bilateral",
    bleeding: "sangrado",
    blisters: "ampollas",
    border: "borde del labio",
    contact: "historia de contacto",
    dentalGeneral: "historia odontologica",
    diabetes: "diabetes",
    diet: "dieta",
    distribution: "distribucion",
    duration: "duracion",
    familyHistory: "historia familiar",
    feeding: "alimentacion",
    fever: "fiebre",
    food: "desencadenantes alimentarios",
    frequency: "frecuencia",
    gingiva: "condicion gingival",
    growth: "patron de crecimiento",
    habitsGeneral: "habitos generales",
    hygiene: "higiene",
    lesions: "lesiones",
    location: "localizacion",
    lymphNodes: "ganglios linfaticos",
    medicalGeneral: "historia medica",
    medications: "medicamentos",
    migration: "migracion",
    odor: "mal aliento",
    pain: "dolor",
    prosthesis: "uso de protesis",
    scraping: "prueba de raspado",
    skin: "compromiso cutaneo",
    smoking: "tabaquismo",
    stress: "estres",
    sun: "exposicion solar",
    systemic: "sintomas sistemicos",
    texture: "textura de la superficie",
    tobacco: "uso de tabaco",
    trauma: "trauma local",
    ulcer: "ulceracion",
    weightLoss: "perdida de peso"
  }
};

const FIELD_VALUES = {
  en: {
    alcohol: "there is relevant alcohol exposure for the clinical history",
    appearance: "the lesion has clinically relevant color and surface changes",
    atopy: "there is a history of allergic or atopic disease",
    bilateral: "the lesions are present on both sides",
    bleeding: "there is gingival bleeding",
    blisters: "fragile blisters rupture and leave painful erosions",
    border: "the vermilion border is partially blurred",
    contact: "there was recent contact with someone with oral or lip lesions",
    dentalGeneral: "the dental history is relevant to this case",
    diabetes: "diabetes is present or must be investigated",
    diet: "dietary pattern may contribute to recurrence or healing",
    distribution: "lesions involve multiple oral sites",
    duration: "the condition has persisted beyond an acute isolated episode",
    familyHistory: "family history was reviewed for related diseases or cancer",
    feeding: "feeding and hydration are reduced because of oral discomfort",
    fever: "fever or acute systemic symptoms are present",
    food: "acidic or spicy foods worsen the symptoms",
    frequency: "episodes are recurrent",
    gingiva: "the gingiva is inflamed and symptomatic",
    growth: "the lesion changes size over time",
    habitsGeneral: "daily habits are relevant to the case",
    hygiene: "hygiene practices require guidance",
    lesions: "multiple oral lesions are present",
    location: "the lesion location is clinically characteristic",
    lymphNodes: "regional lymph nodes require careful evaluation",
    medicalGeneral: "general medical history was reviewed",
    medications: "current or recent medication use is clinically relevant",
    migration: "the tongue patches change location over time",
    odor: "bad breath is an important symptom",
    pain: "pain or burning is present and affects oral function",
    prosthesis: "denture use is relevant to the lesion",
    scraping: "the clinician should check whether the plaque can be removed by scraping",
    skin: "skin or extraoral involvement must be investigated",
    smoking: "smoking is a relevant risk factor",
    stress: "stress and sleep changes may worsen the condition",
    sun: "there is chronic occupational sun exposure",
    systemic: "systemic symptoms were screened",
    texture: "the lesion surface is clinically altered",
    tobacco: "tobacco exposure is clinically relevant",
    trauma: "local trauma or biting habit is relevant",
    ulcer: "persistent fissure or ulceration is present",
    weightLoss: "weight loss is a warning sign in this case"
  },
  es: {
    alcohol: "hay exposicion relevante al alcohol en la historia clinica",
    appearance: "la lesion presenta cambios clinicamente relevantes de color y superficie",
    atopy: "hay antecedente de enfermedad alergica o atopica",
    bilateral: "las lesiones estan presentes en ambos lados",
    bleeding: "hay sangrado gingival",
    blisters: "las ampollas fragiles se rompen y dejan erosiones dolorosas",
    border: "el borde bermellon esta parcialmente borrado",
    contact: "hubo contacto reciente con alguien con lesiones orales o labiales",
    dentalGeneral: "la historia odontologica es relevante para este caso",
    diabetes: "hay diabetes o debe ser investigada",
    diet: "el patron alimentario puede contribuir a la recurrencia o cicatrizacion",
    distribution: "las lesiones comprometen varios sitios orales",
    duration: "la condicion persiste mas alla de un episodio agudo aislado",
    familyHistory: "se reviso la historia familiar por enfermedades relacionadas o cancer",
    feeding: "la alimentacion y la hidratacion estan reducidas por molestias orales",
    fever: "hay fiebre o sintomas sistemicos agudos",
    food: "los alimentos acidos o picantes empeoran los sintomas",
    frequency: "los episodios son recurrentes",
    gingiva: "la encia esta inflamada y sintomatica",
    growth: "la lesion cambia de tamano con el tiempo",
    habitsGeneral: "los habitos diarios son relevantes para el caso",
    hygiene: "las practicas de higiene requieren orientacion",
    lesions: "hay multiples lesiones orales",
    location: "la localizacion de la lesion es clinicamente caracteristica",
    lymphNodes: "los ganglios regionales requieren evaluacion cuidadosa",
    medicalGeneral: "se reviso la historia medica general",
    medications: "el uso actual o reciente de medicamentos es clinicamente relevante",
    migration: "las manchas de la lengua cambian de lugar con el tiempo",
    odor: "el mal aliento es un sintoma importante",
    pain: "hay dolor o ardor que afecta la funcion oral",
    prosthesis: "el uso de protesis es relevante para la lesion",
    scraping: "el clinico debe verificar si la placa se remueve por raspado",
    skin: "debe investigarse compromiso cutaneo o extraoral",
    smoking: "el tabaquismo es un factor de riesgo relevante",
    stress: "el estres y los cambios de sueno pueden empeorar la condicion",
    sun: "hay exposicion solar ocupacional cronica",
    systemic: "se investigaron sintomas sistemicos",
    texture: "la superficie de la lesion esta clinicamente alterada",
    tobacco: "la exposicion al tabaco es clinicamente relevante",
    trauma: "el trauma local o habito de mordida es relevante",
    ulcer: "hay fisura o ulceracion persistente",
    weightLoss: "la perdida de peso es un signo de alerta en este caso"
  }
};

function localizedFieldLabel(key, item) {
  if (state.language === "pt") return item.label;
  return FIELD_LABELS[state.language]?.[key] || clinicalText(item.label);
}

function localizedFieldValue(key, item) {
  if (state.language === "pt") return item.value;
  return FIELD_VALUES[state.language]?.[key] || clinicalText(item.category);
}

function localizedPatientDetailValue(key, item) {
  if (state.language === "pt") return item.value;
  const directValueKeys = new Set([
    "duration",
    "frequency",
    "location",
    "tobacco",
    "smoking",
    "alcohol",
    "medications",
    "diabetes",
    "sun",
    "prosthesis",
    "contact",
    "fever",
    "weightLoss"
  ]);

  if (directValueKeys.has(key)) return clinicalText(item.value);
  return localizedFieldValue(key, item);
}

function renderStaticText() {
  document.documentElement.lang = { pt: "pt-BR", en: "en", es: "es" }[state.language];
  document.title = `ExamOSim | ${t("tagline")}`;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  els.studentName.placeholder = t("studentName");
  els.studentName.setAttribute("aria-label", t("studentName"));
  els.studentId.placeholder = t("studentId");
  els.studentId.setAttribute("aria-label", t("studentId"));
  els.studentCollege.placeholder = t("studentCollege");
  els.studentCollege.setAttribute("aria-label", t("studentCollege"));
  els.caseSelect.setAttribute("aria-label", t("selectCase"));
  els.questionInput.placeholder = t("askQuestion");
  els.questionInput.setAttribute("aria-label", t("askQuestion"));
  els.micBtn.setAttribute("aria-label", t("speakQuestion"));
  els.voiceStatus.textContent = state.recognition ? t("micAvailable") : t("unavailableMic");
}

function rerenderLanguageDependentViews({ resetConversation = false } = {}) {
  renderStaticText();
  renderCaseOptions();
  if (state.currentCase) {
    els.patientName.textContent = localizedPatient(state.currentCase.patient);
    els.difficultyBadge.textContent = `${t("difficulty")} ${clinicalText(state.currentCase.difficulty)}`;
    renderCaseSummary();
    renderChart();
    renderProgress();
    renderFlow();
    renderChoices();
    renderPhysicalExam();
    setEmotion(els.avatar.classList.contains("pain") ? "dor" : els.avatar.classList.contains("anxious") ? "ansioso" : "neutro");
    if (els.report.innerHTML.trim()) renderReport(evaluateCase());
    if (resetConversation) resetChat();
  }
}

async function boot() {
  const response = await fetch("data/cases.json");
  state.cases = await response.json();
  renderStaticText();
  renderCaseOptions();
  loadCase(state.cases[0].id);
}

function renderCaseOptions() {
  const selectedId = state.currentCase?.id || els.caseSelect.value;
  els.caseSelect.innerHTML = state.cases
    .map(
      (caseItem) =>
        `<option value="${caseItem.id}">${localizedCaseTitle(caseItem)}</option>`
    )
    .join("");
  if (selectedId) els.caseSelect.value = selectedId;
}

function loadCase(caseId) {
  state.currentCase = state.cases.find((caseItem) => caseItem.id === caseId);
  state.revealed = new Set();
  state.askedIntents = new Map();
  state.selectedHypotheses = new Set();
  state.selectedActions = new Set();
  state.transcript = [];
  state.flowEvents = [];
  state.outOfOrderEvents = [];
  state.structuredQuestions = {};
  state.structuredQuestionTotals = {};
  state.hdaQuestionAxes = new Set();
  state.lastReport = null;
  state.pendingAnamnesisUpdate = null;
  state.pendingClinicalDatum = null;
  state.physicalExamUnlocked = false;
  if (els.osceStatus) els.osceStatus.textContent = "";
  if (els.osceNotes) els.osceNotes.value = "";
  els.report.innerHTML = "";
  els.patientName.textContent = localizedPatient(state.currentCase.patient);
  els.difficultyBadge.textContent = `${t("difficulty")} ${clinicalText(state.currentCase.difficulty)}`;
  updateAvatarProfile();
  setEmotion("ansioso");
  renderCaseSummary();
  renderChart();
  renderProgress();
  renderFlow();
  renderChoices();
  renderPhysicalExam();
  resetChat();
}

function renderCaseSummary() {
  const caseItem = state.currentCase;
  els.caseSummary.innerHTML = `
    <p><strong>${t("chiefComplaint")}:</strong> ${localizedChiefComplaint(caseItem)}</p>
    <p><strong>${t("profile")}:</strong> ${localizedPatientProfile(caseItem.patient)}.</p>
    <p><strong>${t("base")}:</strong> ${t("baseText")}</p>
    <p><strong>${t("objective")}:</strong> ${t("objectiveText")}</p>
  `;
}

function renderChart() {
  const domainReports = domainCoverageReports();
  const rows = [
    [t("student"), state.student.name || t("studentMissing")],
    [t("studentId"), state.student.id || t("notInformed")],
    [t("studentCollege"), state.student.college || t("collegeMissing")],
    [t("patient"), localizedPatient(state.currentCase.patient)],
    [t("complaint"), localizedChiefComplaint(state.currentCase)],
    ...domainReports.map((domain) => [
      flowLabel(domain.groupId),
      `${domain.coverage}% · ${t("questionsShort")} ${domain.questionCount} · ${t("dataShort")} ${domain.revealedRequired}/${domain.totalRequired}`
    ])
  ];

  els.chartList.innerHTML = rows
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function renderFlow() {
  const currentStage = currentExpectedStage();
  els.flowList.innerHTML = ANAMNESIS_FLOW.map((step, index) => {
    const domain = domainCoverageReport(step.id);
    const level = domain.coverage >= 80 ? "green" : domain.coverage > 0 ? "yellow" : "red";
    const hasSequenceJump = state.outOfOrderEvents.some((event) => event.groupId === step.id);
    const progressText = `${domain.coverage}% · ${t("questionsShort")} ${domain.questionCount} · ${t("dataShort")} ${domain.revealedRequired}`;
    const status = currentStage === step.id
      ? `${t("currentStage")} · ${progressText}`
      : hasSequenceJump
        ? `${t("outOfOrder")} · ${progressText}`
        : level === "green"
          ? `${t("stageGreen")} · ${progressText}`
          : level === "yellow"
            ? `${t("stageYellow")} · ${progressText}`
            : progressText;
    const classes = [level, currentStage === step.id ? "current" : "", hasSequenceJump ? "sequence-warning" : ""].filter(Boolean).join(" ");
    return `
      <div class="flow-step ${classes}">
        <div class="flow-step-main">
          <span>${index + 1}. ${flowLabel(step.id)}</span>
          <strong>${status}</strong>
        </div>
        <div class="coverage-bar" aria-label="${flowLabel(step.id)} ${domain.coverage}%">
          <span style="width: ${domain.coverage}%"></span>
        </div>
        ${step.id === "currentIllness" ? renderHdaAxes(domain) : ""}
        <div class="flow-metrics">
          <span>${coverageStatus(domain.coverage)}</span>
          <span>${t("questionsShort")} ${domain.questionCount}</span>
          <span>${t("dataShort")} ${domain.revealedRequired}/${domain.totalRequired}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderHdaAxes(domain) {
  return `
    <ul class="flow-data" aria-label="${flowLabel(domain.groupId)}">
      ${HDA_REQUIRED_AXES.map((axis) => {
        const done = domain.hdaAxes?.includes(axis);
        return `<li class="${done ? "done" : ""}"><span>${hdaAxisLabel(axis)}</span></li>`;
      }).join("")}
    </ul>
  `;
}

function renderProgress() {
  els.progressList.innerHTML = domainCoverageReports()
    .map((domain) => {
      const done = domain.coverage >= 80 ? "done" : "";
      return `<div class="progress-item ${done}"><span>${flowLabel(domain.groupId)}: ${domain.coverage}%</span><span class="progress-dot"></span></div>`;
    })
    .join("");
}

function domainCoverageReports() {
  return ANAMNESIS_FLOW.map((step) => domainCoverageReport(step.id));
}

function domainCoverageReport(groupId) {
  const requiredEntries = orderedGroupEntries(groupId).filter(([, item]) => item.required);
  const totalRequired = requiredEntries.length;
  const revealedRequired = requiredEntries.filter(([key]) => state.revealed.has(key)).length;
  const questionCount = structuredQuestionCount(groupId);
  const requiredQuestions = requiredStructuredQuestions(groupId);
  const hdaAxes = groupId === "currentIllness" ? Array.from(state.hdaQuestionAxes) : [];
  const questionCoverage = groupId === "currentIllness"
    ? hdaQuestionCoverage()
    : requiredQuestions ? Math.min(questionCount / requiredQuestions, 1) : 1;
  const dataCoverage = totalRequired ? revealedRequired / totalRequired : questionCoverage;
  const coverage = totalRequired
    ? revealedRequired === totalRequired
      ? 100
      : Math.round(((dataCoverage * 0.75) + (questionCoverage * 0.25)) * 100)
    : Math.round(questionCoverage * 100);
  return {
    groupId,
    requiredEntries,
    totalRequired,
    revealedRequired,
    questionCount,
    requiredQuestions,
    hdaAxes,
    coverage,
    score: Math.round(coverage / 10)
  };
}

function hdaQuestionCoverage() {
  return HDA_REQUIRED_AXES.length ? state.hdaQuestionAxes.size / HDA_REQUIRED_AXES.length : 1;
}

function hdaAxisLabel(axis) {
  return HDA_AXIS_LABELS[axis]?.[state.language] || HDA_AXIS_LABELS[axis]?.pt || axis;
}

function coverageStatus(coverage) {
  if (coverage >= 80) return t("stageGreen");
  if (coverage > 0) return t("stageYellow");
  return t("stageRed");
}

function renderPhysicalExam() {
  updatePhysicalExamUnlock();
  if (!state.physicalExamUnlocked) {
    els.physicalExamBox.className = "physical-exam-box locked";
    els.physicalExamBox.textContent = t("physicalExamLocked");
    return;
  }

  const exam = state.currentCase.physicalExam;
  const findings = exam?.findings?.length ? exam.findings : [];
  els.physicalExamBox.className = "physical-exam-box";

  if (!findings.length && !exam?.summary) {
    els.physicalExamBox.textContent = t("physicalExamUnavailable");
    return;
  }

  const items = findings.length
    ? findings.map((finding) => `<li>${clinicalText(finding)}</li>`).join("")
    : `<li>${clinicalText(exam.summary)}</li>`;
  els.physicalExamBox.innerHTML = `<strong>${t("physicalExamUnlocked")}</strong><ul>${items}</ul>`;
}

function updatePhysicalExamUnlock() {
  if (state.physicalExamUnlocked || !state.currentCase) return;
  const required = Object.entries(state.currentCase.hiddenData).filter(([, item]) => item.required);
  const revealedRequired = required.filter(([key]) => state.revealed.has(key)).length;
  const majorityReached = required.length ? revealedRequired / required.length >= 0.7 : false;
  const expected = state.currentCase.anamnesisOrder || ANAMNESIS_FLOW.map((step) => step.id);
  const unique = getUniqueFlowEvents();
  const completedPath = expected.every((id) => unique.includes(id));
  const stageDepthReached = expected.every((id) => hasRequiredStructuredDepth(id));
  state.physicalExamUnlocked = majorityReached && completedPath && stageDepthReached;
}

function renderChoices() {
  els.hypothesisList.innerHTML = state.currentCase.differentials
    .map((hypothesis) => choiceTemplate("hypothesis", hypothesis, state.selectedHypotheses.has(hypothesis)))
    .join("");

  els.actionList.innerHTML = state.currentCase.actions
    .map((action) => choiceTemplate("action", action, state.selectedActions.has(action)))
    .join("");

  document.querySelectorAll("[data-kind='hypothesis']").forEach((input) => {
    input.addEventListener("change", () => toggleChoice(input, state.selectedHypotheses));
  });

  document.querySelectorAll("[data-kind='action']").forEach((input) => {
    input.addEventListener("change", () => toggleChoice(input, state.selectedActions));
  });
}

function choiceTemplate(kind, value, checked = false) {
  return `
    <label class="choice">
      <input type="checkbox" data-kind="${kind}" value="${value}" ${checked ? "checked" : ""} />
      <span>${clinicalText(value)}</span>
    </label>
  `;
}

function toggleChoice(input, targetSet) {
  if (input.checked) {
    targetSet.add(input.value);
  } else {
    targetSet.delete(input.value);
  }
}

function resetChat() {
  els.chatLog.innerHTML = "";
  addMessage("patient", patientOpeningLine());
  addMessage(
    "system",
    t("expectedScript")
  );
}

function addMessage(kind, text) {
  const message = document.createElement("div");
  message.className = `message ${kind}`;
  message.textContent = text;
  els.chatLog.appendChild(message);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
  state.transcript.push({ kind, text });

  if (kind === "patient") {
    speakPatient(text);
  }
}

els.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion();
});

async function submitQuestion() {
  const question = els.questionInput.value.trim();
  if (!question) return;

  els.questionInput.value = "";
  state.pendingAnamnesisUpdate = null;
  state.pendingClinicalDatum = null;
  addMessage("student", question);
  const localResponse = answerQuestion(question);
  const anamnesisUpdate = state.pendingAnamnesisUpdate;
  const clinicalDatum = state.pendingClinicalDatum;
  const response = await polishPatientDialogue(question, localResponse, clinicalDatum);
  window.setTimeout(() => {
    addMessage("patient", response);
    if (anamnesisUpdate) addMessage("system", anamnesisUpdateText(anamnesisUpdate));
  }, 180);
}

async function polishPatientDialogue(question, rawAnswer, clinicalDatum = null) {
  if (!rawAnswer || typeof rawAnswer !== "string") return rawAnswer;

  try {
    const response = await fetch("/api/gemini-dialogue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: state.language,
        question,
        rawAnswer,
        clinicalDatum,
        behaviorProfile: patientBehaviorForPrompt(),
        patient: state.currentCase.patient,
        chiefComplaint: localizedChiefComplaint(state.currentCase),
        allowedFacts: currentAllowedFacts(),
        recentTranscript: state.transcript.slice(-8)
      })
    });

    const data = await response.json();
    return data.answer || rawAnswer;
  } catch (error) {
    return rawAnswer;
  }
}

function currentAllowedFacts() {
  return Array.from(state.revealed).map((key) => {
    const item = state.currentCase.hiddenData[key];
    return {
      key,
      label: localizedFieldLabel(key, item),
      value: localizedFieldValue(key, item)
    };
  });
}

function answerQuestion(question) {
  const normalized = normalize(question);
  if (isVagueJargonQuestion(normalized)) {
    recordKnownTopicQuestion(detectKnownClinicalTopic(normalized) || "hda", normalized);
    setEmotion("neutro");
    return clarificationAnswer(normalized);
  }

  const contextualAnswer = answerContextualQuestion(normalized);
  if (contextualAnswer) return contextualAnswer;

  const broadGroup = detectAnamnesisGroup(normalized);
  if (broadGroup) {
    if (!canAccessStage(broadGroup)) return stageLockedAnswer();
    const groupMatch = findMatchingHiddenDataInGroup(normalized, broadGroup);
    if (groupMatch) return revealHiddenData(groupMatch, normalized);
    const answer = answerGroupQuestion(broadGroup);
    if (answer) return answer;
  }

  const matched = findMatchingHiddenData(normalized);

  if (!matched) {
    const flexibleMatch = findFlexibleHiddenData(normalized);
    if (flexibleMatch) {
      if (!canAccessStage(flexibleMatch[1].group)) return stageLockedAnswer();
      return revealHiddenData(flexibleMatch, normalized);
    }
    setEmotion("neutro");
    return genericAnswer(normalized);
  }

  if (!canAccessStage(matched[1].group)) return stageLockedAnswer();
  return revealHiddenData(matched, normalized);
}

function answerContextualQuestion(normalizedQuestion) {
  if (isPreviousSimilarLesionQuestion(normalizedQuestion)) {
    if (!canAccessStage("currentIllness")) return stageLockedAnswer();
    recordFlowStep("currentIllness", { suppressOutOfOrder: true });
    registerStructuredQuestion("currentIllness", "previousSimilarLesion", normalizedQuestion);
    const frequency = state.currentCase.hiddenData.frequency;
    if (frequency) return revealHiddenData(["frequency", frequency], normalizedQuestion);
    return previousSimilarLesionAnswer();
  }

  if (isTriggerEventQuestion(normalizedQuestion)) {
    if (!canAccessStage("currentIllness")) return stageLockedAnswer();
    recordFlowStep("currentIllness", { suppressOutOfOrder: true });
    registerStructuredQuestion("currentIllness", "triggerEvent", normalizedQuestion);
    const trauma = state.currentCase.hiddenData.trauma;
    if (trauma?.group === "currentIllness") {
      return revealHiddenData(["trauma", trauma], normalizedQuestion);
    }
    return triggerEventAnswer();
  }

  if (isPreviousCareQuestion(normalizedQuestion)) {
    if (!canAccessStage("dentalHistory")) return stageLockedAnswer();
    recordFlowStep("dentalHistory");
    registerStructuredQuestion("dentalHistory", "previousCare", normalizedQuestion);
    revealIfExists("dentalGeneral", { countQuestion: false });
    return previousCareAnswer();
  }

  if (isPreviousTreatmentQuestion(normalizedQuestion)) {
    if (!canAccessStage("currentIllness")) return stageLockedAnswer();
    recordFlowStep("currentIllness");
    registerStructuredQuestion("currentIllness", "previousTreatment", normalizedQuestion);
    return previousTreatmentAnswer();
  }

  if (isMedicationQuestion(normalizedQuestion)) {
    const medicationKey = state.currentCase.hiddenData.medications ? "medications" : "medicalGeneral";
    const medication = state.currentCase.hiddenData[medicationKey];
    if (!canAccessStage(medication?.group)) return stageLockedAnswer();
    if (medication) return revealHiddenData([medicationKey, medication], normalizedQuestion);
  }

  const clinicalIntentKey = detectSpecificClinicalIntent(normalizedQuestion);
  if (clinicalIntentKey && state.currentCase.hiddenData[clinicalIntentKey]) {
    if (!canAccessStage(state.currentCase.hiddenData[clinicalIntentKey].group)) return stageLockedAnswer();
    return revealHiddenData([clinicalIntentKey, state.currentCase.hiddenData[clinicalIntentKey]], normalizedQuestion);
  }

  const hdaAxisAnswer = answerHdaAxisQuestion(normalizedQuestion);
  if (hdaAxisAnswer) return hdaAxisAnswer;

  const knownTopic = detectKnownClinicalTopic(normalizedQuestion);
  if (knownTopic) {
    recordKnownTopicQuestion(knownTopic, normalizedQuestion);
    return naturalNoDataAnswer(knownTopic);
  }

  return "";
}

function recordKnownTopicQuestion(topic, normalizedQuestion) {
  const groupByTopic = {
    dental: "dentalHistory",
    family: "familyHistory",
    habit: "habits",
    hda: "currentIllness",
    malignancy: "currentIllness",
    medical: "medicalHistory",
    symptom: "currentIllness",
    temporal: "currentIllness",
    treatment: "currentIllness"
  };
  const groupId = groupByTopic[topic] || groupByTopic[detectKnownClinicalTopic(normalizedQuestion)] || "";
  if (!groupId) return;
  recordFlowStep(groupId);
  const hdaAxis = groupId === "currentIllness" ? detectHdaQuestionAxis(normalizedQuestion) : "";
  registerStructuredQuestion(groupId, hdaAxis ? `hdaAxis:${hdaAxis}` : `noData:${topic}:${hashText(normalizedQuestion)}`, normalizedQuestion);
}

function revealIfExists(key, options = {}) {
  if (!state.currentCase.hiddenData[key]) return;
  const wasRevealed = state.revealed.has(key);
  state.revealed.add(key);
  if (options.countQuestion !== false) {
    registerStructuredQuestion(state.currentCase.hiddenData[key].group, key);
  }
  queueAnamnesisUpdate(key, state.currentCase.hiddenData[key], wasRevealed);
  renderChart();
  renderProgress();
  renderPhysicalExam();
}

function queueAnamnesisUpdate(key, item, wasRevealed = false) {
  const groupId = item?.group;
  if (!groupId || !FLOW_TRANSLATIONS[groupId]) return;
  state.pendingAnamnesisUpdate = {
    groupId,
    key,
    wasRevealed
  };
}

function queueStageAnamnesisUpdate(groupId) {
  if (!groupId || !FLOW_TRANSLATIONS[groupId]) return;
  state.pendingAnamnesisUpdate = {
    groupId,
    key: "",
    wasRevealed: false
  };
}

function anamnesisUpdateText(update) {
  if (!update.key) {
    return `${t("anamnesisLink")}: ${t("questionCountedInStage")} ${flowLabel(update.groupId)}.`;
  }
  const item = state.currentCase.hiddenData[update.key];
  const stage = flowLabel(update.groupId);
  const field = localizedFieldLabel(update.key, item);
  const action = update.wasRevealed ? t("alreadyRegisteredInStage") : t("registeredInStage");
  return `${t("anamnesisLink")}: ${field} ${action} ${stage}.`;
}

function canAccessStage(groupId) {
  return true;
}

function requiredStructuredQuestions(groupId) {
  if (groupId === "currentIllness") return HDA_REQUIRED_AXES.length;
  return MIN_STRUCTURED_QUESTIONS_PER_STAGE;
}

function currentExpectedStage() {
  const order = state.currentCase?.anamnesisOrder || ANAMNESIS_FLOW.map((step) => step.id);
  return order.find((stageId) => !hasRequiredStructuredDepth(stageId)) || "";
}

function hasRequiredStructuredDepth(groupId) {
  if (groupId === "currentIllness") {
    return HDA_REQUIRED_AXES.every((axis) => state.hdaQuestionAxes.has(axis));
  }
  const requiredEntries = orderedGroupEntries(groupId).filter(([, item]) => item.required);
  if (requiredEntries.length) {
    return requiredEntries.every(([key]) => state.revealed.has(key));
  }
  return structuredQuestionCount(groupId) >= requiredStructuredQuestions(groupId);
}

function structuredQuestionCount(groupId) {
  return state.structuredQuestionTotals[groupId] || 0;
}

function registerStructuredQuestion(groupId, key, normalizedQuestion = "") {
  if (!groupId || !FLOW_TRANSLATIONS[groupId]) return;
  if (!state.structuredQuestions[groupId]) state.structuredQuestions[groupId] = new Set();
  const signature = `${key}:${state.askedIntents.get(key) || 0}`;
  if (state.structuredQuestions[groupId].has(signature)) return;
  state.structuredQuestions[groupId].add(signature);
  state.structuredQuestionTotals[groupId] = (state.structuredQuestionTotals[groupId] || 0) + 1;
  registerHdaQuestionAxis(groupId, key, normalizedQuestion);
  if (!state.currentCase?.hiddenData?.[key]) {
    queueStageAnamnesisUpdate(groupId);
  }
  renderFlow();
}

function registerHdaQuestionAxis(groupId, key, normalizedQuestion = "") {
  if (groupId !== "currentIllness") return;
  const axisFromQuestion = normalizedQuestion ? detectHdaQuestionAxis(normalizedQuestion) : "";
  const axis = axisFromQuestion || HDA_AXIS_BY_INTENT[key] || (String(key).startsWith("hdaAxis:") ? key.split(":")[1] : "");
  if (!axis || !HDA_REQUIRED_AXES.includes(axis)) return;
  state.hdaQuestionAxes.add(axis);
}

function stageLockedAnswer() {
  addMessage("system", t("stageLocked"));
  return {
    pt: "Certo, doutor.",
    en: "All right, doctor.",
    es: "De acuerdo, doctor."
  }[state.language];
}

function isPreviousCareQuestion(normalizedQuestion) {
  const careTokens = [
    "procurou outro profissional",
    "procurou profissional",
    "outro profissional",
    "procurou medico",
    "procurou dentista",
    "foi ao dentista",
    "foi no dentista",
    "foi ao medico",
    "foi no medico",
    "ja consultou",
    "ja procurou atendimento",
    "buscou atendimento",
    "procurou atendimento",
    "sought care",
    "see another professional",
    "seen another professional",
    "saw another professional",
    "seen a dentist",
    "saw a dentist",
    "seen a doctor",
    "saw a doctor",
    "consulted anyone",
    "buscar atencion",
    "busco atencion",
    "consulto a otro profesional",
    "consulto otro profesional",
    "fue al dentista",
    "fue al medico"
  ];

  return careTokens.some((token) => normalizedQuestion.includes(normalize(token)));
}

function isPreviousTreatmentQuestion(normalizedQuestion) {
  const treatmentTokens = [
    "tomou alguma coisa",
    "passou alguma coisa",
    "usou pomada",
    "utilizou pomada",
    "tomou antibiotico",
    "fez bochecho",
    "fez bochechos",
    "houve melhora",
    "melhorou com",
    "ja fez biopsia",
    "realizou biopsia",
    "suspeitou de cancer",
    "suspeita de cancer",
    "usou alguma coisa",
    "tentou tratar",
    "tentou algum tratamento",
    "fez algum tratamento",
    "medicou por conta",
    "automedicou",
    "self medicated",
    "used anything",
    "tried anything",
    "tried treatment",
    "took anything",
    "used ointment",
    "took antibiotics",
    "used mouthwash",
    "did it improve",
    "had a biopsy",
    "suspected cancer",
    "uso algo",
    "tomo algo",
    "uso pomada",
    "tomo antibiotico",
    "hizo enjuagues",
    "hubo mejora",
    "mejoro con",
    "hizo biopsia",
    "sospecho cancer",
    "sospecha de cancer",
    "intento tratar",
    "hizo algun tratamiento",
    "se automedico"
  ];

  return treatmentTokens.some((token) => normalizedQuestion.includes(normalize(token)));
}

function isPreviousSimilarLesionQuestion(normalizedQuestion) {
  const hasPriorFrame = [
    "ja teve",
    "ja apareceu",
    "apareceu antes",
    "teve antes",
    "aconteceu antes",
    "outras vezes",
    "alguma vez",
    "recorrente",
    "voltou",
    "costuma ter",
    "had this before",
    "happened before",
    "previously had",
    "ever had",
    "recurrent",
    "ya tuvo",
    "aparecio antes",
    "paso antes",
    "alguna vez",
    "recurrente"
  ].some((token) => normalizedQuestion.includes(normalize(token)));

  const hasLesionFrame = [
    "ferida",
    "afta",
    "lesao",
    "lesão",
    "mancha",
    "bolha",
    "lingua",
    "língua",
    "boca",
    "labio",
    "lábio",
    "sore",
    "ulcer",
    "lesion",
    "spot",
    "tongue",
    "mouth",
    "herida",
    "ulcera",
    "lesion",
    "lengua",
    "boca"
  ].some((token) => normalizedQuestion.includes(normalize(token)));

  return hasPriorFrame && hasLesionFrame;
}

function isTriggerEventQuestion(normalizedQuestion) {
  const hasAssociationFrame = [
    "por que",
    "por quê",
    "porque apareceu",
    "porque surgiu",
    "porque comecou",
    "porque começou",
    "por qual motivo",
    "associar",
    "relacionar",
    "tem relacao",
    "tem relação",
    "percebeu relacao",
    "percebeu relação",
    "algum evento",
    "alguma coisa aconteceu",
    "aconteceu algo",
    "depois de alguma coisa",
    "desencadeou",
    "gatilho",
    "causa",
    "motivo",
    "por causa",
    "related to",
    "associated with",
    "anything happen",
    "trigger",
    "cause",
    "why",
    "because of",
    "por que",
    "por qué",
    "porque aparecio",
    "porque apareció",
    "por que aparecio",
    "por qué apareció",
    "por que empezo",
    "por qué empezó",
    "relacionar",
    "asociar",
    "algún evento",
    "algun evento",
    "desencadeno",
    "gatillo",
    "causa"
  ].some((token) => normalizedQuestion.includes(normalize(token)));

  const hasOnsetFrame = [
    "surgimento",
    "surgiu",
    "aparece",
    "aparecer",
    "apareceu",
    "comecou",
    "começou",
    "inicio",
    "início",
    "ferida",
    "lesao",
    "lesão",
    "mancha",
    "onset",
    "started",
    "appeared",
    "sore",
    "lesion",
    "aparicion",
    "aparición",
    "empezo",
    "aparecio",
    "herida",
    "lesion"
  ].some((token) => normalizedQuestion.includes(normalize(token)));

  return hasAssociationFrame && hasOnsetFrame;
}

function answerHdaAxisQuestion(normalizedQuestion) {
  const axis = detectHdaQuestionAxis(normalizedQuestion);
  if (!axis) return "";
  if (!canAccessStage("currentIllness")) return stageLockedAnswer();

  const preferredKey = HDA_AXIS_INTENT_PREFERENCES[axis]
    .map((key) => resolveAvailableIntentKey(key))
    .find((key) => key && state.currentCase.hiddenData[key]?.group === "currentIllness");

  if (preferredKey) {
    return revealHiddenData([preferredKey, state.currentCase.hiddenData[preferredKey]], normalizedQuestion);
  }

  recordFlowStep("currentIllness", { suppressOutOfOrder: true });
  registerStructuredQuestion("currentIllness", `hdaAxis:${axis}`, normalizedQuestion);
  if (axis === "why") return triggerEventAnswer();
  return naturalNoDataAnswer("hda");
}

function detectHdaQuestionAxis(normalizedQuestion) {
  if (isGreetingQuestion(normalizedQuestion)) return "";

  const hasLesionContext = [
    "queixa",
    "problema",
    "lesao",
    "lesão",
    "ferida",
    "mancha",
    "bolha",
    "caroco",
    "caroço",
    "boca",
    "lingua",
    "língua",
    "labio",
    "lábio",
    "sore",
    "lesion",
    "spot",
    "lump",
    "mouth",
    "tongue",
    "lip",
    "problema",
    "lesion",
    "herida",
    "mancha",
    "bulto",
    "boca",
    "lengua",
    "labio"
  ].some((token) => normalizedQuestion.includes(normalize(token)));

  const axisPatterns = [
    {
      axis: "when",
      tokens: ["quando", "desde quando", "ha quanto", "há quanto", "quanto tempo", "when", "how long", "since when", "cuando", "cuándo", "desde cuando", "desde cuándo", "cuanto tiempo", "cuánto tiempo"]
    },
    {
      axis: "where",
      tokens: ["onde", "local", "lugar", "regiao", "região", "where", "location", "site", "donde", "dónde", "ubicacion", "ubicación", "sitio", "zona"]
    },
    {
      axis: "why",
      tokens: ["por que", "por quê", "porque apareceu", "porque surgiu", "por qual motivo", "causa", "motivo", "gatilho", "desencadeou", "associado", "relacionado", "why", "cause", "trigger", "because", "associated", "related", "por qué", "causa", "motivo", "gatillo", "desencadeno", "asociado", "relacionado"]
    },
    {
      axis: "how",
      tokens: ["como", "aparencia", "aparência", "aspecto", "evolucao", "evolução", "mudou", "cresceu", "aumentou", "diminuiu", "sintoma", "dor", "how", "appearance", "look", "evolution", "changed", "grew", "symptom", "pain", "como", "cómo", "aspecto", "evolucion", "evolución", "cambio", "crecio", "creció", "sintoma", "síntoma", "dolor"]
    }
  ];

  const match = axisPatterns.find((pattern) =>
    pattern.tokens.some((token) => normalizedQuestion.includes(normalize(token)))
  );
  if (!match) return "";
  if (
    match.axis === "why" ||
    currentExpectedStage() === "currentIllness" ||
    hasLesionContext ||
    detectAnamnesisGroup(normalizedQuestion) === "currentIllness"
  ) {
    return match.axis;
  }
  return "";
}

function isGreetingQuestion(normalizedQuestion) {
  return ["bom dia", "boa tarde", "boa noite", "tudo bem", "good morning", "good afternoon", "good evening", "how are you", "buenos dias", "buenas tardes", "buenas noches", "como esta"].some((token) =>
    normalizedQuestion.includes(normalize(token))
  );
}

function isMedicationQuestion(normalizedQuestion) {
  const medicationTokens = [
    "remedio de uso",
    "medicamento de uso",
    "usa remedio",
    "toma remedio",
    "toma medicamento",
    "medicamento continuo",
    "remedio continuo",
    "medication",
    "medicine",
    "regular medication",
    "current medication",
    "medicamento actual",
    "medicacion",
    "toma algun medicamento"
  ];

  return medicationTokens.some((token) => normalizedQuestion.includes(normalize(token)));
}

function previousCareAnswer() {
  const dental = state.currentCase.hiddenData.dentalGeneral;
  if (state.language === "en") {
    return dental
      ? `I have not had regular dental follow-up for this. ${localizedPatientDetailValue("dentalGeneral", dental)}.`
      : "I have not really seen another professional for this problem yet.";
  }
  if (state.language === "es") {
    return dental
      ? `No he tenido seguimiento odontológico regular por esto. ${localizedPatientDetailValue("dentalGeneral", dental)}.`
      : "Todavía no consulté realmente a otro profesional por este problema.";
  }
  return dental
    ? `${dental.answers[0]} Para este problema, eu procurei atendimento principalmente agora.`
    : "Ainda nao procurei outro profissional por esse problema.";
}

function previousTreatmentAnswer() {
  if (state.language === "en") {
    return "I have not used a specific treatment for this lesion unless I mentioned it before. I came because it was not improving.";
  }
  if (state.language === "es") {
    return "No usé un tratamiento específico para esta lesión, salvo que ya lo haya mencionado. Vine porque no mejoraba.";
  }
  return "Nao usei um tratamento especifico para essa lesao, a nao ser o que eu ja tenha comentado. Procurei atendimento porque nao estava melhorando.";
}

function previousSimilarLesionAnswer() {
  const complaint = localizedChiefComplaint(state.currentCase);
  if (state.language === "en") {
    return `Not like this. I may have had small mouth sores before, but nothing like this ${complaint}, lasting this long.`;
  }
  if (state.language === "es") {
    return `Así no. Ya tuve heridas pequeñas en la boca alguna vez, pero nada como esta ${complaint}, durando tanto.`;
  }
  return `Desse jeito, nao. Aftinha ou machucado pequeno eu ja tive, mas uma ${complaint} assim, persistindo desse jeito, nao me lembro.`;
}

function triggerEventAnswer() {
  if (state.language === "en") {
    return "I can't connect it to one clear event. At first I thought I had bitten the area, but it did not heal like a normal bite.";
  }
  if (state.language === "es") {
    return "No logro relacionarlo con un evento claro. Al principio pensé que me había mordido, pero no cicatrizó como una mordida normal.";
  }
  return "Nao consigo ligar a um evento certo. No comeco achei que eu tinha mordido ou machucado, mas nao sarou como um machucado comum.";
}

function detectSpecificClinicalIntent(normalizedQuestion) {
  const patternIntent = resolveAvailableIntentKey(detectPatternClinicalIntent(normalizedQuestion));
  if (patternIntent) {
    return patternIntent;
  }

  if (isOnsetQuestion(normalizedQuestion) && state.currentCase.hiddenData.duration) {
    return "duration";
  }

  const rule = CLINICAL_INTENT_RULES.find((item) =>
    item.tokens.some((token) => normalizedQuestion.includes(normalize(token))) &&
    state.currentCase.hiddenData[item.key]
  );

  return rule?.key || "";
}

function resolveAvailableIntentKey(key) {
  if (!key) return "";
  if (state.currentCase.hiddenData[key]) return key;
  const aliases = {
    tobacco: ["smoking", "habitsGeneral"],
    smoking: ["tobacco", "habitsGeneral"],
    alcohol: ["habitsGeneral"],
    pain: ["symptoms"],
    symptoms: ["pain"],
    appearance: ["texture", "ulcer", "lesions"],
    migration: ["frequency", "appearance"],
    feeding: ["pain", "symptoms"],
    bleeding: ["symptoms", "gingiva"],
    odor: ["symptoms"],
    fever: ["systemic"],
    lymphNodes: ["systemic"],
    hygiene: ["dentalGeneral", "habitsGeneral"],
    prosthesis: ["dentalGeneral"],
    trauma: ["dentalGeneral"],
    diet: ["habitsGeneral"],
    stress: ["habitsGeneral"],
    sun: ["habitsGeneral"],
    medications: ["medicalGeneral"],
    diabetes: ["medicalGeneral"],
    skin: ["systemic", "medicalGeneral"],
    systemic: ["medicalGeneral"]
  };
  return (aliases[key] || []).find((candidate) => state.currentCase.hiddenData[candidate]) || "";
}

function detectKnownClinicalTopic(normalizedQuestion) {
  if (detectPatternClinicalIntent(normalizedQuestion)) {
    return CLINICAL_INTENT_RULES.find((rule) => rule.key === detectPatternClinicalIntent(normalizedQuestion))?.topic || "hda";
  }

  if (isOnsetQuestion(normalizedQuestion)) return "hda";

  const rule = CLINICAL_INTENT_RULES.find((item) =>
    item.tokens.some((token) => normalizedQuestion.includes(normalize(token)))
  );
  return rule?.topic || rule?.key || "";
}

function isVagueJargonQuestion(normalizedQuestion) {
  const tokens = normalizedQuestion.split(" ").filter(Boolean);
  if (tokens.length > 2) return false;
  return [
    "frequencia",
    "evolucao",
    "localizacao",
    "sintomas",
    "agravantes",
    "linfonodo",
    "habitos",
    "antecedentes"
  ].some((token) => normalizedQuestion === token || normalizedQuestion.includes(token));
}

function clarificationAnswer(normalizedQuestion) {
  if (state.language === "en") {
    return "I did not quite understand it that way. Could you ask me in simpler words?";
  }
  if (state.language === "es") {
    return "No entendí muy bien de esa forma. ¿Puede preguntarme con palabras más simples?";
  }
  if (normalizedQuestion.includes("frequencia")) {
    return "Como assim frequencia, doutor? O senhor quer saber se essa ferida fica direto ou se vai e volta?";
  }
  return "Nao entendi muito bem desse jeito. Pode perguntar com palavras mais simples?";
}

function isOnsetQuestion(normalizedQuestion) {
  const hasOnsetVerb = ["apareceu", "surgiu", "comecou", "começou", "percebeu", "notou", "inicio", "início"].some((token) =>
    normalizedQuestion.includes(normalize(token))
  );
  const hasQuestionFrame = ["quando", "como", "desde quando", "ha quanto", "há quanto"].some((token) =>
    normalizedQuestion.includes(normalize(token))
  );
  return hasOnsetVerb && hasQuestionFrame;
}

function detectPatternClinicalIntent(normalizedQuestion) {
  const patterns = [
    {
      key: "duration",
      any: ["quando", "desde quando", "ha quanto", "há quanto", "quanto tempo", "como"],
      target: ["apareceu", "surgiu", "comecou", "começou", "percebeu", "notou", "inicio", "início"]
    },
    {
      key: "pain",
      any: ["doi", "dor", "arde", "ardencia", "ardor", "queima", "lateja", "coça", "coca", "formiga", "choque", "dormencia", "dormência", "incomoda"]
    },
    {
      key: "bleeding",
      any: ["sangra", "sangrou", "sangramento", "sangue"]
    },
    {
      key: "odor",
      any: ["mau halito", "mau hálito", "halito", "hálito", "cheiro ruim", "gosto ruim", "gosto amargo", "odor"]
    },
    {
      key: "feeding",
      any: ["mastigar", "engolir", "falar", "comer", "beber", "alimentar", "dificuldade para mastigar", "dificuldade para engolir", "dificuldade para falar"]
    },
    {
      key: "growth",
      any: ["aumentou", "aumenta", "cresceu", "cresce", "diminuiu", "diminui", "tamanho", "maior", "menor", "rapidamente", "lentamente"]
    },
    {
      key: "appearance",
      any: ["aparencia", "aparência", "aspecto", "cor", "vermelha", "vermelho", "branca", "branco", "azul", "roxa", "roxo", "endurecida", "endurecido", "dura", "duro", "mole", "secrecao", "secreção", "liquido", "líquido", "pus"]
    },
    {
      key: "migration",
      any: ["muda de lugar", "mudou de lugar", "muda de aparencia", "mudou de aparência", "desapareceu", "desaparece", "sumiu", "some", "voltou em outro lugar"]
    },
    {
      key: "frequency",
      any: ["recorrente", "volta", "voltou", "sempre aparece", "aparece de novo", "quantas vezes", "frequencia", "frequência"]
    },
    {
      key: "trauma",
      any: ["trauma", "morde", "mordeu", "mordida", "machucou", "bateu", "dente quebrado", "dente fraturado", "restauracao fraturada", "restauração fraturada", "aparelho machuca"]
    },
    {
      key: "prosthesis",
      any: ["protese", "prótese", "dentadura", "dorme com protese", "dorme com prótese", "machuca", "frouxa", "adaptada"]
    },
    {
      key: "scraping",
      any: ["raspa", "raspou", "raspagem", "sai quando raspa", "remove", "removivel", "removível", "gaze"]
    },
    {
      key: "fever",
      any: ["febre", "temperatura", "calafrio"]
    },
    {
      key: "systemic",
      any: ["emagreceu", "perdeu peso", "perda de peso", "tosse", "sudorese", "suor noturno", "diarreia", "hiv", "hpv", "hepatite", "sifilis", "sífilis", "tuberculose"]
    },
    {
      key: "lymphNodes",
      any: ["linfonodo", "ganglio", "gânglio", "caroco no pescoco", "caroço no pescoço", "pescoco inchado", "pescoço inchado"]
    },
    {
      key: "skin",
      any: ["pele", "corpo", "olho", "olhos", "genital", "lesao na pele", "lesão na pele", "olho seco", "olhos secos", "dor articular", "junta", "articulacao", "articulação", "fadiga"]
    },
    {
      key: "familyHistory",
      any: ["familia", "família", "familiar", "hereditario", "hereditário", "pai", "mae", "mãe", "irmao", "irmão", "irma", "irmã", "cancer na familia", "câncer na família", "cancer de boca", "melanoma", "linfoma", "diabetes na familia", "hipertensao na familia", "lupus", "lúpus", "psoriase", "psoríase"]
    },
    {
      key: "medicalGeneral",
      any: ["doenca", "doença", "saude", "saúde", "internado", "internacao", "internação", "cirurgia", "transfusao", "transfusão", "alergia", "diabetes", "hipotireoidismo", "osteoporose", "anemia", "lupus", "lúpus", "sjogren", "boca seca", "olho seco", "olhos secos", "xerostomia", "cancer", "câncer", "quimioterapia", "radioterapia", "bisfosfonato"]
    },
    {
      key: "medications",
      any: ["remedio", "remédio", "medicamento", "medicacao", "medicação", "toma algo", "usa algo", "antidepressivo", "imunossupressor", "corticoide", "anticonvulsivante", "anti hipertensivo", "anti-hipertensivo", "bisfosfonato", "quimioterapico", "quimioterápico", "antibiotico", "antibiótico"]
    },
  {
    key: "dentalGeneral",
    any: ["dentista", "ultima consulta", "última consulta", "biopsia oral", "canal", "extracao", "extração", "implante", "aparelho", "braquete", "atm", "estalo", "abertura bucal", "dor facial", "dentes moles", "perdeu dentes"]
  },
    {
      key: "hygiene",
      any: ["escova", "escovacao", "escovação", "fio dental", "enxaguante", "clareador", "higiene"]
    },
    {
      key: "tobacco",
      any: ["fuma", "fumante", "cigarro", "tabaco", "cigarro eletronico", "cigarro eletrônico", "narguile", "cachimbo", "tentou parar"]
    },
    {
      key: "smoking",
      any: ["fuma", "fumante", "cigarro", "tabaco", "cigarro eletronico", "cigarro eletrônico", "narguile", "cachimbo", "tentou parar"]
    },
    {
      key: "alcohol",
      any: ["alcool", "álcool", "bebe", "bebida", "cerveja", "cachaca", "cachaça", "destilado", "etilista"]
    },
    {
      key: "sun",
      any: ["sol", "exposicao solar", "exposição solar", "protetor", "fotoprotecao", "fotoproteção", "trabalho no sol", "lavoura", "rural"]
    },
    {
      key: "stress",
      any: ["estresse", "stress", "ansiedade", "sono", "privacao de sono", "privação de sono", "prova", "trabalho"]
    },
    {
      key: "diet",
      any: ["dieta", "alimentacao", "alimentação", "alimentos acidos", "alimentos ácidos", "alimentos quentes", "frutas", "vegetais", "acucar", "açúcar"]
    },
    {
      key: "habitsGeneral",
      any: ["maconha", "cocaina", "cocaína", "crack", "drogas", "range os dentes", "aperta os dentes", "morde objetos", "roe unhas", "sexo oral", "ist", "ists"]
    }
  ];

  const matched = patterns.find((pattern) => {
    const hasAny = pattern.any?.some((token) => normalizedQuestion.includes(normalize(token)));
    const hasTarget = !pattern.target || pattern.target.some((token) => normalizedQuestion.includes(normalize(token)));
    return hasAny && hasTarget;
  });

  return matched?.key || "";
}

function naturalNoDataAnswer(topic) {
  const answers = {
    pt: {
      default: "Nao percebi isso, pelo menos nao que eu tenha notado.",
      hda: "Nao reparei nisso acontecendo com essa lesao.",
      symptom: "Nao senti isso de forma clara.",
      temporal: "Nao lembro de isso ter comecado logo depois desse acontecimento.",
      treatment: "Nao fiz esse tipo de tratamento para isso.",
      family: "Que eu saiba, nao tem isso na minha familia.",
      medical: "Que eu saiba, nao tenho esse problema de saude.",
      dental: "Nao me lembro de ter passado por isso no dentista.",
      habit: "Nao tenho esse habito.",
      malignancy: "Ninguem me falou isso ainda, mas foi justamente por preocupacao que eu vim."
    },
    en: {
      default: "I haven't noticed that, at least not clearly.",
      hda: "I haven't noticed that happening with this lesion.",
      symptom: "I haven't clearly felt that.",
      temporal: "I don't remember it starting right after that.",
      treatment: "I haven't had that kind of treatment for this.",
      family: "As far as I know, that doesn't run in my family.",
      medical: "As far as I know, I don't have that health problem.",
      dental: "I don't remember going through that at the dentist.",
      habit: "I don't have that habit.",
      malignancy: "No one has told me that yet, but that concern is part of why I came in."
    },
    es: {
      default: "No he notado eso, al menos no claramente.",
      hda: "No he notado que eso pase con esta lesion.",
      symptom: "No he sentido eso de forma clara.",
      temporal: "No recuerdo que haya empezado justo despues de eso.",
      treatment: "No hice ese tipo de tratamiento para esto.",
      family: "Que yo sepa, eso no existe en mi familia.",
      medical: "Que yo sepa, no tengo ese problema de salud.",
      dental: "No recuerdo haber pasado por eso en el dentista.",
      habit: "No tengo ese habito.",
      malignancy: "Nadie me dijo eso todavia, pero esa preocupacion es parte de por que vine."
    }
  };

  return answers[state.language]?.[topic] || answers[state.language]?.default || answers.pt.default;
}

const CLINICAL_INTENT_RULES = [
  {
    key: "duration",
    topic: "hda",
    tokens: ["quanto tempo", "quando comecou", "quando começou", "quando percebeu", "quando apareceu", "quando ela apareceu", "quando a lesao apareceu", "quando a lesão apareceu", "quando surgiu", "como comecou", "como começou", "como apareceu", "como surgiu", "desde quando", "ha quanto", "há quanto", "duracao", "duração", "inicio", "início", "evolucao", "evolução", "surgiu de repente", "surgiu lentamente", "piora recente", "how long", "when did it start", "when did you notice", "when did it appear", "how did it start", "how did it appear", "since when", "suddenly", "slowly", "recently worse", "cuanto tiempo", "desde cuando", "cuando empezo", "cuando empezó", "cuando aparecio", "cuando apareció", "como empezo", "como empezó", "como aparecio", "como apareció", "cuando noto", "duracion", "duración", "de repente", "lentamente", "empeoro recientemente"]
  },
  {
    key: "growth",
    topic: "hda",
    tokens: ["cresceu", "cresce", "aumentou", "aumenta", "diminuiu", "tamanho", "rapidamente", "lentamente", "growth", "grew", "growing", "bigger", "smaller", "size", "rapidly", "slowly", "crecio", "crece", "aumento", "aumenta", "disminuyo", "tamano", "rapidamente", "lentamente"]
  },
  {
    key: "migration",
    topic: "hda",
    tokens: ["muda de lugar", "muda de aparencia", "desapareceu", "desaparece", "sumiu", "volta em outro lugar", "changes location", "changes appearance", "disappeared", "goes away", "moves", "cambia de lugar", "cambia de aspecto", "desaparecio", "desaparece", "se mueve"]
  },
  {
    key: "frequency",
    topic: "hda",
    tokens: ["frequencia", "volta", "recorrente", "sempre aparece", "ja aconteceu antes", "frequency", "comes back", "recurrent", "recurs", "happened before", "frecuencia", "vuelve", "recurrente", "ya paso antes"]
  },
  {
    key: "pain",
    topic: "symptom",
    tokens: ["doi", "dor", "arde", "ardencia", "queima", "incomoda", "lateja", "coça", "formiga", "choque", "dormencia", "pain", "hurt", "burn", "burning", "throbs", "itches", "tingling", "shock", "numbness", "duele", "dolor", "arde", "ardor", "late", "pica", "hormigueo", "corrientazo", "adormecimiento"]
  },
  {
    key: "bleeding",
    topic: "symptom",
    tokens: ["sangra", "sangramento", "bleed", "bleeding", "sangra", "sangrado"]
  },
  {
    key: "odor",
    topic: "symptom",
    tokens: ["mau halito", "gosto ruim", "halito", "cheiro", "bad breath", "bad taste", "odor", "smell", "mal aliento", "mal sabor", "olor"]
  },
  {
    key: "feeding",
    topic: "symptom",
    tokens: ["mastigar", "engolir", "falar", "comer", "beber", "alimentar", "chew", "swallow", "speak", "talk", "eat", "drink", "masticar", "tragar", "hablar", "comer", "beber"]
  },
  {
    key: "appearance",
    topic: "hda",
    tokens: ["aparencia", "aspecto", "cor", "parece", "muda de cor", "endurecida", "mole", "dura", "secrecao", "liquido", "rompe", "appearance", "look", "color", "changes color", "hard", "soft", "secretion", "fluid", "ruptures", "aspecto", "color", "cambia de color", "dura", "blanda", "secrecion", "liquido", "se rompe"]
  },
  {
    key: "ulcer",
    topic: "hda",
    tokens: ["fissura", "ulcera", "ferida abre", "cicatriza", "crack", "ulcer", "open sore", "heals", "fisura", "ulcera", "cicatriza"]
  },
  {
    key: "location",
    topic: "hda",
    tokens: ["onde", "local", "lugar", "regiao", "where", "location", "site", "donde", "ubicacion", "sitio", "zona"]
  },
  {
    key: "trauma",
    topic: "temporal",
    tokens: ["trauma", "bateu", "machucou", "mordeu", "morde", "mordida", "dente quebrado", "restauracao fraturada", "after trauma", "injury", "biting", "broken tooth", "fractured restoration", "trauma", "golpe", "lastimo", "mordida", "diente roto", "restauracion fracturada"]
  },
  {
    key: "prosthesis",
    topic: "temporal",
    tokens: ["protese", "dentadura", "dorme com protese", "protese machuca", "protese frouxa", "denture", "prosthesis", "sleep with denture", "loose denture", "protesis", "dentadura", "duerme con protesis", "protesis floja"]
  },
  {
    key: "stress",
    topic: "temporal",
    tokens: ["estresse", "ansiedade", "sono", "stress", "anxiety", "sleep", "estres", "ansiedad", "sueno"]
  },
  {
    key: "sun",
    topic: "temporal",
    tokens: ["sol", "exposicao solar", "protetor", "trabalho no sol", "sun", "sun exposure", "sunscreen", "work in the sun", "sol", "exposicion solar", "protector", "trabajo al sol"]
  },
  {
    key: "medications",
    topic: "temporal",
    tokens: ["antibiotico", "corticoide", "imunossupressor", "anticonvulsivante", "antidepressivo", "anti hipertensivo", "bisfosfonato", "quimioterapico", "antibiotic", "steroid", "immunosuppressant", "anticonvulsant", "antidepressant", "antihypertensive", "bisphosphonate", "chemotherapy drug", "antibiotico", "corticoide", "inmunosupresor", "anticonvulsivo", "antidepresivo", "antihipertensivo", "bisfosfonato", "quimioterapico"]
  },
  {
    key: "scraping",
    topic: "hda",
    tokens: ["raspa", "raspagem", "sai", "remove", "gaze", "scrape", "wipe off", "come off", "gauze", "raspa", "raspado", "sale", "gasa"]
  },
  {
    key: "fever",
    topic: "symptom",
    tokens: ["febre", "temperatura", "calafrio", "fever", "temperature", "chills", "fiebre", "temperatura", "escalofrio"]
  },
  {
    key: "systemic",
    topic: "medical",
    tokens: ["diarreia", "perda de peso", "emagreceu", "tosse", "sudorese noturna", "hiv", "hpv", "hepatite", "sifilis", "tuberculose", "diarrhea", "weight loss", "lost weight", "cough", "night sweats", "hiv", "hpv", "hepatitis", "syphilis", "tuberculosis", "diarrea", "perdida de peso", "adelgazo", "tos", "sudoracion nocturna", "vih", "vph", "hepatitis", "sifilis", "tuberculosis"]
  },
  {
    key: "lymphNodes",
    topic: "malignancy",
    tokens: ["linfonodo", "ganglio", "caroco no pescoco", "pescoco inchado", "lymph node", "neck lump", "swollen neck", "ganglio", "bulto en el cuello", "cuello hinchado"]
  },
  {
    key: "familyHistory",
    topic: "family",
    tokens: ["familia", "familiar", "hereditario", "diabetes na familia", "hipertensao na familia", "autoimune", "lupus", "psoriase", "sjogren", "cancer na familia", "cancer de boca", "melanoma", "linfoma", "neurofibromatose", "peutz", "displasia fibrosa", "sindrome genetica", "family", "relative", "hereditary", "autoimmune", "lupus", "psoriasis", "sjogren", "cancer in the family", "oral cancer", "melanoma", "lymphoma", "neurofibromatosis", "genetic syndrome", "familia", "familiar", "hereditario", "autoinmune", "lupus", "psoriasis", "sjogren", "cancer en la familia", "cancer oral", "melanoma", "linfoma", "neurofibromatosis", "sindrome genetico"]
  },
  {
    key: "medicalGeneral",
    topic: "medical",
    tokens: ["alguma doenca", "internado", "internacao", "cirurgia", "transfusao", "alergia", "diabetes", "hipotireoidismo", "osteoporose", "anemia", "deficiencia vitaminica", "artrite", "lupus", "sjogren", "doenca celiaca", "psoriase", "doenca inflamatoria intestinal", "cancer", "quimioterapia", "radioterapia", "boca seca", "olho seco", "xerostomia", "any disease", "hospitalized", "surgery", "transfusion", "allergy", "diabetes", "hypothyroidism", "osteoporosis", "anemia", "vitamin deficiency", "arthritis", "celiac", "psoriasis", "cancer", "chemotherapy", "radiotherapy", "dry mouth", "dry eyes", "xerostomia", "enfermedad", "internado", "cirugia", "transfusion", "alergia", "diabetes", "hipotiroidismo", "osteoporosis", "anemia", "deficiencia vitaminica", "artritis", "celiaca", "psoriasis", "cancer", "quimioterapia", "radioterapia", "boca seca", "ojos secos", "xerostomia"]
  },
  {
    key: "diabetes",
    topic: "medical",
    tokens: ["diabetes", "glicose", "glicemia", "acucar", "diabetes", "glucose", "blood sugar", "diabetes", "glucosa", "azucar"]
  },
  {
    key: "dentalGeneral",
    topic: "dental",
    tokens: ["frequencia vai ao dentista", "ultima consulta", "biopsia oral", "tratamento odontologico", "canal", "extracao", "implante", "complicacao apos extracao", "aparelho", "braquete", "atm", "estalo", "abertura bucal", "dor facial", "dentist frequency", "last dental visit", "oral biopsy", "root canal", "extraction", "implant", "bracket", "tmj", "clicking", "mouth opening", "facial pain", "frecuencia va al dentista", "ultima consulta", "biopsia oral", "conducto", "extraccion", "implante", "bracket", "atm", "chasquido", "apertura bucal", "dolor facial"]
  },
  {
    key: "bleeding",
    topic: "dental",
    tokens: ["gengiva sangra", "dente mole", "perdeu dentes", "mau halito", "gum bleeding", "loose teeth", "lost teeth", "bad breath", "encia sangra", "dientes flojos", "perdio dientes", "mal aliento"]
  },
  {
    key: "hygiene",
    topic: "dental",
    tokens: ["escova", "fio dental", "enxaguante", "clareador", "brush", "floss", "mouthwash", "whitening", "cepilla", "hilo dental", "enjuague", "blanqueador"]
  },
  {
    key: "tobacco",
    topic: "habit",
    tokens: ["fuma", "cigarro", "tabaco", "fumante", "cigarro eletronico", "narguile", "cachimbo", "tentou parar", "smoke", "smoking", "cigarette", "e cigarette", "vape", "hookah", "pipe", "tried to quit", "fuma", "cigarrillo", "tabaco", "cigarrillo electronico", "narguile", "pipa", "intento dejar"]
  },
  {
    key: "smoking",
    topic: "habit",
    tokens: ["fuma", "cigarro", "tabaco", "fumante", "cigarro eletronico", "narguile", "cachimbo", "tentou parar", "smoke", "smoking", "cigarette", "e cigarette", "vape", "hookah", "pipe", "tried to quit", "fuma", "cigarrillo", "tabaco", "cigarrillo electronico", "narguile", "pipa", "intento dejar"]
  },
  {
    key: "alcohol",
    topic: "habit",
    tokens: ["bebe", "alcool", "bebida", "cachaca", "cerveja", "frequencia bebe", "tipo de bebida", "drink alcohol", "alcohol", "beer", "type of drink", "frequency", "bebe", "alcohol", "bebida", "cerveza", "frecuencia", "tipo de bebida"]
  },
  {
    key: "habitsGeneral",
    topic: "habit",
    tokens: ["maconha", "cocaina", "crack", "drogas", "range os dentes", "aperta os dentes", "morde objetos", "roe unhas", "sexo oral", "ist", "marijuana", "cocaine", "crack", "drugs", "grinds teeth", "clenches teeth", "bites objects", "bites nails", "oral sex", "sti", "marihuana", "cocaina", "crack", "drogas", "rechinar dientes", "apretar dientes", "muerde objetos", "muerde unas", "sexo oral", "its"]
  },
  {
    key: "diet",
    topic: "habit",
    tokens: ["alimentos quentes", "alimentos acidos", "frutas", "vegetais", "acucar", "hot foods", "acidic foods", "fruit", "vegetables", "sugar", "alimentos calientes", "alimentos acidos", "frutas", "vegetales", "azucar"]
  }
];

function revealHiddenData(matched, normalizedQuestion) {
  const [key, item] = matched;
  const groupId = item.group || detectAnamnesisGroup(normalizedQuestion);
  const isHdaAxisQuestion = groupId === "currentIllness" && Boolean(detectHdaQuestionAxis(normalizedQuestion));
  recordFlowStep(groupId, { suppressOutOfOrder: isHdaAxisQuestion });
  const askedCount = state.askedIntents.get(key) || 0;
  state.askedIntents.set(key, askedCount + 1);
  registerStructuredQuestion(groupId, key, normalizedQuestion);
  const wasRevealed = state.revealed.has(key);
  state.revealed.add(key);
  queueAnamnesisUpdate(key, item, wasRevealed);
  renderChart();
  renderProgress();
  renderPhysicalExam();
  updateEmotionForKey(key);
  state.pendingClinicalDatum = clinicalDatumPayload(key, item, { askedCount, wasRevealed });

  const answerIndex = Math.min(askedCount, item.answers.length - 1);
  return patientAnswerText(item, item.answers[answerIndex], { askedCount, wasRevealed });
}

function clinicalDatumPayload(key, item, context = {}) {
  return {
    key,
    label: localizedFieldLabel(key, item),
    value: localizedFieldValue(key, item),
    category: item.category,
    group: item.group,
    wasRevealed: Boolean(context.wasRevealed),
    questionCount: (context.askedCount || 0) + 1
  };
}

function answerGroupQuestion(groupId) {
  if (!canAccessStage(groupId)) return stageLockedAnswer();
  recordFlowStep(groupId);
  const entries = orderedGroupEntries(groupId);
  const unrevealed = entries.filter(([key]) => !state.revealed.has(key));
  const selected = (unrevealed.length ? unrevealed : entries)[0];
  if (!selected) return "";

  return revealHiddenData(selected, groupId);
}

function orderedGroupEntries(groupId) {
  const preferred = {
    currentIllness: ["duration", "symptoms", "pain", "appearance", "growth", "frequency", "treatmentHistory", "location", "bleeding", "odor", "feeding"],
    familyHistory: ["familyHistory"],
    medicalHistory: ["medicalGeneral", "medications", "diabetes", "systemic", "skin", "atopy"],
    dentalHistory: ["dentalGeneral", "prosthesis", "trauma", "hygiene"],
    habits: ["habitsGeneral", "tobacco", "smoking", "alcohol", "sun", "stress", "diet"]
  };
  const entries = Object.entries(state.currentCase.hiddenData).filter(([, item]) => item.group === groupId);
  const order = preferred[groupId] || [];
  return entries.sort((a, b) => {
    const ai = order.indexOf(a[0]);
    const bi = order.indexOf(b[0]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

function detectAnamnesisGroup(normalizedQuestion) {
  const step = ANAMNESIS_FLOW.find((item) =>
    [
      ...item.keywords,
      ...(FLOW_KEYWORDS.en[item.id] || []),
      ...(FLOW_KEYWORDS.es[item.id] || [])
    ].some((keyword) => normalizedQuestion.includes(normalize(keyword)))
  );
  return step?.id || null;
}

function recordFlowStep(groupId, options = {}) {
  if (!groupId || !FLOW_TRANSLATIONS[groupId]) return;
  const expectedStage = currentExpectedStage();
  if (!options.suppressOutOfOrder && expectedStage && groupId !== expectedStage) {
    state.outOfOrderEvents.push({
      groupId,
      expectedStage,
      questionNumber: state.transcript.filter((entry) => entry.kind === "student").length
    });
  }
  state.flowEvents.push(groupId);
  renderFlow();
}

function getUniqueFlowEvents() {
  return state.flowEvents.filter((item, index) => state.flowEvents.indexOf(item) === index);
}

function findMatchingHiddenData(normalizedQuestion) {
  return findBestHiddenDataMatch(normalizedQuestion, Object.entries(state.currentCase.hiddenData));
}

function findMatchingHiddenDataInGroup(normalizedQuestion, groupId) {
  const entries = Object.entries(state.currentCase.hiddenData).filter(([, item]) => item.group === groupId);
  return findBestHiddenDataMatch(normalizedQuestion, entries);
}

function findBestHiddenDataMatch(normalizedQuestion, entries) {
  const candidates = entries
    .map(([key, item]) => {
      const score = item.keywords.reduce((total, keyword) => {
        const variants = [keyword, clinicalText(keyword)];
        const matchedVariant = variants.find((variant) => normalizedQuestion.includes(normalize(variant)));
        if (!matchedVariant) return total;

        const normalizedKeyword = normalize(keyword);
        const isGeneric = GENERIC_MATCH_KEYWORDS.has(normalizedKeyword);
        const wordCount = normalizedKeyword.split(" ").length;
        const weight = isGeneric ? 0.25 : Math.max(1, wordCount);
        return total + weight;
      }, 0);
      return { key, item, score };
    })
    .filter((entry) => entry.score >= 1)
    .sort((a, b) => b.score - a.score);

  if (!candidates.length) return null;
  return [candidates[0].key, candidates[0].item];
}

function findFlexibleHiddenData(normalizedQuestion) {
  const tokens = normalizedQuestion.split(" ").filter((token) => token.length >= 4);
  const meaningfulTokens = tokens.filter((token) => !QUESTION_STOPWORDS.has(token));
  if (meaningfulTokens.length < 2) return null;

  const scored = Object.entries(state.currentCase.hiddenData)
    .filter(([key]) => !state.revealed.has(key))
    .map(([key, item]) => {
      const haystack = normalize(
        [item.label, item.value, item.category, item.keywords.join(" ")].join(" ")
      );
      const score = meaningfulTokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
      return { key, item, score };
    })
    .filter((entry) => entry.score >= 2)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  return [scored[0].key, scored[0].item];
}

const QUESTION_STOPWORDS = new Set([
  "voce",
  "voces",
  "senhor",
  "senhora",
  "algum",
  "alguma",
  "outro",
  "outra",
  "coisa",
  "sobre",
  "para",
  "porque",
  "quando",
  "como",
  "qual",
  "quais",
  "teve",
  "tem",
  "esta",
  "isso",
  "esse",
  "essa",
  "profissional",
  "atendimento",
  "patient",
  "about",
  "what",
  "when",
  "where",
  "have",
  "with",
  "this",
  "that",
  "another",
  "professional",
  "consulta",
  "consulto",
  "usted",
  "algo",
  "otro",
  "otra",
  "este",
  "esta"
]);

const GENERIC_MATCH_KEYWORDS = new Set([
  "doenca",
  "saude",
  "remedio",
  "medicamento",
  "historia medica",
  "historia odontologica",
  "tratamento odontologico",
  "dentista",
  "habito",
  "habitos",
  "local",
  "aspecto",
  "sintoma",
  "dor",
  "doi",
  "tempo",
  "quando"
]);

function genericAnswer(normalizedQuestion) {
  if (["nome", "name", "nombre"].some((token) => normalizedQuestion.includes(token))) {
    const intro = { pt: "Meu nome e", en: "My name is", es: "Mi nombre es" }[state.language];
    return `${intro} ${state.currentCase.patient.name}.`;
  }

  if (["idade", "age", "edad"].some((token) => normalizedQuestion.includes(token))) {
    const ageText = {
      pt: `Tenho ${state.currentCase.patient.age} anos.`,
      en: `I am ${state.currentCase.patient.age} years old.`,
      es: `Tengo ${state.currentCase.patient.age} años.`
    };
    return ageText[state.language];
  }

  if (["bom dia", "tudo bem", "good morning", "how are you", "buenos dias", "como esta"].some((token) => normalizedQuestion.includes(token))) {
    return {
      pt: "Tudo bem... quer dizer, estou um pouco preocupado com isso na boca.",
      en: "I'm okay... I mean, I am a little worried about this in my mouth.",
      es: "Estoy bien... bueno, estoy un poco preocupado por esto en la boca."
    }[state.language];
  }

  if (
    normalizedQuestion.includes("queixa") ||
    normalizedQuestion.includes("problema") ||
    normalizedQuestion.includes("motivo") ||
    normalizedQuestion.includes("acontecendo") ||
    normalizedQuestion.includes("complaint") ||
    normalizedQuestion.includes("problem") ||
    normalizedQuestion.includes("reason") ||
    normalizedQuestion.includes("motivo") ||
    normalizedQuestion.includes("problema")
  ) {
    return {
      pt: `O principal e isso: ${state.currentCase.chiefComplaint}. Foi por isso que procurei atendimento.`,
      en: `The main issue is a mouth problem related to ${clinicalText(state.currentCase.diagnosis)}. That is why I came for care.`,
      es: `Lo principal es un problema en la boca relacionado con ${clinicalText(state.currentCase.diagnosis)}. Por eso busque atencion.`
    }[state.language];
  }

  if (
    normalizedQuestion.includes("pode explicar") ||
    normalizedQuestion.includes("conte") ||
    normalizedQuestion.includes("fale mais") ||
    normalizedQuestion.includes("me diga") ||
    normalizedQuestion.includes("explain") ||
    normalizedQuestion.includes("tell me") ||
    normalizedQuestion.includes("cuenteme") ||
    normalizedQuestion.includes("explique")
  ) {
    return answerNextHelpfulDetail();
  }

  if (["abrir a boca", "examinar", "open your mouth", "examine", "abrir la boca", "examinar"].some((token) => normalizedQuestion.includes(token))) {
    return {
      pt: "Posso abrir sim. So esta incomodando quando encosta nessa regiao.",
      en: "Yes, I can open my mouth. It only bothers me when something touches that area.",
      es: "Si, puedo abrir la boca. Solo molesta cuando toca esa region."
    }[state.language];
  }

  if (
    normalizedQuestion.includes("tratamento odontologico") ||
    normalizedQuestion.includes("dentista") ||
    normalizedQuestion.includes("canal") ||
    normalizedQuestion.includes("extracao")
  ) {
    return {
      pt: "Faz tempo que eu nao vou ao dentista com regularidade. So procuro quando incomoda.",
      en: "It has been a long time since I went to the dentist regularly. I usually only go when something bothers me.",
      es: "Hace tiempo que no voy al dentista con regularidad. Solo busco atencion cuando algo molesta."
    }[state.language];
  }

  return genericUnclearAnswer(normalizedQuestion);
}

function genericUnclearAnswer(normalizedQuestion) {
  const complaint = localizedChiefComplaint(state.currentCase);
  const ptAnswers = [
    `Nao sei responder isso com certeza. O que mais me chamou atencao foi a ${complaint} que nao melhora.`,
    "Pode perguntar de outro jeito? Eu fico meio inseguro para explicar, mas tento lembrar.",
    "Nao reparei nesse detalhe. Eu percebi mais o incomodo na boca e a demora para sarar.",
    "Isso eu nao consigo afirmar. Nao quero inventar uma resposta."
  ];
  const enAnswers = [
    `I'm not sure about that. What I noticed most was the ${complaint} not getting better.`,
    "Could you ask that another way? I get unsure when trying to explain, but I can try to remember.",
    "I did not notice that detail. I mostly noticed the mouth discomfort and that it was slow to heal.",
    "I can't say that for sure. I do not want to make something up."
  ];
  const esAnswers = [
    `No estoy seguro de eso. Lo que más noté fue la ${complaint} que no mejora.`,
    "¿Puede preguntarlo de otra forma? Me siento inseguro al explicarlo, pero intento recordar.",
    "No noté ese detalle. Noté más la molestia en la boca y que tardaba en cicatrizar.",
    "Eso no puedo afirmarlo. No quiero inventar una respuesta."
  ];
  const answerBank = { pt: ptAnswers, en: enAnswers, es: esAnswers }[state.language] || ptAnswers;
  const index = Math.abs(hashText(normalizedQuestion) + state.transcript.length) % answerBank.length;
  return answerBank[index];
}

function hashText(text) {
  return text.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function answerNextHelpfulDetail() {
  const orderedGroups = state.currentCase.anamnesisOrder || ANAMNESIS_FLOW.map((step) => step.id);
  for (const group of orderedGroups) {
    const next = Object.entries(state.currentCase.hiddenData).find(
      ([key, item]) => item.group === group && item.required && !state.revealed.has(key)
    );
    if (next) {
      return revealHiddenData(next, "");
    }
  }

  const optional = Object.entries(state.currentCase.hiddenData).find(([key]) => !state.revealed.has(key));
  return optional ? revealHiddenData(optional, "") : "";
}

function updateEmotionForKey(key) {
  if (["pain", "thermalPain", "nightPain"].includes(key)) {
    setEmotion("dor");
    return;
  }

  if (["tobacco", "alcohol", "weightLoss", "lymphNodes", "fear"].includes(key)) {
    setEmotion("ansioso");
    return;
  }

  setEmotion("neutro");
}

function setEmotion(emotion) {
  els.avatar.classList.toggle("anxious", emotion === "ansioso");
  els.avatar.classList.toggle("pain", emotion === "dor");
  const labels = {
    ansioso: t("anxious"),
    dor: t("pain"),
    neutro: t("neutral")
  };
  els.emotionBadge.textContent = labels[emotion] || "Neutro";
}

function updateAvatarProfile() {
  const patient = state.currentCase.patient;
  const ageClass = getAgeClass(patient.age);
  const genderClass = normalize(patient.gender).includes("feminino") ? "female" : "male";
  els.avatar.className = `avatar photo-avatar ${genderClass} ${ageClass}`;
  els.patientImage.src = patient.image || imageForPatient(patient);
  els.patientImage.alt = `${patient.name}, ${t("patient").toLowerCase()} ${clinicalText(patient.gender)}, ${patient.age} ${t("years")}`;
}

function imageForPatient(patient) {
  const gender = normalize(patient.gender).includes("feminino") ? "female" : "male";
  if (patient.age < 18) return `assets/patients/child_${gender}.png`;
  if (patient.age >= 60) return `assets/patients/older_${gender}.png`;
  return `assets/patients/adult_${gender}.png`;
}

function getAgeClass(age) {
  if (age < 13) return "child";
  if (age < 20) return "teen";
  if (age < 60) return "adult";
  return "older";
}

els.finishBtn.addEventListener("click", () => {
  const report = evaluateCase();
  state.lastReport = report;
  renderReport(report);
  setOsceStatus("Avaliação gerada. Salve ou exporte o registro OSCE.");
});

function evaluateCase() {
  const caseItem = state.currentCase;
  const criticalFound = caseItem.criticalQuestions.filter((key) => state.revealed.has(key));
  const correctActions = caseItem.criticalActions.filter((action) => state.selectedActions.has(action));
  const unsafeActions = Array.from(state.selectedActions).filter(
    (action) =>
      action.includes("sem investigacao") ||
      action.includes("unica conduta") ||
      action.includes("clareamento")
  );
  const diagnosisHit = state.selectedHypotheses.has(caseItem.diagnosis);
  const sequenceReport = evaluateSequence();
  const domainReports = domainCoverageReports();
  const domainAverage = domainReports.length
    ? Math.round(domainReports.reduce((total, domain) => total + domain.coverage, 0) / domainReports.length)
    : 0;

  let score = 0;
  score += Math.round(domainAverage * 0.35);
  score += diagnosisHit ? 25 : 0;
  score += Math.round((correctActions.length / caseItem.criticalActions.length) * 20);
  score += sequenceReport.score;
  score += Math.min(state.transcript.filter((entry) => entry.kind === "student").length, 5) * 2;
  score -= unsafeActions.length * 12;
  score = Math.max(0, Math.min(100, score));

  const omitted = caseItem.criticalQuestions
    .filter((key) => !state.revealed.has(key))
    .map((key) => localizedFieldLabel(key, caseItem.hiddenData[key]));

  const missedActions = caseItem.criticalActions
    .filter((action) => !state.selectedActions.has(action))
    .map((action) => clinicalText(action));
  const translatedUnsafeActions = unsafeActions.map((action) => clinicalText(action));

  return {
    score,
    diagnosisHit,
    criticalFound,
    omitted,
    correctActions,
    missedActions,
    unsafeActions: translatedUnsafeActions,
    sequenceReport,
    domainReports,
    communicationScore: interviewCommunicationScore(),
    riskFactorScore: riskFactorInvestigationScore(),
    tutorFeedback: tutorFeedback(domainReports, diagnosisHit),
    soap: buildSoap()
  };
}

function interviewCommunicationScore() {
  const studentQuestions = state.transcript.filter((entry) => entry.kind === "student").map((entry) => normalize(entry.text));
  if (!studentQuestions.length) return 0;
  const openQuestions = studentQuestions.filter((text) =>
    ["conte", "explique", "como", "o que", "me fale", "tell me", "explain", "cuenteme"].some((token) => text.includes(normalize(token)))
  ).length;
  const followUps = Array.from(state.askedIntents.values()).filter((count) => count > 1).length;
  const score = 2 + Math.min(openQuestions, 2) + Math.min(followUps, 2);
  return Math.max(1, Math.min(5, score));
}

function riskFactorInvestigationScore() {
  const riskKeys = ["tobacco", "smoking", "alcohol", "sun", "habitsGeneral", "familyHistory", "weightLoss", "lymphNodes"];
  const available = riskKeys.filter((key) => state.currentCase.hiddenData[key]);
  if (!available.length) return 0;
  const covered = available.filter((key) => state.revealed.has(key)).length;
  return Math.max(1, Math.round((covered / available.length) * 5));
}

function tutorFeedback(domainReports, diagnosisHit) {
  const lowDomains = domainReports.filter((domain) => domain.coverage < 70).map((domain) => flowLabel(domain.groupId));
  const habits = domainReports.find((domain) => domain.groupId === "habits");
  const hda = domainReports.find((domain) => domain.groupId === "currentIllness");
  const comments = [];
  if (hda?.coverage >= 80) {
    comments.push("Voce conduziu bem a investigacao da queixa principal.");
  }
  if (lowDomains.length) {
    comments.push(`Precisa aprofundar: ${lowDomains.join(", ")}.`);
  }
  if (habits && habits.coverage < 80) {
    comments.push("Em lesoes cronicas de boca, a investigacao de habitos e fatores de risco deve ser mais completa.");
  }
  if (!diagnosisHit) {
    comments.push("Revise a correlacao entre ulcera cronica, fatores de risco, perda de peso e linfonodos cervicais.");
  }
  return comments.join(" ") || "Entrevista clinica bem conduzida, com cobertura adequada dos dominios essenciais.";
}

function evaluateSequence() {
  const unique = getUniqueFlowEvents();
  const missing = ANAMNESIS_FLOW.filter((step) => !unique.includes(step.id)).map((step) => flowLabel(step.id));
  const expectedIds = ANAMNESIS_FLOW.map((step) => step.id);
  const outOfOrder = state.outOfOrderEvents.map((event) =>
    `${flowLabel(event.groupId)} antes de completar ${flowLabel(event.expectedStage)}`
  );
  let orderedCount = 0;
  for (let i = 0; i < expectedIds.length; i += 1) {
    if (unique[i] === expectedIds[i]) orderedCount += 1;
  }
  const sequencePenalty = Math.min(outOfOrder.length * 2, 6);
  const score = Math.max(0, Math.round((orderedCount / expectedIds.length) * 10) - sequencePenalty);
  const observed = unique.map((id) => flowLabel(id)).join(" > ") || t("noStep");
  return { score, missing, observed, outOfOrder };
}

function buildSoap() {
  const revealedText = Array.from(state.revealed)
    .map((key) => {
      const item = state.currentCase.hiddenData[key];
      return `${localizedFieldLabel(key, item)}: ${localizedFieldValue(key, item)}`;
    })
    .join("; ");
  const hypotheses = Array.from(state.selectedHypotheses).map(clinicalText).join(", ") || t("notInformed");
  const actions = Array.from(state.selectedActions).map(clinicalText).join(", ") || t("notInformed");

  return {
    S: `${localizedChiefComplaint(state.currentCase)} ${revealedText || t("insufficientSubjective")}`,
    O: t("objectiveSoap"),
    A: hypotheses,
    P: actions
  };
}

function renderReport(report) {
  const omitted = report.omitted.length ? report.omitted.join(", ") : t("noOmitted");
  const missed = report.missedActions.length ? report.missedActions.join(", ") : t("noMissed");
  const unsafe = report.unsafeActions.length ? report.unsafeActions.join(", ") : t("noUnsafe");
  const diagnosis = report.diagnosisHit ? t("diagnosisHit") : t("diagnosisMiss");
  const missingFlow = report.sequenceReport.missing.length
    ? report.sequenceReport.missing.join(", ")
    : t("allSteps");
  const sequenceAlerts = report.sequenceReport.outOfOrder.length
    ? report.sequenceReport.outOfOrder.join("; ")
    : t("noSequenceAlerts");
  const domainTable = report.domainReports.map((domain) => {
    const investigated = domain.requiredEntries
      .filter(([key]) => state.revealed.has(key))
      .map(([key, item]) => `<li class="done">Investigou ${localizedFieldLabel(key, item)}</li>`)
      .join("");
    const missing = domain.requiredEntries
      .filter(([key]) => !state.revealed.has(key))
      .map(([key, item]) => `<li>Nao investigou ${localizedFieldLabel(key, item)}</li>`)
      .join("");
    return `
      <div class="domain-report">
        <div class="domain-report-head">
          <strong>${flowLabel(domain.groupId)}</strong>
          <span>${(domain.coverage / 10).toFixed(1).replace(".", ",")}</span>
        </div>
        <div class="coverage-bar report-bar"><span style="width: ${domain.coverage}%"></span></div>
        <ul>${investigated}${missing}</ul>
      </div>
    `;
  }).join("");

  els.report.innerHTML = `
    <div class="score">${t("score")} ${report.score}/100</div>
    <div class="feedback-card"><strong>${t("student")}</strong>${state.student.name || t("studentMissing")} ${state.student.id ? `(${state.student.id})` : ""}${state.student.college ? ` - ${state.student.college}` : ""}</div>
    <div class="feedback-card"><strong>Cobertura da anamnese</strong>${domainTable}</div>
    <div class="feedback-card"><strong>Comunicacao clinica</strong>${starRating(report.communicationScore)}</div>
    <div class="feedback-card"><strong>Investigacao de fatores de risco</strong>${starRating(report.riskFactorScore)}</div>
    <div class="feedback-card"><strong>${t("diagnosis")}</strong>${diagnosis}. ${t("expectedDiagnosis")}: ${clinicalText(state.currentCase.diagnosis)}.</div>
    <div class="feedback-card"><strong>${t("sequence")}</strong>${t("observedOrder")}: ${report.sequenceReport.observed}. ${t("gaps")}: ${missingFlow}.</div>
    <div class="feedback-card"><strong>${t("sequenceAlerts")}</strong>${sequenceAlerts}.</div>
    <div class="feedback-card"><strong>${t("omittedQuestions")}</strong>${omitted}.</div>
    <div class="feedback-card"><strong>${t("missedActions")}</strong>${missed}.</div>
    <div class="feedback-card"><strong>${t("safetyAlerts")}</strong>${unsafe}.</div>
    <div class="feedback-card"><strong>Feedback do tutor virtual</strong>${report.tutorFeedback}</div>
    <div class="feedback-card"><strong>${t("automaticSoap")}</strong>
      <p><b>S:</b> ${report.soap.S}</p>
      <p><b>O:</b> ${report.soap.O}</p>
      <p><b>A:</b> ${report.soap.A}</p>
      <p><b>P:</b> ${report.soap.P}</p>
    </div>
  `;
}

function starRating(score) {
  const safeScore = Math.max(0, Math.min(5, score || 0));
  return `${"★".repeat(safeScore)}${"☆".repeat(5 - safeScore)}`;
}

els.saveOsceBtn?.addEventListener("click", () => {
  const report = ensureCurrentReport();
  if (!report) return;
  const record = buildOsceRecord(report);
  const records = loadOsceRecords();
  records.push(record);
  saveOsceRecords(records);
  setOsceStatus(`Registro OSCE salvo. Total local: ${records.length}.`);
});

els.exportCurrentOsceBtn?.addEventListener("click", () => {
  const report = ensureCurrentReport();
  if (!report) return;
  downloadOsceCsv([buildOsceRecord(report)], "examosim-osce-atual.csv");
  setOsceStatus("CSV do atendimento atual exportado.");
});

els.exportAllOsceBtn?.addEventListener("click", () => {
  const records = loadOsceRecords();
  if (!records.length) {
    setOsceStatus("Nenhum registro OSCE salvo para exportar.");
    return;
  }
  downloadOsceCsv(records, "examosim-osce-registros.csv");
  setOsceStatus(`${records.length} registros OSCE exportados em CSV.`);
});

els.clearOsceBtn?.addEventListener("click", () => {
  localStorage.removeItem("examosim.osceRecords");
  setOsceStatus("Registros OSCE locais apagados.");
});

function ensureCurrentReport() {
  if (state.lastReport) return state.lastReport;
  if (!state.currentCase) {
    setOsceStatus("Selecione um caso antes de exportar.");
    return null;
  }
  state.lastReport = evaluateCase();
  renderReport(state.lastReport);
  return state.lastReport;
}

function buildOsceRecord(report) {
  const domainScore = (groupId) => {
    const domain = report.domainReports.find((item) => item.groupId === groupId);
    return domain ? domain.coverage : 0;
  };
  const studentQuestions = state.transcript.filter((entry) => entry.kind === "student").length;
  return {
    dataHora: new Date().toISOString(),
    aluno: state.student.name || "",
    matricula: state.student.id || "",
    faculdade: state.student.college || "",
    caso: state.currentCase?.title || state.currentCase?.id || "",
    paciente: state.currentCase ? localizedPatient(state.currentCase.patient) : "",
    queixa: state.currentCase ? localizedChiefComplaint(state.currentCase) : "",
    nota: report.score,
    hda: domainScore("currentIllness"),
    historiaFamiliar: domainScore("familyHistory"),
    historiaMedica: domainScore("medicalHistory"),
    historiaOdontologica: domainScore("dentalHistory"),
    habitos: domainScore("habits"),
    comunicacao: report.communicationScore,
    fatoresDeRisco: report.riskFactorScore,
    diagnosticoCorreto: report.diagnosisHit ? "sim" : "nao",
    hipoteseEsperada: clinicalText(state.currentCase?.diagnosis || ""),
    hipotesesMarcadas: Array.from(state.selectedHypotheses).map(clinicalText).join("; "),
    condutasMarcadas: Array.from(state.selectedActions).map(clinicalText).join("; "),
    perguntasAluno: studentQuestions,
    ordemObservada: report.sequenceReport.observed,
    alertasSequencia: report.sequenceReport.outOfOrder.join("; "),
    perguntasOmitidas: report.omitted.join("; "),
    condutasPendentes: report.missedActions.join("; "),
    alertasSeguranca: report.unsafeActions.join("; "),
    feedbackTutor: report.tutorFeedback,
    observacoesAvaliador: els.osceNotes?.value.trim() || "",
    soapS: report.soap.S,
    soapO: report.soap.O,
    soapA: report.soap.A,
    soapP: report.soap.P
  };
}

function loadOsceRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem("examosim.osceRecords") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveOsceRecords(records) {
  localStorage.setItem("examosim.osceRecords", JSON.stringify(records));
}

function downloadOsceCsv(records, filename) {
  const headers = [
    "dataHora",
    "aluno",
    "matricula",
    "faculdade",
    "caso",
    "paciente",
    "queixa",
    "nota",
    "hda",
    "historiaFamiliar",
    "historiaMedica",
    "historiaOdontologica",
    "habitos",
    "comunicacao",
    "fatoresDeRisco",
    "diagnosticoCorreto",
    "hipoteseEsperada",
    "hipotesesMarcadas",
    "condutasMarcadas",
    "perguntasAluno",
    "ordemObservada",
    "alertasSequencia",
    "perguntasOmitidas",
    "condutasPendentes",
    "alertasSeguranca",
    "feedbackTutor",
    "observacoesAvaliador",
    "soapS",
    "soapO",
    "soapA",
    "soapP"
  ];
  const csv = [
    headers.join(";"),
    ...records.map((record) => headers.map((header) => csvCell(record[header])).join(";"))
  ].join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " ").replace(/"/g, '""');
  return `"${text}"`;
}

function setOsceStatus(message) {
  if (els.osceStatus) els.osceStatus.textContent = message;
}

els.caseSelect.addEventListener("change", (event) => loadCase(event.target.value));

els.languageSelect.addEventListener("change", (event) => {
  state.language = event.target.value;
  if (state.recognition) state.recognition.lang = t("langCode");
  window.speechSynthesis?.cancel();
  rerenderLanguageDependentViews({ resetConversation: true });
});

boot();

els.studentForm.addEventListener("input", () => {
  state.student.name = els.studentName.value.trim();
  state.student.id = els.studentId.value.trim();
  state.student.college = els.studentCollege.value.trim();
  renderChart();
});

els.voiceToggle.addEventListener("change", () => {
  state.voiceEnabled = els.voiceToggle.checked;
  if (!state.voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

els.micBtn.addEventListener("click", () => {
  if (!state.recognition) {
    els.voiceStatus.textContent = t("unavailableRecognition");
    return;
  }

  if (state.recognizing) {
    state.recognition.stop();
    return;
  }

  state.recognition.start();
});

function speakPatient(text) {
  if (!state.voiceEnabled || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  loadVoices();
  const patient = state.currentCase?.patient;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = t("langCode");
  utterance.rate = voiceRateForPatient(patient);
  utterance.pitch = voicePitchForPatient(patient);
  utterance.voice = chooseVoiceForPatient();
  window.speechSynthesis.speak(utterance);
}

function chooseVoiceForPatient() {
  const patient = state.currentCase?.patient;
  if (!patient || !state.voices.length) return null;

  const localePrefix = state.language === "pt" ? "pt" : state.language === "es" ? "es" : "en";
  const localeVoices = state.voices.filter((voice) => normalize(voice.lang).startsWith(localePrefix));
  const voices = localeVoices.length ? localeVoices : state.voices;
  const gender = isFemalePatient(patient) ? "female" : "male";

  const femaleHints = [
    "female",
    "feminina",
    "maria",
    "luciana",
    "helena",
    "heloisa",
    "leticia",
    "joana",
    "francisca",
    "raquel",
    "yara",
    "vitoria",
    "camila"
  ];
  const maleHints = [
    "male",
    "masculina",
    "daniel",
    "felipe",
    "carlos",
    "joao",
    "jorge",
    "antonio",
    "ricardo",
    "paulo"
  ];
  const hints = gender === "female" ? femaleHints : maleHints;

  return (
    voices.find((voice) => hints.some((hint) => normalize(voice.name).includes(hint))) ||
    voices.find((voice) => gender === "female" && !maleHints.some((hint) => normalize(voice.name).includes(hint))) ||
    voices.find((voice) => voice.localService) ||
    voices[0] ||
    null
  );
}

function isFemalePatient(patient) {
  return normalize(patient?.gender || "").includes("feminino");
}

function voicePitchForPatient(patient) {
  const basePitch = patient?.voicePitch || 1;
  const age = patient?.age || 35;

  if (age < 13) return Math.min(Math.max(basePitch + 0.32, 1.22), 1.65);
  if (age < 20) return Math.min(Math.max(basePitch + 0.16, 1.04), 1.42);
  if (age >= 60) return Math.max(basePitch - 0.12, 0.72);
  if (isFemalePatient(patient)) return Math.max(basePitch, 1.12);
  return Math.min(basePitch, 0.96);
}

function voiceRateForPatient(patient) {
  const age = patient?.age || 35;

  if (age < 13) return 1.06;
  if (age < 20) return 1.02;
  if (age >= 60) return 0.88;
  return isFemalePatient(patient) ? 1 : 0.94;
}

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  state.voices = window.speechSynthesis.getVoices();
}

function setupSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    els.micBtn.disabled = true;
    els.voiceStatus.textContent = t("unavailableMic");
    return;
  }

  state.recognition = new Recognition();
  state.recognition.lang = t("langCode");
  state.recognition.interimResults = false;
  state.recognition.continuous = false;

  state.recognition.addEventListener("start", () => {
    state.recognizing = true;
    els.micBtn.classList.add("listening");
    els.voiceStatus.textContent = t("listening");
  });

  state.recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    els.questionInput.value = transcript;
    submitQuestion();
  });

  state.recognition.addEventListener("end", () => {
    state.recognizing = false;
    els.micBtn.classList.remove("listening");
    els.voiceStatus.textContent = t("micReady");
  });

  state.recognition.addEventListener("error", () => {
    state.recognizing = false;
    els.micBtn.classList.remove("listening");
    els.voiceStatus.textContent = t("micError");
  });
}

setupSpeechRecognition();
loadVoices();

if ("speechSynthesis" in window) {
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}
