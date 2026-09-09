import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

interface MetabolicScoreDetails {
  protocolAdherence: number; // 0-100
  // Sono e recuperação vêm do check-in diário autorreportado pelo usuário
  // (não há wearable conectado ainda — ver docs/wearable-data-strategy.md).
  wellness: {
    hasCheckin: boolean;
    sleepHours: number; // horas
    sleepScore: number; // 0-100
    recoveryScore: number; // 0-100
  };
  weightProgress: number; // 0-100 (relativo à meta)
  examsStatus: number; // 0-100 (baseado em exames dentro do padrão)
}

interface ScoreComponentBarProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  color: string;
}

const ScoreComponentBar = ({
  icon,
  label,
  value,
  maxValue = 100,
  unit = "%",
  color,
}: ScoreComponentBarProps) => {
  const percentage = (value / maxValue) * 100;
  const barColor =
    percentage >= 70
      ? Colors.success
      : percentage >= 40
        ? Colors.teal
        : Colors.warning;

  return (
    <View style={styles.componentContainer}>
      <View style={styles.componentHeader}>
        <View style={styles.componentLeft}>
          <Ionicons name={icon} size={18} color={color} />
          <Text style={styles.componentLabel}>{label}</Text>
        </View>
        <Text style={styles.componentValue}>
          {value.toFixed(0)}
          {unit}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
};

const CheckinPrompt = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity
    style={styles.checkinPrompt}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <Ionicons name="add-circle-outline" size={18} color={Colors.teal} />
    <Text style={styles.checkinPromptText}>
      Sem check-in hoje — toque para registrar sono e recuperação
    </Text>
  </TouchableOpacity>
);

interface MetabolicScoreCardProps {
  score: number;
  details: MetabolicScoreDetails;
  onCheckinPress?: () => void;
}

export const MetabolicScoreCard: React.FC<MetabolicScoreCardProps> = ({
  score,
  details,
  onCheckinPress,
}) => {
  const scoreColor =
    score >= 80 ? Colors.success : score >= 60 ? Colors.teal : Colors.warning;

  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <View>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {score}
            <Text style={styles.scoreOf}>/100</Text>
          </Text>
          <Text style={styles.scoreLabel}>SCORE METABÓLICO</Text>
          <Text style={styles.scoreSubtitle}>Baseado em 4 componentes</Text>
        </View>
        <Ionicons
          name="heart"
          size={48}
          color={Colors.teal}
          style={{ opacity: 0.4 }}
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.componentsTitle}>Componentes do Score</Text>

      <ScoreComponentBar
        icon="checkmark-circle-outline"
        label="Aderência ao Protocolo"
        value={details.protocolAdherence}
        color={Colors.teal}
      />

      {details.wellness.hasCheckin ? (
        <>
          <ScoreComponentBar
            icon="moon-outline"
            label="Sono (check-in)"
            value={details.wellness.sleepHours}
            maxValue={10}
            unit="h"
            color={Colors.blue}
          />

          <ScoreComponentBar
            icon="battery-charging-outline"
            label="Recuperação (autoavaliação)"
            value={details.wellness.recoveryScore}
            color={Colors.success}
          />
        </>
      ) : (
        <CheckinPrompt onPress={onCheckinPress} />
      )}

      <ScoreComponentBar
        icon="scale-outline"
        label="Progresso de Peso"
        value={details.weightProgress}
        color={Colors.warning}
      />

      <ScoreComponentBar
        icon="document-text-outline"
        label="Status dos Exames"
        value={details.examsStatus}
        color={Colors.danger}
      />

      <View style={styles.footer}>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color={Colors.textMuted}
        />
        <Text style={styles.footerText}>
          Aderência e peso são calculados a partir do seu uso do app; sono e
          recuperação vêm do seu check-in diário
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
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
    marginTop: 4,
  },
  scoreSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  componentsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  componentContainer: {
    marginBottom: 16,
  },
  componentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  componentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  componentLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  componentValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  checkinPrompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    padding: 12,
    marginBottom: 16,
  },
  checkinPromptText: {
    fontSize: 12,
    color: Colors.teal,
    flex: 1,
    fontWeight: "500",
  },
});
