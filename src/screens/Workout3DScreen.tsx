import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { mockWorkout3D } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Workout3D">;
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
  const data = mockWorkout3D;

  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

      {/* Stats HUD */}
      <View style={styles.hudRow}>
        <View style={[styles.hudCard, { borderColor: Colors.danger }]}>
          <View style={GlobalStyles.row}>
            <Text style={[styles.hudValue, { color: Colors.danger }]}>
              {data.bpm}
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
            {data.caloriesBurned}
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
        <Text style={styles.exerciseName}>{data.currentExercise}</Text>
        <Text style={styles.exerciseMeta}>
          Série {data.currentSerie}/{data.totalSeries} • {data.reps} Repetições
          • {data.weight}kg
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${data.progress * 100}%` }]}
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
});
