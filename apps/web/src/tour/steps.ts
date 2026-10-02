import type { MainTabParamList } from "../navigation";

export type TourStepKind = "content" | "nav";

export interface TourStep {
  id: string;
  kind: TourStepKind;
  title: string;
  description: string;
  /** Only for kind "nav": which tab this step points to. */
  navTarget?: keyof MainTabParamList;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "home-score",
    kind: "content",
    title: "Seu placar de saúde",
    description:
      "Aqui você vê como está sua saúde hoje. Esse número é atualizado todos os dias com base no seu protocolo, treino e alimentação.",
  },
  {
    id: "tab-Routine",
    kind: "nav",
    navTarget: "Routine",
    title: "Sua rotina",
    description: "Toque aqui para continuar e ver sua rotina diária.",
  },
  {
    id: "routine-list",
    kind: "content",
    title: "Ações do seu dia a dia",
    description:
      "Aqui ficam as ações que você registra todos os dias: seu treino indicado, suas refeições e como você está se sentindo.",
  },
  {
    id: "tab-Health",
    kind: "nav",
    navTarget: "Health",
    title: "Sua saúde",
    description: "Toque aqui para continuar e ver seus exames e acompanhamento médico.",
  },
  {
    id: "health-list",
    kind: "content",
    title: "Exames e acompanhamento",
    description:
      "Aqui ficam seus exames, medições, receitas, sua equipe médica e parceiros com desconto.",
  },
  {
    id: "tab-Protocol",
    kind: "nav",
    navTarget: "Protocol",
    title: "Seu protocolo",
    description: "Toque aqui para continuar e ver o protocolo completo do dia.",
  },
  {
    id: "protocol-adherence",
    kind: "content",
    title: "Seu protocolo do dia",
    description:
      "Este é o protocolo que seu médico montou pra você, com tudo que precisa ser feito hoje.",
  },
  {
    id: "tab-Profile",
    kind: "nav",
    navTarget: "Profile",
    title: "Seu perfil",
    description: "Toque aqui para continuar e ver sua conta e preferências.",
  },
  {
    id: "profile-menu",
    kind: "content",
    title: "Sua conta",
    description:
      "Aqui você gerencia sua equipe médica, notificações e as configurações da sua conta.",
  },
];
