import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { useTourTarget } from "../hooks/useTourTarget";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../navigation";

interface Props {
  navigation: BottomTabNavigationProp<MainTabParamList, "Health">;
}

interface HubItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
}

function HubItem({ icon, label, description, onPress, isLast }: HubItemProps & { isLast?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.item, isLast && styles.itemLastNoBorder]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.itemIcon}>
        <Ionicons name={icon} size={20} color={Colors.teal} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function HealthHubScreen({ navigation }: Props) {
  const listTourTarget = useTourTarget("health-list");

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>SAÚDE</Text>
        <Text style={styles.screenSubtitle}>
          Exames, medições e acompanhamento com sua equipe médica
        </Text>

        <View style={styles.section} ref={listTourTarget.ref} onLayout={listTourTarget.onLayout}>
          <HubItem
            icon="document-text-outline"
            label="Exames"
            description="Enviar e consultar exames analisados por IA"
            onPress={() => (navigation as any).navigate("ExamsUpload")}
          />
          <HubItem
            icon="body-outline"
            label="Body Scan"
            description="Medições corporais e comparativo de evolução"
            onPress={() => (navigation as any).navigate("BodyScan")}
          />
          <HubItem
            icon="medkit-outline"
            label="Receitas"
            description="Prescrições e medicações ativas"
            onPress={() => (navigation as any).navigate("Prescriptions")}
          />
          <HubItem
            icon="people-outline"
            label="Equipe Médica"
            description="Médicos e profissionais responsáveis pelo seu protocolo"
            onPress={() => (navigation as any).navigate("MedicalTeam")}
          />
          <HubItem
            icon="pricetag-outline"
            label="Parceiros"
            description="Descontos em farmácias, exames e suplementos"
            onPress={() => (navigation as any).navigate("Partners")}
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  section: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  itemLastNoBorder: {
    borderBottomWidth: 0,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCardLight,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: { flex: 1 },
  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  itemDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
