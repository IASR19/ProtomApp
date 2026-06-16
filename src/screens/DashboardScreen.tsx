import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { mockUser, mockDashboard } from "../mocks";
import { MetabolicScoreCard } from "../components/MetabolicScoreCard";
import { SmartAlertsCard } from "../components/SmartAlertsCard";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../navigation";

type Props = {
  navigation: BottomTabNavigationProp<MainTabParamList, "Dashboard">;
};

const MetricCard = ({
  icon,
  iconColor,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View style={styles.metricCard}>
    <Ionicons
      name={icon}
      size={22}
      color={iconColor}
      style={{ marginBottom: 8 }}
    />
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, valueColor ? { color: valueColor } : {}]}>
      {value}
    </Text>
  </View>
);

export default function DashboardScreen({ navigation }: Props) {
  const scoreColor =
    mockDashboard.metabolicScore >= 80
      ? Colors.success
      : mockDashboard.metabolicScore >= 60
        ? Colors.teal
        : Colors.warning;

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={GlobalStyles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{mockUser.initials}</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.greeting}>
                Olá, {mockUser.name.split(" ")[0]} 👋
              </Text>
              <Text style={styles.subGreeting}>{mockUser.objective}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Score Metabólico Expandido */}
        <MetabolicScoreCard
          score={mockDashboard.metabolicScore}
          details={mockDashboard.metabolicScoreDetails}
        />

        {/* 4 Metric Cards */}
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="list-outline"
            iconColor={Colors.teal}
            label="Protocolo"
            value={`${mockDashboard.protocolProgress}% Concluído`}
          />
          <MetricCard
            icon="barbell-outline"
            iconColor={Colors.warning}
            label="Treino"
            value={mockDashboard.trainingStatus}
            valueColor={Colors.warning}
          />
          <MetricCard
            icon="restaurant-outline"
            iconColor={Colors.danger}
            label="Nutrição"
            value={`${(mockDashboard.nutritionKcal / 1000).toFixed(1)}k / ${(mockDashboard.nutritionGoal / 1000).toFixed(1)}k kcal`}
          />
          <MetricCard
            icon="document-text-outline"
            iconColor={Colors.blue}
            label="Próximo Exame"
            value={`em ${mockDashboard.nextExamDays} dias`}
          />
        </View>

        {/* Progress de Peso */}
        <View style={styles.weightCard}>
          <View style={GlobalStyles.spaceBetween}>
            <Text style={styles.weightLabel}>Progresso de Peso</Text>
            <Text style={styles.weightDelta}>
              {mockDashboard.weightProgress === 0
                ? "-0.0 kg"
                : `${mockDashboard.weightProgress} kg`}
            </Text>
          </View>
          <View style={GlobalStyles.spaceBetween}>
            <Text style={styles.weightCurrent}>{mockUser.weight} kg</Text>
            <Text style={styles.weightGoal}>
              Meta: {mockUser.goalWeight} kg
            </Text>
          </View>
          {/* Progress bar */}
          <View style={styles.weightBar}>
            <View
              style={[
                styles.weightBarFill,
                {
                  width: `${Math.min(
                    ((mockUser.weight - mockUser.goalWeight) /
                      (133 - mockUser.goalWeight)) *
                      100,
                    100,
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Sistema de Alertas Inteligentes */}
        <SmartAlertsCard alerts={mockDashboard.alerts} />

        {/* Quick Actions */}
        <Text style={[GlobalStyles.sectionTitle, { marginTop: 24 }]}>
          Acesso Rápido
        </Text>
        <View style={styles.quickActions}>
          {[
            { label: "Protocolo", icon: "list" as const, screen: "Protocol" },
            {
              label: "Treino",
              icon: "barbell" as const,
              screen: "WorkoutIndication",
            },
            {
              label: "Nutrição",
              icon: "restaurant" as const,
              screen: "Nutrition",
            },
            {
              label: "Body Scan",
              icon: "body" as const,
              screen: "BodyScan",
            },
            {
              label: "Exames",
              icon: "document-text" as const,
              screen: "ExamsUpload",
            },
            {
              label: "Receitas",
              icon: "medkit" as const,
              screen: "Prescriptions",
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickAction}
              onPress={() => (navigation as any).navigate(item.screen)}
            >
              <Ionicons name={item.icon} size={22} color={Colors.teal} />
              <Text style={styles.quickActionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.bgPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  greeting: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontSize: 13,
    color: Colors.teal,
    fontWeight: "500",
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreCard: {
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreLeft: {},
  scoreValue: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 56,
  },
  scoreOf: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.textSecondary,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 1.5,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  weightCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    gap: 8,
  },
  weightLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  weightDelta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  weightCurrent: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  weightGoal: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.teal,
  },
  weightBar: {
    height: 6,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 3,
    overflow: "hidden",
  },
  weightBarFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 3,
  },
  alertSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.12)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  alertSuccessText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: "500",
  },
  alertDanger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.12)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  alertDangerText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    width: "30%",
    flexGrow: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
});
