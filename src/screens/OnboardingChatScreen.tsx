import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  Modal,
  ActivityIndicator,
  Platform,
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
  const generationStartedRef = useRef(false);
  const onboardingDataRef = useRef(onboardingData);
  onboardingDataRef.current = onboardingData;

  useEffect(() => {
    if (!isCompleted || generationStartedRef.current) {
      return;
    }

    generationStartedRef.current = true;
    setSaving(true);
    setProgress(0);
    setStatusText("Iniciando geração...");

    let currentProgress = 0;
    let finished = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const finishGeneration = (error: string | null) => {
      if (finished) return;
      finished = true;
      if (interval) clearInterval(interval);
      setProgress(100);
      setSaving(false);

      if (error) {
        generationStartedRef.current = false;
        Alert.alert(
          "Erro",
          "Não foi possível salvar seu perfil: " + error,
          [
            { text: "Tentar novamente" },
            {
              text: "Ir para Login",
              onPress: () => navigation.replace("Login"),
            },
          ],
        );
        return;
      }

      // Navega direto — Alert.alert no web não dispara o onPress de forma confiável
      navigation.replace("MainTabs");
      if (Platform.OS !== "web") {
        Alert.alert(
          "Perfil Completo! 🎉",
          "Seu protocolo personalizado foi criado com sucesso.",
        );
      }
    };

    interval = setInterval(() => {
      currentProgress = Math.min(currentProgress + 2, 95);
      setProgress(currentProgress);

      if (currentProgress < 20) {
        setStatusText("Analisando seus dados biométricos e IMC...");
      } else if (currentProgress < 45) {
        setStatusText("Estruturando plano de treinos personalizado...");
      } else if (currentProgress < 70) {
        setStatusText("Calculando metas de nutrição e macronutrientes...");
      } else {
        setStatusText("Gerando recomendações de suplementação e sono...");
      }
    }, 50);

    const data = onboardingDataRef.current;
    const saveOnboarding = async () => {
      try {
        await api.post("/protocol/generate", {
          objective: data.objective || "emagrecimento",
          age: data.age || 26,
          sex: data.sex || "masculino",
          height: data.height || 180,
          weight: data.weight || 90,
          trainingFrequency: data.trainingFrequency || 3,
          mealsCount: data.mealsCount || 4,
          mealsSchedule: data.mealsSchedule || [
            "08:00",
            "12:00",
            "16:00",
            "20:00",
          ],
          usesSupplements: data.usesSupplements ?? false,
        });
        setStatusText("Finalizando e salvando protocolo no banco de dados...");
        finishGeneration(null);
      } catch (err: any) {
        finishGeneration(err.message || "Erro inesperado");
      }
    };

    saveOnboarding();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCompleted, navigation]);

  const onSend = useCallback(
    (text: string) => {
      if (isCompleted || saving) return;

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

      setTimeout(() => {
        handleUserResponse(text, false);
      }, 300);
    },
    [handleUserResponse, setMessages, isCompleted, saving],
  );

  const onQuickReply = useCallback(
    (reply: { title: string; value: string }) => {
      if (isCompleted || saving) return;

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

      setTimeout(() => {
        handleUserResponse(reply.value, true);
      }, 300);
    },
    [handleUserResponse, setMessages, isCompleted, saving],
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
