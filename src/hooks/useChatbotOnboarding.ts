import { useState, useCallback, useRef } from "react";
import type {
  OnboardingStep,
  OnboardingData,
  Objective,
  Sex,
} from "../types/onboarding";
import type { ChatMessage } from "../components/SimpleChatUI";

const BOT_USER = {
  _id: 2,
  name: "ProtomBot",
  avatar: "🤖",
};

const USER = {
  _id: 1,
  name: "Você",
};

export function useChatbotOnboarding() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Usar ref para manter dados sincronizados
  const dataRef = useRef<OnboardingData>({});

  // Inicializa o chat
  const initializeChat = useCallback(() => {
    const welcomeMessage = getNextQuestion("welcome", {});
    if (welcomeMessage) {
      setMessages([welcomeMessage]);
    }
  }, []);

  // Calcula o IMC
  const calculateIMC = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Valida resposta baseado no step atual
  const validateResponse = (
    text: string,
    step: OnboardingStep,
  ): { valid: boolean; error?: string } => {
    switch (step) {
      case "age":
        const age = parseInt(text);
        if (isNaN(age) || age < 13 || age > 120) {
          return {
            valid: false,
            error: "Por favor, digite uma idade válida entre 13 e 120 anos.",
          };
        }
        return { valid: true };

      case "height":
        const height = parseFloat(text);
        if (isNaN(height) || height < 100 || height > 250) {
          return {
            valid: false,
            error: "Por favor, digite uma altura válida entre 100 e 250 cm.",
          };
        }
        return { valid: true };

      case "weight":
        const weight = parseFloat(text);
        if (isNaN(weight) || weight < 30 || weight > 300) {
          return {
            valid: false,
            error: "Por favor, digite um peso válido entre 30 e 300 kg.",
          };
        }
        return { valid: true };

      case "training_frequency":
        const freq = parseInt(text);
        if (isNaN(freq) || freq < 0 || freq > 7) {
          return {
            valid: false,
            error: "Por favor, digite um número entre 0 e 7.",
          };
        }
        return { valid: true };

      case "meals_count":
        const meals = parseInt(text);
        if (isNaN(meals) || meals < 1 || meals > 8) {
          return {
            valid: false,
            error: "Por favor, digite um número entre 1 e 8 refeições.",
          };
        }
        return { valid: true };

      default:
        return { valid: true };
    }
  };

  // Retorna a próxima pergunta baseada no step atual
  const getNextQuestion = (
    step: OnboardingStep,
    data: OnboardingData,
  ): ChatMessage | null => {
    switch (step) {
      case "welcome":
        return {
          _id: Date.now(),
          text: "Olá! 👋 Sou o ProtomBot e vou te ajudar a configurar seu protocolo personalizado. Vamos começar?",
          createdAt: new Date(),
          user: BOT_USER,
          quickReplies: {
            type: "radio",
            values: [{ title: "✅ Vamos lá!", value: "start" }],
          },
        };

      case "objective":
        return {
          _id: Date.now(),
          text: "Perfeito! Primeiro, qual é o seu principal objetivo?",
          createdAt: new Date(),
          user: BOT_USER,
          quickReplies: {
            type: "radio",
            values: [
              { title: "🔥 Emagrecimento", value: "emagrecimento" },
              { title: "💪 Hipertrofia", value: "hipertrofia" },
            ],
          },
        };

      case "age":
        return {
          _id: Date.now(),
          text: "Ótima escolha! Agora me diga, qual é a sua idade?",
          createdAt: new Date(),
          user: BOT_USER,
        };

      case "sex":
        return {
          _id: Date.now(),
          text: "Entendi! E qual é o seu sexo biológico?",
          createdAt: new Date(),
          user: BOT_USER,
          quickReplies: {
            type: "radio",
            values: [
              { title: "👨 Masculino", value: "masculino" },
              { title: "👩 Feminino", value: "feminino" },
            ],
          },
        };

      case "height":
        return {
          _id: Date.now(),
          text: "Perfeito! Qual é a sua altura em centímetros? (Ex: 175)",
          createdAt: new Date(),
          user: BOT_USER,
        };

      case "weight":
        return {
          _id: Date.now(),
          text: "E qual é o seu peso atual em quilos? (Ex: 80)",
          createdAt: new Date(),
          user: BOT_USER,
        };

      case "training_frequency":
        // Calcular IMC agora que temos altura E peso
        const imc =
          data.height && data.weight
            ? calculateIMC(data.weight, data.height)
            : 0;
        let imcLabel = "";
        if (imc < 18.5) imcLabel = "Abaixo do peso";
        else if (imc < 25) imcLabel = "Peso normal";
        else if (imc < 30) imcLabel = "Sobrepeso";
        else if (imc < 35) imcLabel = "Obesidade Grau I";
        else if (imc < 40) imcLabel = "Obesidade Grau II";
        else imcLabel = "Obesidade Grau III";

        return {
          _id: Date.now(),
          text:
            imc > 0
              ? `Calculei seu IMC: ${imc} (${imcLabel})\n\nAgora me diga, quantas vezes por semana você treina ou pretende treinar?`
              : "Agora me diga, quantas vezes por semana você treina ou pretende treinar?",
          createdAt: new Date(),
          user: BOT_USER,
          quickReplies: {
            type: "radio",
            values: [
              { title: "Nenhuma", value: "0" },
              { title: "1-2x", value: "2" },
              { title: "3-4x", value: "4" },
              { title: "5-7x", value: "6" },
            ],
          },
        };

      case "meals_count":
        return {
          _id: Date.now(),
          text: "Ótimo! E quantas refeições você costuma fazer por dia?",
          createdAt: new Date(),
          user: BOT_USER,
          quickReplies: {
            type: "radio",
            values: [
              { title: "2-3 refeições", value: "3" },
              { title: "4-5 refeições", value: "5" },
              { title: "6+ refeições", value: "6" },
            ],
          },
        };

      case "meals_schedule":
        return {
          _id: Date.now(),
          text: "Perfeito! Digite os horários aproximados das suas refeições, separados por vírgula.\n\nExemplo: 08:00, 12:00, 16:00, 20:00",
          createdAt: new Date(),
          user: BOT_USER,
        };

      case "supplements":
        if (data.objective === "hipertrofia") {
          return {
            _id: Date.now(),
            text: "Última pergunta! Você já usa ou pretende usar suplementos?",
            createdAt: new Date(),
            user: BOT_USER,
            quickReplies: {
              type: "radio",
              values: [
                { title: "✅ Sim", value: "sim" },
                { title: "❌ Não", value: "nao" },
              ],
            },
          };
        } else {
          return {
            _id: Date.now(),
            text: "🎉 Perfeito! Seu perfil está completo.\n\nEstou gerando seu protocolo personalizado...",
            createdAt: new Date(),
            user: BOT_USER,
          };
        }

      case "completed":
        return {
          _id: Date.now(),
          text: "🎉 Perfeito! Seu perfil está completo.\n\nEstou gerando seu protocolo personalizado...",
          createdAt: new Date(),
          user: BOT_USER,
        };

      default:
        return null;
    }
  };

  // Determina o próximo step baseado no atual
  const getNextStep = (
    currentStep: OnboardingStep,
    data: OnboardingData,
  ): OnboardingStep => {
    switch (currentStep) {
      case "welcome":
        return "objective";
      case "objective":
        return "age";
      case "age":
        return "sex";
      case "sex":
        return "height";
      case "height":
        return "weight";
      case "weight":
        return "training_frequency";
      case "training_frequency":
        return "meals_count";
      case "meals_count":
        return "meals_schedule";
      case "meals_schedule":
        return data.objective === "hipertrofia" ? "supplements" : "completed";
      case "supplements":
        return "completed";
      default:
        return "completed";
    }
  };

  // Processa a resposta do usuário
  const handleUserResponse = useCallback(
    (text: string, isQuickReply: boolean = false) => {
      const response = text.trim();

      // Identificar qual step deve processar esta resposta
      // Baseado nos dados já preenchidos, determinar o próximo campo vazio
      let targetStep = currentStep;

      // Se não for quick reply, validar apenas steps que requerem input manual
      if (!isQuickReply) {
        const validation = validateResponse(response, targetStep);
        if (!validation.valid) {
          const errorMessage: ChatMessage = {
            _id: Date.now(),
            text: validation.error!,
            createdAt: new Date(),
            user: BOT_USER,
          };
          setMessages((prev) => [errorMessage, ...prev]);
          return;
        }
      }

      // Atualizar dados do onboarding usando a ref para sincronização imediata
      let updatedData = { ...dataRef.current };

      switch (targetStep) {
        case "welcome":
          // Apenas prosseguir
          break;
        case "objective":
          updatedData.objective = response as Objective;
          break;
        case "age":
          updatedData.age = parseInt(response);
          break;
        case "sex":
          updatedData.sex = response as Sex;
          break;
        case "height":
          updatedData.height = parseFloat(response);
          break;
        case "weight":
          updatedData.weight = parseFloat(response);
          // Calcular IMC com os dados atualizados da ref
          if (updatedData.height) {
            updatedData.imc = calculateIMC(
              parseFloat(response),
              updatedData.height,
            );
          }
          break;
        case "training_frequency":
          updatedData.trainingFrequency = parseInt(response);
          break;
        case "meals_count":
          updatedData.mealsCount = parseInt(response);
          break;
        case "meals_schedule":
          updatedData.mealsSchedule = response.split(",").map((s) => s.trim());
          break;
        case "supplements":
          updatedData.usesSupplements = response === "sim";
          break;
      }

      // Determinar próximo step
      const nextStep = getNextStep(targetStep, updatedData);

      // Atualizar ref e state
      dataRef.current = updatedData;
      setOnboardingData(updatedData);
      setCurrentStep(nextStep);

      if (nextStep === "completed") {
        const nextQuestion = getNextQuestion("completed", updatedData);
        if (nextQuestion) {
          setTimeout(() => {
            setMessages((prev) => [nextQuestion, ...prev]);
          }, 800);
        }
        setTimeout(() => {
          setIsCompleted(true);
        }, 2500);
        return;
      }

      // Enviar próxima pergunta
      const nextQuestion = getNextQuestion(nextStep, updatedData);
      if (nextQuestion) {
        setTimeout(() => {
          setMessages((prev) => [nextQuestion, ...prev]);
        }, 800);
      }
    },
    [currentStep],
  );

  return {
    messages,
    currentStep,
    onboardingData,
    isCompleted,
    initializeChat,
    handleUserResponse,
    setMessages,
  };
}
