import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { useChatbotOnboarding } from "../hooks/useChatbotOnboarding";
import SimpleChatUI, { ChatMessage } from "../components/SimpleChatUI";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { api } from "../services/api";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "OnboardingChat">;
};

export default function OnboardingChatScreen({ navigation }: Props) {
  const {
    messages,
    isCompleted,
    onboardingData,
    initializeChat,
    handleUserResponse,
    setMessages,
  } = useChatbotOnboarding();

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Iniciando geração...");

  useEffect(() => {
    if (isCompleted && !saving) {
      setSaving(true);
      setProgress(0);
      setStatusText("Iniciando geração...");

      let currentProgress = 0;
      let apiFinished = false;
      let apiError: string | null = null;

      // Inicia a animação de progresso simulado (passos rápidos e fluidos)
      const interval = setInterval(() => {
        currentProgress += 2;
        if (currentProgress > 100) {
          currentProgress = 100;
        }
        setProgress(currentProgress);

        // Atualiza textos de status com base na porcentagem
        if (currentProgress < 20) {
          setStatusText("Analisando seus dados biométricos e IMC...");
        } else if (currentProgress < 45) {
          setStatusText("Estruturando plano de treinos personalizado...");
        } else if (currentProgress < 70) {
          setStatusText("Calculando metas de nutrição e macronutrientes...");
        } else if (currentProgress < 90) {
          setStatusText("Gerando recomendações de suplementação e sono...");
        } else {
          setStatusText("Finalizando e salvando protocolo no banco de dados...");
        }

        if (currentProgress === 100) {
          clearInterval(interval);
          
          // Se a requisição de API já concluiu, executa o encerramento imediato
          if (apiFinished) {
            handleFinishedGeneration(apiError);
          }
        }
      }, 50); // Leva em torno de 2.5 segundos para completar 100%

      const handleFinishedGeneration = (error: string | null) => {
        setSaving(false);
        if (error) {
          Alert.alert(
            "Erro",
            "Não foi possível salvar seu perfil: " + error,
            [
              {
                text: "Fazer Login Novamente",
                onPress: () => navigation.replace("Login"),
              },
            ]
          );
        } else {
          Alert.alert(
            "Perfil Completo! 🎉",
            "Seu protocolo personalizado foi criado com sucesso.",
            [
              {
                text: "Ir para Dashboard",
                onPress: () => navigation.replace("MainTabs"),
              },
            ],
            { cancelable: false }
          );
        }
      };

      const saveOnboarding = async () => {
        try {
          await api.post("/protocol/generate", {
            objective: onboardingData.objective || "emagrecimento",
            age: onboardingData.age || 26,
            sex: onboardingData.sex || "masculino",
            height: onboardingData.height || 180,
            weight: onboardingData.weight || 90,
            trainingFrequency: onboardingData.trainingFrequency || 3,
            mealsCount: onboardingData.mealsCount || 4,
            mealsSchedule: onboardingData.mealsSchedule || ["08:00", "12:00", "16:00", "20:00"],
            usesSupplements: onboardingData.usesSupplements ?? false,
          });
          apiFinished = true;
          // Se o progresso visual já chegou a 100%, finaliza agora
          if (currentProgress === 100) {
            handleFinishedGeneration(null);
          }
        } catch (err: any) {
          apiFinished = true;
          apiError = err.message || "Erro inesperado";
          if (currentProgress === 100) {
            handleFinishedGeneration(apiError);
          }
        }
      };

      saveOnboarding();

      return () => {
        clearInterval(interval);
      };
    }
  }, [isCompleted, navigation, onboardingData]);

  const onSend = useCallback(
    (text: string) => {
      const userMessage: ChatMessage = {
        _id: Date.now(),
        text,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "Você",
        },
      };

      setMessages((previousMessages) => [userMessage, ...previousMessages]);

      // Processar resposta com delay para parecer mais natural
      setTimeout(() => {
        handleUserResponse(text, false); // false = não é quick reply
      }, 300);
    },
    [handleUserResponse, setMessages],
  );

  const onQuickReply = useCallback(
    (reply: { title: string; value: string }) => {
      // Criar mensagem do usuário com o título da resposta rápida (ex: "3-4x" ao invés de "4")
      const userMessage: ChatMessage = {
        _id: Date.now(),
        text: reply.title,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "Você",
        },
      };

      setMessages((previousMessages) => [userMessage, ...previousMessages]);

      // Processar resposta usando o value para validação
      setTimeout(() => {
        handleUserResponse(reply.value, true); // true = é quick reply (pular validação)
      }, 300);
    },
    [handleUserResponse, setMessages],
  );

  return (
    <LinearGradient
      colors={[Colors.bgPrimary, "#0A1520"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <SimpleChatUI
          messages={messages}
          onSend={onSend}
          onQuickReply={onQuickReply}
          placeholder="Digite sua resposta..."
          currentUserId={1}
        />
      </SafeAreaView>

      {/* Barra de Progresso e Geração de Protocolo */}
      <Modal visible={saving} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loaderCard}>
            <View style={styles.iconCircle}>
              <ActivityIndicator size="large" color={Colors.teal} />
            </View>
            <Text style={styles.loaderTitle}>Gerando Protocolo</Text>
            <Text style={styles.loaderSubtitle}>
              Nossa inteligência artificial está estruturando seu protocolo de saúde otimizado...
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            
            <View style={styles.progressTextRow}>
              <Text style={styles.statusText}>{statusText}</Text>
              <Text style={styles.percentText}>{progress}%</Text>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 22, 40, 0.9)", // bgPrimary semi-transparente
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loaderCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 201, 177, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  loaderSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  progressContainer: {
    height: 6,
    width: "100%",
    backgroundColor: Colors.bgPrimary,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 3,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  statusText: {
    fontSize: 12,
    color: Colors.teal,
    fontWeight: "500",
    flex: 1,
    marginRight: 10,
  },
  percentText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
});
