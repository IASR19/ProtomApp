import React, { useEffect, useCallback } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { useChatbotOnboarding } from "../hooks/useChatbotOnboarding";
import SimpleChatUI, { ChatMessage } from "../components/SimpleChatUI";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

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

  useEffect(() => {
    if (isCompleted) {
      // Simula salvamento dos dados
      setTimeout(() => {
        Alert.alert(
          "Perfil Completo! 🎉",
          "Seu protocolo personalizado foi criado com sucesso.",
          [
            {
              text: "Ir para Dashboard",
              onPress: () => navigation.replace("MainTabs"),
            },
          ],
        );
      }, 1500);
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
});
