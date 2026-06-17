import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Biometrics">;
};

const frequencyOptions = [
  "1x por semana",
  "2x por semana",
  "3x por semana",
  "4x por semana",
  "5x ou mais",
];

const sexOptions = ["Masculino", "Feminino"];

export default function BiometricsScreen({ navigation }: Props) {
  const [age, setAge] = useState("26");
  const [sex, setSex] = useState("Masculino");
  const [height, setHeight] = useState("1.90");
  const [weight, setWeight] = useState("133");
  const [frequency, setFrequency] = useState("3x por semana");
  const [showFreqPicker, setShowFreqPicker] = useState(false);

  const imc = parseFloat(weight) / (parseFloat(height) * parseFloat(height));
  const imcValue = isNaN(imc) ? 0 : imc.toFixed(1);

  const getImcLabel = (val: number) => {
    if (val < 18.5) return "Abaixo do Peso";
    if (val < 25) return "Peso Normal";
    if (val < 30) return "Sobrepeso";
    if (val < 35) return "Obesidade Grau I";
    if (val < 40) return "Obesidade Grau II";
    return "Obesidade Grau III";
  };

  const imcLabel = getImcLabel(imc);
  const imcDanger = imc >= 30;

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "66%" }]} />
          </View>

          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <Text style={styles.sectionHeader}>Suas Medidas</Text>

          {/* Row: Age + Sex */}
          <View style={styles.row2}>
            <View style={styles.col}>
              <Text style={GlobalStyles.inputLabel}>Idade</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textMuted}
                />
                <Text style={styles.inputSuffix}>anos</Text>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={GlobalStyles.inputLabel}>Sexo</Text>
              <View style={styles.inputWrapper}>
                <Text style={[styles.input, { color: Colors.textPrimary }]}>
                  {sex}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={Colors.textMuted}
                  style={{ paddingRight: 12 }}
                />
              </View>
            </View>
          </View>

          {/* Row: Height + Weight */}
          <View style={styles.row2}>
            <View style={styles.col}>
              <Text style={GlobalStyles.inputLabel}>Altura</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.textMuted}
                />
                <Text style={styles.inputSuffix}>m</Text>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={GlobalStyles.inputLabel}>Peso Atual</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.textMuted}
                />
                <Text style={styles.inputSuffix}>kg</Text>
              </View>
            </View>
          </View>

          {/* IMC Badge */}
          <View
            style={[
              styles.imcBadge,
              imcDanger ? styles.imcBadgeDanger : styles.imcBadgeNormal,
            ]}
          >
            <View style={GlobalStyles.row}>
              {imcDanger && (
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={Colors.danger}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[
                  styles.imcValue,
                  { color: imcDanger ? Colors.danger : Colors.teal },
                ]}
              >
                IMC: {imcValue}
              </Text>
            </View>
            <Text
              style={[
                styles.imcLabel,
                { color: imcDanger ? Colors.dangerLight : Colors.tealLight },
              ]}
            >
              {imcLabel}
            </Text>
          </View>

          {/* Frequency */}
          <Text style={[GlobalStyles.inputLabel, { marginTop: 16 }]}>
            Frequência de Treino
          </Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowFreqPicker(!showFreqPicker)}
          >
            <Text
              style={[styles.input, { color: Colors.textPrimary, flex: 1 }]}
            >
              {frequency}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.textMuted}
              style={{ paddingRight: 12 }}
            />
          </TouchableOpacity>

          {showFreqPicker && (
            <View style={styles.picker}>
              {frequencyOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.pickerItem}
                  onPress={() => {
                    setFrequency(opt);
                    setShowFreqPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      opt === frequency && styles.pickerItemSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 32 }} />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("MainTabs")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.teal, Colors.tealDark]}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={GlobalStyles.btnPrimaryText}>Finalizar Perfil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 2,
  },
  backBtn: {
    marginBottom: 16,
    width: 32,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  row2: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  col: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 50,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  inputSuffix: {
    paddingRight: 12,
    color: Colors.textMuted,
    fontSize: 13,
  },
  imcBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  imcBadgeDanger: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: Colors.danger,
  },
  imcBadgeNormal: {
    backgroundColor: "rgba(0,201,177,0.12)",
    borderColor: Colors.teal,
  },
  imcValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  imcLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    overflow: "hidden",
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  pickerItemSelected: {
    color: Colors.teal,
    fontWeight: "600",
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
