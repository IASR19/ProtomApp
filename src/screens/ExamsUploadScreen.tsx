import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ExamsUpload">;
};

interface Exam {
  id: string;
  name: string;
  date: string;
  status: string;
  type: string;
}

export default function ExamsUploadScreen({ navigation }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  const reloadExams = () => {
    return api
      .get<Exam[]>("/exams")
      .then((data) => setExams(data))
      .catch((err) => console.warn("Erro ao carregar exames:", err.message));
  };

  useEffect(() => {
    reloadExams().finally(() => setLoading(false));
  }, []);

  const uploadFile = async (uri: string, name: string, mimeType: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", { uri, name, type: mimeType } as any);
      const exam = await api.upload<Exam>("/exams/upload", formData);
      setExams((prev) => [exam, ...prev]);
      if (exam.status === "Falha na Análise") {
        Alert.alert(
          "Não foi possível analisar automaticamente",
          "Revise os dados manualmente para concluir o cadastro deste exame.",
        );
        openEdit(exam);
      }
    } catch (err: any) {
      Alert.alert("Erro ao enviar exame", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePickPhoto = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera/galeria para continuar.");
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    await uploadFile(asset.uri, asset.fileName || "exame.jpg", asset.mimeType || "image/jpeg");
  };

  const handlePickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    await uploadFile(asset.uri, asset.name || "exame.pdf", asset.mimeType || "application/pdf");
  };

  const handleUploadPress = () => {
    Alert.alert("Enviar exame", "Escolha como deseja enviar o exame", [
      { text: "Tirar Foto", onPress: () => handlePickPhoto(true) },
      { text: "Escolher da Galeria", onPress: () => handlePickPhoto(false) },
      { text: "Selecionar PDF", onPress: handlePickPdf },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const openEdit = (exam: Exam) => {
    setEditingExam(exam);
    setEditName(exam.name === "Exame em análise" ? "" : exam.name);
    setEditDate(exam.date);
  };

  const saveEdit = async () => {
    if (!editingExam) return;
    try {
      const updated = await api.patch<Exam>(`/exams/${editingExam.id}`, {
        name: editName,
        date: editDate,
      });
      setExams((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEditingExam(null);
    } catch (err: any) {
      Alert.alert("Erro ao salvar", err.message);
    }
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
          <Text style={styles.screenTitle}>Meus Exames</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Upload Area */}
        <TouchableOpacity
          style={styles.uploadArea}
          activeOpacity={0.7}
          onPress={handleUploadPress}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="large" color={Colors.blue} />
          ) : (
            <Ionicons name="cloud-upload-outline" size={40} color={Colors.blue} />
          )}
          <Text style={styles.uploadTitle}>
            {uploading ? "Analisando exame..." : "Toque para enviar PDF ou Foto"}
          </Text>
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.teal}
            style={{ marginTop: 20 }}
          />
        ) : exams.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-outline"
              size={40}
              color={Colors.textMuted}
            />
            <Text style={styles.emptyText}>
              Nenhum exame enviado ainda.
            </Text>
            <Text style={styles.emptySubText}>
              Seus exames analisados pela IA aparecerão aqui.
            </Text>
          </View>
        ) : (
          <View style={styles.examsList}>
            {exams.map((exam) => {
              const failed = exam.status === "Falha na Análise";
              const processing = exam.status === "Processando";
              const statusColor = failed
                ? Colors.danger
                : processing
                  ? Colors.warning
                  : Colors.success;
              const statusIcon = failed
                ? "alert-circle"
                : processing
                  ? "time"
                  : "checkmark-circle";
              return (
                <TouchableOpacity
                  key={exam.id}
                  style={styles.examCard}
                  activeOpacity={failed ? 0.7 : 1}
                  onPress={() => failed && openEdit(exam)}
                >
                  <View
                    style={[
                      styles.examIcon,
                      exam.type === "pdf"
                        ? styles.examIconPdf
                        : styles.examIconImg,
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
                  <View style={[styles.examStatus, { backgroundColor: `${statusColor}1A` }]}>
                    <Ionicons name={statusIcon as any} size={14} color={statusColor} />
                    <Text style={[styles.examStatusText, { color: statusColor }]}> {exam.status}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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

      <Modal visible={!!editingExam} transparent animationType="fade" onRequestClose={() => setEditingExam(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Revisar exame</Text>
            <Text style={styles.modalLabel}>Nome do exame</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Ex: Hemograma Completo"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.modalLabel}>Data (dd/mm/aaaa)</Text>
            <TextInput
              style={styles.modalInput}
              value={editDate}
              onChangeText={setEditDate}
              placeholder="15/05/2026"
              placeholderTextColor={Colors.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEditingExam(null)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveEdit}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  modalSaveBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalSaveText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
