import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { mockBodyScan } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "BodyScan">;
}

interface ScanTagProps {
  value: string;
  label: string;
  delta: string;
  improving: boolean;
  x: number;
  y: number;
}

function ScanTag({
  value,
  label,
  delta,
  improving,
}: Omit<ScanTagProps, "x" | "y">) {
  return (
    <View style={scanTagStyles.container}>
      <Text style={scanTagStyles.value}>{value}</Text>
      <Text style={scanTagStyles.label}>{label}</Text>
      <View style={scanTagStyles.deltaRow}>
        <Ionicons
          name={improving ? "arrow-down" : "arrow-up"}
          size={10}
          color={improving ? Colors.success : Colors.danger}
        />
        <Text
          style={[
            scanTagStyles.delta,
            { color: improving ? Colors.success : Colors.danger },
          ]}
        >
          {" "}
          {delta}
        </Text>
      </View>
    </View>
  );
}

const scanTagStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.teal,
    minWidth: 90,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.teal,
    marginBottom: 1,
  },
  label: {
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  deltaRow: { flexDirection: "row", alignItems: "center" },
  delta: { fontSize: 10, fontWeight: "600" },
});

// Body silhouette built with View primitives
function BodySilhouette() {
  return (
    <View style={silStyles.container}>
      <View style={silStyles.head} />
      <View style={silStyles.torso} />
      <View style={silStyles.armsRow}>
        <View style={silStyles.arm} />
        <View style={{ width: 60 }} />
        <View style={silStyles.arm} />
      </View>
      <View style={silStyles.hipsRow}>
        <View style={silStyles.leg} />
        <View style={{ width: 10 }} />
        <View style={silStyles.leg} />
      </View>
    </View>
  );
}

const silStyles = StyleSheet.create({
  container: { alignItems: "center" },
  head: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.teal,
    marginBottom: 4,
  },
  torso: {
    width: 80,
    height: 90,
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 10,
    marginBottom: 4,
  },
  armsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  arm: {
    width: 22,
    height: 70,
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 11,
  },
  hipsRow: {
    flexDirection: "row",
  },
  leg: {
    width: 30,
    height: 90,
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 15,
  },
});

export default function BodyScanScreen({ navigation }: Props) {
  const data = mockBodyScan;

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanAnim]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, 160],
  });

  const scanOpacity = scanAnim.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });

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
          <Text style={styles.screenTitle}>BODY SCAN</Text>
          <Ionicons
            name="share-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* 3D Body + Tags */}
        <View style={styles.scanArea}>
          {/* Left tag */}
          <View style={styles.leftTag}>
            <ScanTag
              value={`${data.bodyFat}%`}
              label="GORDURA CORPORAL"
              delta={`${Math.abs(data.bodyFatDelta)}%`}
              improving={data.bodyFatDelta < 0}
            />
          </View>

          {/* Silhouette */}
          <BodySilhouette />
          {/* Animated laser scan line */}
          <Animated.View
            style={[
              styles.laserLine,
              {
                transform: [{ translateY: scanTranslateY }],
                opacity: scanOpacity,
              },
            ]}
            pointerEvents="none"
          />

          {/* Right tag */}
          <View style={styles.rightTag}>
            <ScanTag
              value={`Nível ${data.visceralFat}`}
              label="GORDURA VISCERAL"
              delta={`${Math.abs(data.visceralFatDelta)} Nível`}
              improving={data.visceralFatDelta < 0}
            />
          </View>
        </View>

        {/* Comparison Header */}
        <View style={GlobalStyles.spaceBetween}>
          <Text style={styles.compLabel}>{data.comparisonLabel}</Text>
          <Text style={styles.compDate}>Hoje, 08:30 AM</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.weight} kg</Text>
            <Text style={styles.statLabel}>Peso Atual</Text>
            <Text style={styles.statDelta}>
              - {Math.abs(data.weightDelta)} kg
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.waist} cm</Text>
            <Text style={styles.statLabel}>Cintura</Text>
            <Text style={styles.statDelta}>
              - {Math.abs(data.waistDelta)} cm
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.leanMass} kg</Text>
            <Text style={styles.statLabel}>Massa Magra</Text>
            <Text style={[styles.statDelta, { color: Colors.teal }]}>
              Mantida
            </Text>
          </View>
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
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  scanArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  laserLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.teal,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  leftTag: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightTag: {
    flex: 1,
    alignItems: "flex-end",
  },
  compLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  compDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
  },
  statDelta: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "600",
  },
});
