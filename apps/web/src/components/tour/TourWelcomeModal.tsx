import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { useTour } from "../../context/TourContext";

export function TourWelcomeModal() {
  const { welcomeVisible, welcomeIsAuto, beginAfterWelcome, skipWelcome } = useTour();

  if (!welcomeVisible) return null;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={skipWelcome}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="compass-outline" size={26} color={Colors.teal} />
          </View>
          <Text style={styles.title}>
            {welcomeIsAuto ? "Conheça o app" : "Refazer o tutorial"}
          </Text>
          <Text style={styles.description}>
            {welcomeIsAuto
              ? "Vamos te mostrar rapidinho o que cada parte do app faz. Isso só aparece uma vez, mas você pode pular se preferir."
              : "Quer percorrer o tutorial de novo desde o começo?"}
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={beginAfterWelcome} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Começar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={skipWelcome} activeOpacity={0.85}>
            <Text style={styles.outlineBtnText}>Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.bgCardLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  outlineBtn: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  outlineBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
});
