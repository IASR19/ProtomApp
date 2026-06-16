export type OnboardingStep =
  | "welcome"
  | "objective"
  | "age"
  | "sex"
  | "height"
  | "weight"
  | "training_frequency"
  | "meals_count"
  | "meals_schedule"
  | "supplements"
  | "completed";

export type Objective = "emagrecimento" | "hipertrofia";
export type Sex = "masculino" | "feminino";

export interface OnboardingData {
  objective?: Objective;
  age?: number;
  sex?: Sex;
  height?: number;
  weight?: number;
  trainingFrequency?: number;
  mealsCount?: number;
  mealsSchedule?: string[];
  usesSupplements?: boolean;
  imc?: number;
}

export interface ChatbotMessage {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  };
  quickReplies?: {
    type: "radio" | "checkbox";
    keepIt?: boolean;
    values: Array<{
      title: string;
      value: string;
    }>;
  };
}
