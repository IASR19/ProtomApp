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
import { mockWorkout } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "WorkoutIndication"
  >;
}

export default function WorkoutIndicationScreen({ navigation }: Props) {
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
          <Text style={styles.workoutTitle}>{mockWorkout.title}</Text>
          <Text style={styles.workoutDesc}>{mockWorkout.description}</Text>
          <View style={styles.workoutMeta}>
            <View style={GlobalStyles.row}>
              <Ionicons
                name="time-outline"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}> {mockWorkout.duration} min</Text>
            </View>
            <View style={GlobalStyles.row}>
              <Ionicons
                name="flame-outline"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}> ~{mockWorkout.calories} kcal</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Exercises */}
        <View style={styles.exerciseList}>
          {mockWorkout.exercises.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              style={styles.exerciseCard}
              activeOpacity={0.8}
            >
              <View style={styles.exerciseIcon}>
                <Ionicons
                  name="barbell-outline"
                  size={20}
                  color={Colors.teal}
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
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
        <View style={styles.cardioBlock}>
          <Ionicons name="walk-outline" size={18} color={Colors.warning} />
          <Text style={styles.cardioText}> {mockWorkout.cardio}</Text>
        </View>

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
});
