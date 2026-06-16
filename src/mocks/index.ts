export const mockUser = {
  id: "1",
  name: "Itamar Ribeiro",
  initials: "IR",
  email: "itamar.ribeiro@email.com",
  age: 26,
  sex: "Masculino",
  height: 1.9,
  weight: 133,
  goalWeight: 110,
  imc: 36.8,
  imcLabel: "Obesidade Grau II",
  trainingFrequency: "3x por semana",
  objective: "Emagrecimento",
  plan: "Premium",
  planRenewal: "15/05/2027",
  metabolicScore: 62,
  appleWatchConnected: true,
};

export const mockDashboard = {
  metabolicScore: 62,
  protocolProgress: 45,
  trainingStatus: "Pendente Hoje",
  nutritionKcal: 1800,
  nutritionGoal: 2200,
  nextExamDays: 12,
  weightProgress: -0.0,
  criticalAlerts: 0,
  metabolicScoreDetails: {
    protocolAdherence: 72,
    wearableData: {
      sleep: 6.2,
      recovery: 85,
      avgHeartRate: 68,
    },
    weightProgress: 45,
    examsStatus: 90,
  },
  alerts: [
    {
      id: "1",
      level: "warning" as const,
      category: "adherence" as const,
      title: "Aderência ao Protocolo Baixa",
      description: "Sua aderência está em 72%, abaixo do ideal de 80%.",
      metric: "Aderência",
      value: "72%",
      expectedRange: "≥ 80%",
      recommendation:
        "Tente marcar todas as tarefas do protocolo diário. Use alarmes para lembrar dos horários importantes.",
    },
    {
      id: "2",
      level: "warning" as const,
      category: "wearable" as const,
      title: "Qualidade do Sono Abaixo do Ideal",
      description: "Você dormiu apenas 6.2 horas na última noite.",
      metric: "Sono",
      value: "6.2h",
      expectedRange: "7-9 horas",
      recommendation:
        "Mantenha uma rotina consistente de sono. Evite telas 1 hora antes de dormir.",
    },
  ],
};

export const mockProtocol = {
  adherence: 72,
  recovery: 85,
  sleep: "6h12",
  hydration: "1.2L",
  fastingHours: "14h",
  tasks: [
    {
      id: "1",
      time: "06:00",
      title: "Desjejum Metabólico",
      description: "Água com limão + Shot Matinal",
      tag: "NUTRIÇÃO",
      done: true,
    },
    {
      id: "2",
      time: "08:00",
      title: "Tirzepatida (Monjaro)",
      description: "Dose: 2.5mg (Subcutânea)",
      tag: "MEDICAÇÃO",
      done: true,
    },
    {
      id: "3",
      time: "12:30",
      title: "Quebra de Jejum",
      description: "Foco em Proteína Magra (40g)",
      tag: "NUTRIÇÃO",
      done: false,
    },
    {
      id: "4",
      time: "18:00",
      title: "Treino de Força",
      description: "Foco: Hipertrofia Membros Inferiores",
      tag: "PERFORMANCE",
      done: false,
    },
    {
      id: "5",
      time: "21:30",
      title: "Higiene do Sono",
      description: "Magnésio Inositol + Bloqueio de Luz Azul",
      tag: "BIOHACKING",
      done: false,
    },
  ],
};

export const mockExams = [
  {
    id: "1",
    name: "Hemograma Completo",
    date: "15/05/2026",
    status: "Analisado",
    type: "pdf",
  },
  {
    id: "2",
    name: "Perfil Lipídico",
    date: "15/05/2026",
    status: "Analisado",
    type: "pdf",
  },
  {
    id: "3",
    name: "Glicemia Jejum",
    date: "15/05/2026",
    status: "Analisado",
    type: "img",
  },
];

export const mockExamEvolution = [
  {
    id: "1",
    name: "Glicemia de Jejum",
    unit: "mg/dL",
    current: 88,
    previous: 92,
    monthCurrent: "Maio",
    monthPrevious: "Abril",
    status: "normal",
  },
  {
    id: "2",
    name: "Colesterol Total",
    unit: "mg/dL",
    current: 178,
    previous: 185,
    monthCurrent: "Maio",
    monthPrevious: "Abril",
    status: "normal",
  },
  {
    id: "3",
    name: "Triglicerídeos",
    unit: "mg/dL",
    current: 132,
    previous: 145,
    monthCurrent: "Maio",
    monthPrevious: "Abril",
    status: "normal",
  },
];

export const mockWorkout = {
  title: "Treino A - Superior",
  description: "Foco em hipertrofia e gasto calórico",
  duration: 55,
  calories: 450,
  exercises: [
    { id: "1", name: "Supino Reto", sets: 4, reps: 12, weight: 60 },
    { id: "2", name: "Desenvolvimento", sets: 3, reps: 12, weight: 30 },
    { id: "3", name: "Puxada Frontal", sets: 4, reps: 10, weight: 50 },
  ],
  cardio: "Cardio: 30min Esteira (Zona 2)",
};

export const mockWorkout3D = {
  currentExercise: "Supino Reto (Barra)",
  currentSerie: 3,
  totalSeries: 4,
  reps: 12,
  weight: 60,
  bpm: 142,
  caloriesBurned: 320,
  progress: 0.65,
};

export const mockNutrition = {
  meal: "Almoço Estratégico",
  totalKcal: 450,
  goalKcal: 500,
  protein: { grams: 40, percent: 45 },
  carb: { grams: 30, percent: 35 },
  fat: { grams: 15, percent: 20 },
};

export const mockBodyScan = {
  bodyFat: 28.5,
  bodyFatDelta: -2.1,
  visceralFat: 12,
  visceralFatDelta: -1,
  weight: 128,
  weightDelta: -5,
  waist: 112,
  waistDelta: -4,
  leanMass: 42,
  leanMassDelta: 0,
  comparisonLabel: "Comparativo: Mês 1 vs Mês 2",
};

export const mockPrescriptions = [
  {
    id: "1",
    title: "Receita: Tirzepatida",
    sentBy: "Médico Responsável",
    date: "15/05/2026",
    status: "Assinado digitalmente (ICP-Brasil)",
    statusType: "signed",
    icon: "document-text",
  },
  {
    id: "2",
    title: "Pedido de Exames de Sangue",
    sentBy: "Médico Responsável",
    date: "14/05/2026",
    status: "Assinado digitalmente (ICP-Brasil)",
    statusType: "signed",
    icon: "flask",
  },
  {
    id: "3",
    title: "Laudo de Bioimpedância",
    sentBy: "Clínica",
    date: "10/05/2026",
    status: "Documento Verificado",
    statusType: "verified",
    icon: "reader",
  },
];

export const mockPartners = {
  savings: 345.0,
  tabs: ["Suplementos", "Farmácias", "Exames"],
  supplements: [
    {
      id: "1",
      name: "Whey Protein Isolado",
      brand: "Growth Supplements",
      discount: "- 15%",
      icon: "nutrition",
    },
    {
      id: "2",
      name: "Creatina Creapure",
      brand: "Max Titanium",
      discount: "- 20%",
      icon: "fitness",
    },
    {
      id: "3",
      name: "Pré-Treino Évora",
      brand: "Integralmédica",
      discount: "- 10%",
      icon: "flash",
    },
  ],
  pharmacies: [
    {
      id: "1",
      name: "Tirzepatida Manipulada",
      brand: "Farmácia Dose Certa",
      discount: "- 12%",
      icon: "medkit",
    },
    {
      id: "2",
      name: "Magnésio Bisglicinato",
      brand: "Ultrafarma",
      discount: "- 8%",
      icon: "medkit",
    },
  ],
  exams: [
    {
      id: "1",
      name: "Hemograma + Bioquímica",
      brand: "Hermes Pardini",
      discount: "- 25%",
      icon: "pulse",
    },
    {
      id: "2",
      name: "Perfil Hormonal Completo",
      brand: "Fleury",
      discount: "- 18%",
      icon: "pulse",
    },
  ],
};

export const mockProtocolMeta = {
  doctor: "Médico Responsável",
  version: "2.1",
  updatedAt: "15/05/2026",
  objective: "Emagrecimento + Recomposição Corporal",
  nextReview: "15/06/2026",
  crm: "CRM-SP 123456",
};

export const mockMedicationStack = [
  {
    id: "1",
    name: "Tirzepatida (Monjaro)",
    dose: "2.5mg",
    route: "Subcutânea",
    time: "08:00",
    frequency: "Semanal (sábados)",
    instructions: [
      "Aplicar em rotação: abdômen, coxa ou braço",
      "Guardar refrigerado entre 2°C e 8°C",
      "Retirar da geladeira 30min antes de aplicar",
    ],
    combinations: ["500ml de água antes", "Caminhada leve 15min após"],
    alertLevel: "warning",
  },
];

export const mockSupplementStack = [
  {
    id: "1",
    name: "Magnésio Bisglicinato",
    dose: "400mg",
    time: "21:00",
    purpose: "Relaxamento muscular e qualidade do sono",
    icon: "moon-outline",
    phase: "NOITE",
  },
  {
    id: "2",
    name: "Inositol",
    dose: "2g",
    time: "21:00",
    purpose: "Sensibilidade à insulina e equilíbrio do humor",
    icon: "leaf-outline",
    phase: "NOITE",
  },
  {
    id: "3",
    name: "Melatonina",
    dose: "0.3mg",
    time: "22:00",
    purpose: "Início e manutenção do sono profundo",
    icon: "bed-outline",
    phase: "NOITE",
  },
  {
    id: "4",
    name: "Vitamina D3 + K2",
    dose: "5.000 UI + 100mcg",
    time: "12:00",
    purpose: "Imunidade, ossos e saúde cardiovascular",
    icon: "sunny-outline",
    phase: "TARDE",
  },
];
