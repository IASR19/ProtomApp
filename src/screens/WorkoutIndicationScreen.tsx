import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "WorkoutIndication"
  >;
}

export function getExerciseGifUrl(exerciseName: string): string {
  if (!exerciseName) return `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0025.gif`;

  const name = exerciseName.toLowerCase().trim();
  
  // 1. Try to extract English name from parentheses, e.g. "Supino Reto (barbell bench press)" -> "barbell bench press"
  const match = name.match(/\(([^)]+)\)/);
  const englishName = match ? match[1].trim() : name;

  // Import our JSON mapping
  const exerciseGifsMap = require("../utils/exerciseGifsMap.json");

  // 2. Check if the exact english name is in our catalog
  if (exerciseGifsMap[englishName]) {
    return `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/${exerciseGifsMap[englishName]}.gif`;
  }

  // 3. Check legacy translation map BEFORE fuzzy substring catalog search
  const legacyMap: Record<string, string> = {
    "supino": "0025",
    "agachamento": "0043",
    "flexão": "0662",
    "remada": "0292",
    "prancha": "0464",
    "plank": "0464",
    "crucifixo": "0308",
    "desenvolvimento": "0067",
    "elevação": "0334",
    "terra": "0032",
    "barra": "0652",
  };

  for (const key of Object.keys(legacyMap)) {
    if (name.includes(key) || englishName.includes(key)) {
      return `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/${legacyMap[key]}.gif`;
    }
  }

  // 4. Fallback to fuzzy substring match in the catalog
  for (const key of Object.keys(exerciseGifsMap)) {
    if (englishName.includes(key) || key.includes(englishName)) {
      return `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/${exerciseGifsMap[key]}.gif`;
    }
  }

  return `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0025.gif`; // global default
}

const formatDisplayName = (name: string) => {
  if (!name) return "";
  return name.split(" (")[0];
};

export default function WorkoutIndicationScreen({ navigation }: Props) {
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await api.get<any>("/workout/today");
        setWorkout(data);
      } catch (err: any) {
        console.warn("Erro ao buscar treino:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, []);

  useEffect(() => {
    if (videoModalVisible && selectedExercise) {
      setImageLoading(true);
      const timer = setTimeout(() => {
        setImageLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setImageLoading(false);
    }
  }, [videoModalVisible, selectedExercise]);

  if (loading && !workout) {
    return (
      <SafeAreaView style={[GlobalStyles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </SafeAreaView>
    );
  }

  const w = workout || {
    title: "Treino Livre",
    description: "Foco em gasto calórico diário",
    duration: 45,
    calories: 300,
    exercises: [],
    cardio: "Cardio: 30min Caminhada Livre",
  };

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
          <Text style={styles.screenTitle}>Treino do Dia</Text>
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* Workout Header Card */}
        <LinearGradient
          colors={["#1A3A6A", "#0F2A4A"]}
          style={styles.workoutHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.workoutTitle}>{w.title}</Text>
          <Text style={styles.workoutDesc}>{w.description}</Text>
          <View style={styles.workoutMeta}>
            <View style={GlobalStyles.row}>
              <Ionicons
                name="time-outline"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}> {w.duration} min</Text>
            </View>
            <View style={GlobalStyles.row}>
              <Ionicons
                name="flame-outline"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}> ~{w.calories} kcal</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Exercises */}
        <View style={styles.exerciseList}>
          {w.exercises && w.exercises.map((ex: any, index: number) => (
            <TouchableOpacity
              key={ex.id || `${ex.name}-${index}`}
              style={styles.exerciseCard}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedExercise(ex);
                setVideoModalVisible(true);
              }}
            >
              <View style={styles.exerciseIcon}>
                <Ionicons
                  name="barbell-outline"
                  size={20}
                  color={Colors.teal}
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{formatDisplayName(ex.name)}</Text>
                <Text style={styles.exerciseSets}>
                  {ex.sets} séries x {ex.reps} repetições
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Cardio Block */}
        {w.cardio ? (
          <View style={styles.cardioBlock}>
            <Ionicons name="walk-outline" size={18} color={Colors.warning} />
            <Text style={styles.cardioText}> {w.cardio}</Text>
          </View>
        ) : null}

        {/* CTA */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Workout3D")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.teal, Colors.tealDark]}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="play" size={18} color={Colors.white} />
            <Text style={[GlobalStyles.btnPrimaryText, { marginLeft: 8 }]}>
              Iniciar Treino
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Exercise Execution Video Modal */}
        <Modal
          visible={videoModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setVideoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{formatDisplayName(selectedExercise?.name)}</Text>
                <TouchableOpacity onPress={() => setVideoModalVisible(false)}>
                  <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.videoContainer}>
                {selectedExercise && (
                  <>
                    <Image
                      source={{ uri: getExerciseGifUrl(selectedExercise.name) }}
                      style={styles.gifImage}
                      resizeMode="contain"
                      onLoadStart={() => setImageLoading(true)}
                      onLoadEnd={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                      <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color={Colors.teal} />
                      </View>
                    )}
                  </>
                )}
              </View>

              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Guia de Execução</Text>
                <Text style={styles.instructionsText}>
                  Mantenha a postura alinhada, execute o movimento de forma controlada (cadência 2-0-2) e controle a respiração durante as {selectedExercise?.sets} séries de {selectedExercise?.reps} repetições.
                </Text>
              </View>
            </View>
          </View>
        </Modal>
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
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  workoutHeader: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  workoutDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  exerciseList: {
    gap: 10,
    marginBottom: 12,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,201,177,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  exerciseSets: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardioBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245,158,11,0.10)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.warning,
    marginBottom: 28,
  },
  cardioText: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: "600",
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 22, 40, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
    maxHeight: "80%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  videoContainer: {
    height: 240,
    backgroundColor: "#0A1520",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
  },
  gifImage: {
    width: "100%",
    height: "100%",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10, 22, 40, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionsContainer: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.teal,
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
