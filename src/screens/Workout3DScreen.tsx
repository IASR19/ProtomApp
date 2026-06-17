import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getExerciseGifUrl } from "./WorkoutIndicationScreen";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Workout3D">;
}

interface WorkoutData {
  title: string;
  description?: string;
  duration: number;
  calories: number;
  cardio?: string;
  exercises: { id: string; name: string; sets: number; reps: number; weight: number }[];
  bpm?: number;
  caloriesBurned?: number;
  progress?: number;
}

// SVG-style avatar built with View components (heatmap effect)
function BodyAvatar({ pulseAnim }: { pulseAnim: Animated.Value }) {
  return (
    <View style={avatarStyles.container}>
      {/* Head */}
      <View style={avatarStyles.head} />
      {/* Torso */}
      <View style={avatarStyles.torso}>
        {/* Animated pulsing chest heatspot */}
        <Animated.View
          style={[avatarStyles.heatspot, { transform: [{ scale: pulseAnim }] }]}
        />
      </View>
      {/* Arms */}
      <View style={avatarStyles.armsRow}>
        <View style={avatarStyles.arm} />
        <View style={{ width: 50 }} />
        <View style={avatarStyles.arm} />
      </View>
      {/* Legs */}
      <View style={avatarStyles.legsRow}>
        <View style={avatarStyles.leg} />
        <View style={{ width: 12 }} />
        <View style={avatarStyles.leg} />
      </View>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  head: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.teal,
    marginBottom: 4,
  },
  torso: {
    width: 90,
    height: 110,
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 12,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heatspot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(239,68,68,0.75)",
    position: "absolute",
    top: 20,
  },
  armsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  arm: {
    width: 24,
    height: 80,
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 12,
  },
  legsRow: {
    flexDirection: "row",
  },
  leg: {
    width: 34,
    height: 100,
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 12,
  },
});

export default function Workout3DScreen({ navigation }: Props) {
  const [playing, setPlaying] = useState(true);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Determine current exercise from workout data
  const firstExercise = workout?.exercises?.[0];
  const currentExercise = firstExercise?.name ?? "Aguardando Treino";
  const currentSerie = 1;
  const totalSeries = firstExercise?.sets ?? 4;
  const reps = firstExercise?.reps ?? 12;
  const weight = firstExercise?.weight ?? 0;
  const bpm = workout?.bpm ?? 142;
  const caloriesBurned = workout?.caloriesBurned ?? workout?.calories ?? 0;
  const progress = workout?.progress ?? 0.65;

  const selectedExercise = firstExercise || {
    id: "default",
    name: currentExercise,
    sets: totalSeries,
    reps: reps,
    weight: weight,
  };

  useEffect(() => {
    api
      .get<WorkoutData>("/workout/today")
      .then((data) => setWorkout(data))
      .catch((err) => console.warn("Erro ao carregar treino:", err.message))
      .finally(() => setLoading(false));
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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.45,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanAnim, pulseAnim]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });

  const scanOpacity = scanAnim.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });



  return (
    <SafeAreaView
      style={[GlobalStyles.safeArea, { backgroundColor: "#060E1C" }]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#060E1C" />

      {/* Top HUD */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>MODO IMERSIVO</Text>
        <TouchableOpacity style={styles.fullscreenBtn}>
          <Ionicons
            name="expand-outline"
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.teal}
          style={{ flex: 1 }}
        />
      ) : (
        <>
          {/* Stats HUD */}
          <View style={styles.hudRow}>
            <View style={[styles.hudCard, { borderColor: Colors.danger }]}>
              <View style={GlobalStyles.row}>
                <Text style={[styles.hudValue, { color: Colors.danger }]}>
                  {bpm}
                </Text>
                <Ionicons
                  name="heart"
                  size={14}
                  color={Colors.danger}
                  style={{ marginLeft: 4 }}
                />
              </View>
              <Text style={styles.hudLabel}>BPM (APPLE{"\n"}WATCH)</Text>
            </View>
            <View style={[styles.hudCard, { borderColor: Colors.warning }]}>
              <Text style={[styles.hudValue, { color: Colors.warning }]}>
                {caloriesBurned}
              </Text>
              <Text style={styles.hudLabel}>KCAL QUEIMADAS</Text>
            </View>
          </View>

          {/* 3D Body */}
          <View style={styles.bodyContainer}>
            <BodyAvatar pulseAnim={pulseAnim} />
            {/* Animated laser scan line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanTranslateY }],
                  opacity: scanOpacity,
                },
              ]}
            />
            {/* Secondary glow scan */}
            <Animated.View
              style={[
                styles.scanLineGlow,
                {
                  transform: [{ translateY: scanTranslateY }],
                  opacity: scanOpacity,
                },
              ]}
            />
          </View>

          {/* Exercise Info */}
          <View style={styles.exercisePanel}>
            <Text style={styles.exerciseName}>{currentExercise.split(" (")[0]}</Text>
            <Text style={styles.exerciseMeta}>
              Série {currentSerie}/{totalSeries} • {reps} Repetições • {weight}kg
            </Text>

            <TouchableOpacity
              style={styles.viewExecutionBtn}
              onPress={() => setVideoModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="videocam" size={16} color={Colors.teal} />
              <Text style={styles.viewExecutionBtnText}>Ver Execução (GIF)</Text>
            </TouchableOpacity>

            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlBtn}>
                <Ionicons
                  name="play-skip-back"
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => setPlaying(!playing)}
              >
                <Ionicons
                  name={playing ? "pause" : "play"}
                  size={26}
                  color={Colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn}>
                <Ionicons
                  name="play-skip-forward"
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

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
                  <Text style={styles.modalTitle}>{selectedExercise?.name ? selectedExercise.name.split(" (")[0] : ""}</Text>
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  fullscreenBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  hudRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  hudCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    minWidth: 100,
  },
  hudValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  hudLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 2,
    lineHeight: 13,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    width: "70%",
    height: 2,
    backgroundColor: Colors.teal,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 8,
    elevation: 8,
  },
  scanLineGlow: {
    position: "absolute",
    width: "70%",
    height: 20,
    backgroundColor: "rgba(0,201,177,0.08)",
  },
  exercisePanel: {
    backgroundColor: Colors.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  exerciseMeta: {
    fontSize: 13,
    color: Colors.teal,
    textAlign: "center",
    fontWeight: "500",
  },
  viewExecutionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 201, 177, 0.1)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
    marginTop: 6,
    gap: 6,
  },
  viewExecutionBtnText: {
    fontSize: 13,
    color: Colors.teal,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.bgCard,
    borderRadius: 2,
    overflow: "hidden",
    marginVertical: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    marginTop: 8,
  },
  controlBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.teal,
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
