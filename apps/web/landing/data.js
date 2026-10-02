/*
 * Planos e precos da landing page. Edite aqui pra mudar preco/recurso sem mexer no layout.
 * - monthly/yearly: preco cheio de cada periodo (o equivalente mensal e a % de economia
 *   do anual sao calculados pela pagina).
 * - features: ids da lista FEATURES que o plano inclui.
 */
window.PROTOM_LP = {
  trialDays: 14,
  ctaHref: "/app",

  features: [
    { id: "checkin", label: "Check-in diário" },
    { id: "score", label: "Score metabólico" },
    { id: "bot", label: "Onboarding com o ProtomBot" },
    { id: "treino", label: "Planos de treino" },
    { id: "diario", label: "Diário alimentar" },
    { id: "protocolo", label: "Protocolo personalizado e score de adesão" },
    { id: "foto", label: "Análise de refeição por foto" },
    { id: "exames", label: "Exames e gráficos de evolução" },
    { id: "alertas", label: "Alertas inteligentes" },
    { id: "receitas", label: "Receitas digitais (ICP-Brasil)" },
    { id: "bodyscan", label: "Body scan" },
    { id: "treino3d", label: "Treino 3D imersivo" },
    { id: "parceiros", label: "Descontos com parceiros" },
    { id: "suporte", label: "Suporte prioritário" },
  ],

  plans: [
    {
      id: "essencial",
      name: "Essencial",
      pitch: "Pra criar o hábito e enxergar o seu ponto de partida.",
      monthly: 14.9,
      yearly: 149,
      features: ["checkin", "score", "bot", "treino", "diario"],
    },
    {
      id: "protocolo",
      name: "Protocolo",
      pitch: "Pra quem segue um protocolo e quer medir a adesão de verdade.",
      monthly: 29.9,
      yearly: 299,
      featured: true,
      badge: "Recomendado",
      features: [
        "checkin", "score", "bot", "treino", "diario",
        "protocolo", "foto", "exames", "alertas", "receitas",
      ],
    },
    {
      id: "performance",
      name: "Performance",
      pitch: "Tudo liberado, pra quem leva composição e performance a sério.",
      monthly: 49.9,
      yearly: 499,
      features: [
        "checkin", "score", "bot", "treino", "diario",
        "protocolo", "foto", "exames", "alertas", "receitas",
        "bodyscan", "treino3d", "parceiros", "suporte",
      ],
    },
  ],
};
