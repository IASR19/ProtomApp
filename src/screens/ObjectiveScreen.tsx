import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Objective">;
};

const objectives = [
  {
    id: "Emagrecimento",
    label: "Emagrecimento",
    description: "Redução de gordura corporal",
    icon: "body-outline" as const,
  },
  {
    id: "Hipertrofia",
    label: "Hipertrofia",
    description: "Ganho de massa muscular",
    icon: "barbell-outline" as const,
  },
  {
    id: "Performance",
    label: "Performance",
    description: "Melhora de rendimento físico",
    icon: "flash-outline" as const,
  },
];

export default function ObjectiveScreen({ navigation }: Props) {
  const [selected, setSelected] = useState("Emagrecimento");

  const progressWidths = ["33%", "66%", "100%"];

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "33%" }]} />
        </View>

        <Text style={styles.title}>Qual é o seu objetivo{"\n"}principal?</Text>
        <Text style={styles.subtitle}>
          Isso nos ajudará a personalizar seu protocolo.
        </Text>

        <View style={styles.optionsList}>
          {objectives.map((obj) => {
            const isSelected = selected === obj.id;
            return (
              <TouchableOpacity
                key={obj.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(obj.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconBox, isSelected && styles.iconBoxSelected]}
                >
                  <Ionicons
                    name={obj.icon}
                    size={22}
                    color={isSelected ? Colors.teal : Colors.textSecondary}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {obj.label}
                  </Text>
                  <Text style={styles.optionDesc}>{obj.description}</Text>
                </View>
                <View
                  style={[styles.radio, isSelected && styles.radioSelected]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Biometrics")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.teal, Colors.tealDark]}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={GlobalStyles.btnPrimaryText}>Continuar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.bgCard,
    borderRadius: 2,
    marginBottom: 28,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  optionsList: {
    gap: 12,
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  optionCardSelected: {
    borderColor: Colors.teal,
    backgroundColor: Colors.bgCardLight,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: {
    backgroundColor: "rgba(0, 201, 177, 0.15)",
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: Colors.textPrimary,
  },
  optionDesc: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
