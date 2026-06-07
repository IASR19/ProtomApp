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
import { mockExams } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ExamsUpload">;
};

export default function ExamsUploadScreen({ navigation }: Props) {
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
          <Text style={styles.screenTitle}>Meus Exames</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Upload Area */}
        <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={40} color={Colors.blue} />
          <Text style={styles.uploadTitle}>Toque para enviar PDF ou Foto</Text>
          <Text style={styles.uploadSubtitle}>
            A IA extrairá os dados automaticamente
          </Text>
          <View style={styles.aiBadge}>
            <Ionicons
              name="hardware-chip-outline"
              size={12}
              color={Colors.purple}
            />
            <Text style={styles.aiBadgeText}>
              {" "}
              Visão Computacional (OCR) + LLM
            </Text>
          </View>
        </TouchableOpacity>

        {/* Recent Exams */}
        <Text style={[GlobalStyles.sectionTitle, { marginTop: 24 }]}>
          Exames Recentes
        </Text>

        <View style={styles.examsList}>
          {mockExams.map((exam) => (
            <View key={exam.id} style={styles.examCard}>
              <View
                style={[
                  styles.examIcon,
                  exam.type === "pdf" ? styles.examIconPdf : styles.examIconImg,
                ]}
              >
                <Ionicons
                  name={exam.type === "pdf" ? "document-text" : "image"}
                  size={20}
                  color={exam.type === "pdf" ? Colors.danger : Colors.blue}
                />
              </View>
              <View style={styles.examInfo}>
                <Text style={styles.examName}>{exam.name}</Text>
                <Text style={styles.examDate}>{exam.date}</Text>
              </View>
              <View style={styles.examStatus}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.success}
                />
                <Text style={styles.examStatusText}> {exam.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={() => navigation.navigate("ExamsEvolution")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            style={styles.analyzeBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="pencil-outline" size={16} color={Colors.white} />
            <Text style={styles.analyzeBtnText}> Analisar Novos Exames</Text>
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
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.blue,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 32,
    alignItems: "center",
    backgroundColor: "rgba(59,130,246,0.05)",
    gap: 8,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  uploadSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139,92,246,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.purple,
    marginTop: 4,
  },
  aiBadgeText: {
    fontSize: 11,
    color: Colors.purple,
    fontWeight: "600",
  },
  examsList: {
    gap: 10,
  },
  examCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  examIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  examIconPdf: {
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  examIconImg: {
    backgroundColor: "rgba(59,130,246,0.15)",
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  examDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  examStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  examStatusText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "600",
  },
  analyzeBtn: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 28,
  },
  analyzeBtnGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  analyzeBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
