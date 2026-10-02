import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { api, ApiError } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "DailyCheckin">;
};

const RATING_OPTIONS = [1, 2, 3, 4, 5];

interface RatingRowProps {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingRow: React.FC<RatingRowProps> = ({
  label,
  lowLabel,
  highLabel,
  value,
  onChange,
}) => (
  <View style={styles.ratingRow}>
    <Text style={styles.ratingLabel}>{label}</Text>
    <View style={styles.ratingOptions}>
      {RATING_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.ratingOption,
            value === option && styles.ratingOptionSelected,
          ]}
          onPress={() => onChange(option)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.ratingOptionText,
              value === option && styles.ratingOptionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.ratingScaleLabels}>
      <Text style={styles.ratingScaleLabelText}>{lowLabel}</Text>
      <Text style={styles.ratingScaleLabelText}>{highLabel}</Text>
    </View>
  </View>
);

export default function DailyCheckinScreen({ navigation }: Props) {
  const [sleepHours, setSleepHours] = useState("7");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [soreness, setSoreness] = useState(3);
  const [stress, setStress] = useState(3);
  const [mood, setMood] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const hours = parseFloat(sleepHours.replace(",", "."));
    if (Number.isNaN(hours) || hours < 0 || hours > 24) {
      Alert.alert("Ops", "Informe um número de horas válido (0 a 24).");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/wellness/checkin", {
        sleepHours: hours,
        sleepQuality,
        fatigue,
        soreness,
        stress,
        mood,
      });
      navigation.goBack();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro inesperado ao salvar seu check-in.";
      Alert.alert("Não foi possível salvar", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Check-in Diário</Text>
        </View>

        <Text style={styles.subtitle}>
          Sem wearable conectado, usamos sua autoavaliação para calcular sono
          e recuperação do Score Metabólico. Leva menos de 1 minuto.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Quantas horas você dormiu?</Text>
          <View style={styles.sleepInputRow}>
            <TextInput
              style={styles.sleepInput}
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="decimal-pad"
              maxLength={4}
              placeholder="7.5"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.sleepInputUnit}>horas</Text>
          </View>

          <RatingRow
            label="Qualidade do sono"
            lowLabel="Péssima"
            highLabel="Ótima"
            value={sleepQuality}
            onChange={setSleepQuality}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Como você está se sentindo hoje?</Text>

          <RatingRow
            label="Fadiga"
            lowLabel="Nenhuma"
            highLabel="Extrema"
            value={fatigue}
            onChange={setFatigue}
          />
          <RatingRow
            label="Dor muscular"
            lowLabel="Nenhuma"
            highLabel="Extrema"
            value={soreness}
            onChange={setSoreness}
          />
          <RatingRow
            label="Estresse"
            lowLabel="Nenhum"
            highLabel="Extremo"
            value={stress}
            onChange={setStress}
          />
          <RatingRow
            label="Humor / disposição"
            lowLabel="Péssimo"
            highLabel="Ótimo"
            value={mood}
            onChange={setMood}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Salvar check-in</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  sleepInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgInput,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  sleepInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  sleepInputUnit: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  ratingRow: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: "500",
  },
  ratingOptions: {
    flexDirection: "row",
    gap: 8,
  },
  ratingOption: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.bgInput,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingOptionSelected: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  ratingOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  ratingOptionTextSelected: {
    color: Colors.bgPrimary,
  },
  ratingScaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  ratingScaleLabelText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  submitBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.bgPrimary,
  },
});
