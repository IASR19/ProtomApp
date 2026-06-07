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
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { mockExamEvolution } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ExamsEvolution">;
};

const MiniBar = ({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) => (
  <View style={styles.miniBarContainer}>
    <View
      style={[
        styles.miniBar,
        { height: (value / max) * 60, backgroundColor: color },
      ]}
    />
  </View>
);

export default function ExamsEvolutionScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>EVOLUÇÃO</Text>
          <Ionicons
            name="funnel-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* Success Banner */}
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.successText}>
            {" "}
            Todos os marcadores analisados estão dentro do padrão ideal.
          </Text>
        </View>

        {/* Charts */}
        <View style={styles.chartList}>
          {mockExamEvolution.map((exam) => {
            const improving = exam.current < exam.previous;
            const max = Math.max(exam.previous, exam.current) * 1.2;
            return (
              <View key={exam.id} style={styles.chartCard}>
                <View style={GlobalStyles.spaceBetween}>
                  <Text style={styles.chartName}>{exam.name}</Text>
                  <View style={GlobalStyles.row}>
                    <Text style={styles.chartValue}>
                      {exam.current}{" "}
                      <Text style={styles.chartUnit}>{exam.unit}</Text>
                    </Text>
                  </View>
                </View>

                {/* Delta */}
                <View style={GlobalStyles.row}>
                  <Ionicons
                    name={improving ? "arrow-down" : "arrow-up"}
                    size={14}
                    color={improving ? Colors.success : Colors.danger}
                  />
                  <Text
                    style={[
                      styles.chartDelta,
                      { color: improving ? Colors.success : Colors.danger },
                    ]}
                  >
                    {" "}
                    de {exam.previous}
                  </Text>
                </View>

                {/* Bars */}
                <View style={styles.barsRow}>
                  <View style={styles.barGroup}>
                    <MiniBar
                      value={exam.previous}
                      max={max}
                      color={Colors.bgCardLight}
                    />
                    <Text style={styles.barLabel}>{exam.monthPrevious}</Text>
                  </View>
                  <View style={styles.barGroup}>
                    <MiniBar
                      value={exam.current}
                      max={max}
                      color={Colors.teal}
                    />
                    <Text style={styles.barLabel}>{exam.monthCurrent}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Warning box */}
        <View style={styles.warningBox}>
          <View style={GlobalStyles.row}>
            <Ionicons name="warning" size={14} color={Colors.danger} />
            <Text style={styles.warningTitle}> E se houvesse alteração?</Text>
          </View>
          <Text style={styles.warningText}>
            Se a Glicemia subisse para 110 mg/dL, o gráfico ficaria vermelho e
            um alerta visual seria ativado no Dashboard.
          </Text>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.12)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.success,
    marginBottom: 20,
  },
  successText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  chartList: {
    gap: 14,
  },
  chartCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  chartName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  chartValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.teal,
  },
  chartUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "400",
  },
  chartDelta: {
    fontSize: 12,
    fontWeight: "500",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20,
    marginTop: 8,
    height: 80,
  },
  barGroup: {
    alignItems: "center",
    gap: 4,
  },
  miniBarContainer: {
    width: 28,
    height: 60,
    justifyContent: "flex-end",
    backgroundColor: Colors.bgPrimary,
    borderRadius: 4,
  },
  miniBar: {
    width: 28,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  warningBox: {
    marginTop: 20,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.danger,
    gap: 8,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.danger,
  },
  warningText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
