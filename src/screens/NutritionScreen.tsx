import React, { useState } from "react";
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
import { mockNutrition } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Nutrition">;
}

interface MacroBarProps {
  label: string;
  grams: number;
  percent: number;
  color: string;
}

function MacroBar({ label, grams, percent, color }: MacroBarProps) {
  return (
    <View style={macroStyles.wrapper}>
      <View style={macroStyles.row}>
        <Text style={macroStyles.label}>
          {label} ({grams}g)
        </Text>
        <Text style={macroStyles.percent}>{percent}%</Text>
      </View>
      <View style={macroStyles.track}>
        <View
          style={[
            macroStyles.fill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const macroStyles = StyleSheet.create({
  wrapper: { gap: 6, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 13, color: Colors.textSecondary },
  percent: { fontSize: 13, fontWeight: "600", color: Colors.textPrimary },
  track: {
    height: 6,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
});

export default function NutritionScreen({ navigation }: Props) {
  const [analysed, setAnalysed] = useState(true);
  const data = mockNutrition;

  const withinGoal = data.totalKcal <= data.goalKcal;

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
          <Text style={styles.screenTitle}>ANÁLISE DE REFEIÇÃO</Text>
          <Ionicons
            name="camera-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* Camera Frame */}
        <View style={styles.cameraFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          {!analysed ? (
            <View style={styles.processingContainer}>
              <Ionicons
                name="restaurant-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.processingText}>PROCESSANDO IMAGEM...</Text>
            </View>
          ) : (
            <View style={styles.analysedContainer}>
              <Ionicons
                name="checkmark-circle"
                size={40}
                color={Colors.success}
              />
              <Text style={styles.analysedText}>
                Imagem analisada com sucesso
              </Text>
            </View>
          )}
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        {/* Result Card */}
        <View style={styles.resultCard}>
          <View style={GlobalStyles.spaceBetween}>
            <Text style={styles.mealName}>{data.meal}</Text>
            <Text style={styles.kcalValue}>{data.totalKcal} kcal</Text>
          </View>

          <View
            style={[
              styles.goalBadge,
              withinGoal ? styles.goalOk : styles.goalOver,
            ]}
          >
            <Ionicons
              name={withinGoal ? "checkmark-circle" : "warning"}
              size={14}
              color={withinGoal ? Colors.success : Colors.danger}
            />
            <Text
              style={[
                styles.goalText,
                { color: withinGoal ? Colors.success : Colors.danger },
              ]}
            >
              {withinGoal
                ? ` Dentro da meta (${data.goalKcal} kcal)`
                : ` Acima da meta (${data.goalKcal} kcal)`}
            </Text>
          </View>

          <View style={styles.divider} />

          <MacroBar
            label="Proteína"
            grams={data.protein.grams}
            percent={data.protein.percent}
            color={Colors.blue}
          />
          <MacroBar
            label="Carboidrato"
            grams={data.carb.grams}
            percent={data.carb.percent}
            color={Colors.warning}
          />
          <MacroBar
            label="Gordura"
            grams={data.fat.grams}
            percent={data.fat.percent}
            color={Colors.purple}
          />
        </View>

        {/* Confirm */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.teal, Colors.tealDark]}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="checkmark" size={18} color={Colors.white} />
            <Text style={[GlobalStyles.btnPrimaryText, { marginLeft: 8 }]}>
              Confirmar Refeição
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cameraFrame: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.teal,
  },
  cornerTR: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.teal,
  },
  cornerBL: {
    position: "absolute",
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.teal,
  },
  cornerBR: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.teal,
  },
  processingContainer: {
    alignItems: "center",
    gap: 10,
  },
  processingText: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontWeight: "600",
  },
  analysedContainer: {
    alignItems: "center",
    gap: 8,
  },
  analysedText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: "500",
  },
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    gap: 6,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  kcalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.warning,
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  goalOk: {
    backgroundColor: "rgba(16,185,129,0.12)",
  },
  goalOver: {
    backgroundColor: "rgba(239,68,68,0.12)",
  },
  goalText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
