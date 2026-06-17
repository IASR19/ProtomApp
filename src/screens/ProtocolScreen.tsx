import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, G } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> =
  {
    NUTRIÇÃO: { bg: "rgba(20,83,45,0.6)", text: "#4ADE80", border: "#166534" },
    MEDICAÇÃO: {
      bg: "rgba(124,45,18,0.6)",
      text: "#FCA5A5",
      border: "#9A3412",
    },
    PERFORMANCE: {
      bg: "rgba(30,58,95,0.6)",
      text: "#60A5FA",
      border: "#1E40AF",
    },
    BIOHACKING: {
      bg: "rgba(45,27,105,0.6)",
      text: "#A78BFA",
      border: "#5B21B6",
    },
  };

const PHASE_BORDER: Record<string, string> = {
  MANHÃ: Colors.warning,
  TARDE: Colors.blue,
  NOITE: Colors.purple,
};

const RING_SIZE = 130;
const RING_STROKE = 11;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function RingProgress({ value, color }: { value: number; color: string }) {
  const offset = RING_CIRC * (1 - value / 100);
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;
  return (
    <View
      style={{
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{ position: "absolute" }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={RING_RADIUS}
          stroke={Colors.bgPrimary}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <G rotation={-90} origin={`${cx}, ${cy}`}>
          <Circle
            cx={cx}
            cy={cy}
            r={RING_RADIUS}
            stroke={color}
            strokeWidth={RING_STROKE}
            fill="none"
            strokeDasharray={`${RING_CIRC}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Text style={styles.ringValue}>{value}</Text>
      <Text style={styles.ringUnit}>%</Text>
    </View>
  );
}

function TaskCard({
  task,
  onToggle,
}: {
  task: any;
  onToggle: () => void;
}) {
  const tag = TAG_COLORS[task.tag] ?? {
    bg: Colors.bgCard,
    text: Colors.textSecondary,
    border: Colors.border,
  };
  return (
    <View style={[styles.taskCard, { borderLeftColor: tag.text }]}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTimeBadge}>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
        <View
          style={[
            styles.tagPill,
            { backgroundColor: tag.bg, borderColor: tag.border },
          ]}
        >
          <Text style={[styles.tagText, { color: tag.text }]}>{task.tag}</Text>
        </View>
        <TouchableOpacity onPress={onToggle} style={styles.checkBtn}>
          <Ionicons
            name={task.done ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={task.done ? Colors.teal : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.taskTitle, task.done && styles.taskDone]}>
        {task.title}
      </Text>
      <Text style={styles.taskDesc}>{task.description}</Text>
    </View>
  );
}

function PhaseSection({
  label,
  emoji,
  tasks,
  onToggle,
}: {
  label: string;
  emoji: string;
  tasks: any[];
  onToggle: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return null;
  }
  return (
    <View style={styles.phaseBlock}>
      <View
        style={[
          styles.phaseHeader,
          { borderLeftColor: PHASE_BORDER[label] ?? Colors.teal },
        ]}
      >
        <Text style={styles.phaseEmoji}>{emoji}</Text>
        <Text
          style={[
            styles.phaseLabel,
            { color: PHASE_BORDER[label] ?? Colors.teal },
          ]}
        >
          {label}
        </Text>
        <View style={styles.phaseLine} />
      </View>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onToggle={() => onToggle(t.id)} />
      ))}
    </View>
  );
}

function MedicationCard({ medications }: { medications: any[] }) {
  if (!medications || medications.length === 0) {
    return null;
  }
  const med = medications[0];
  return (
    <View style={styles.stackCard}>
      <LinearGradient
        colors={["#2D1B4E", "#1A1030"]}
        style={styles.stackGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stackTitleRow}>
          <Ionicons name="medical" size={18} color={Colors.purple} />
          <Text style={[styles.stackTitle, { color: Colors.purple }]}>
            {" "}
            STACK MEDICAMENTOSO
          </Text>
        </View>
        <View style={styles.medItem}>
          <View style={GlobalStyles.spaceBetween}>
            <Text style={styles.medName}>{med.name}</Text>
            <View style={styles.medDoseBadge}>
              <Text style={styles.medDoseText}>{med.dose}</Text>
            </View>
          </View>
          <View style={styles.medMetaRow}>
            <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.medMeta}>
              {" "}
              {med.time} • {med.route} • {med.frequency}
            </Text>
          </View>
          <View style={styles.dividerThin} />
          <Text style={styles.instructionsLabel}>INSTRUÇÕES</Text>
          {med.instructions && med.instructions.map((ins: string, i: number) => (
            <View key={i} style={styles.instructionRow}>
              <Ionicons
                name="chevron-forward"
                size={11}
                color={Colors.purple}
              />
              <Text style={styles.instructionText}> {ins}</Text>
            </View>
          ))}
          <View style={styles.combinationsRow}>
            {med.combinations && med.combinations.map((c: string, i: number) => (
              <View key={i} style={styles.combPill}>
                <Ionicons name="link-outline" size={11} color={Colors.teal} />
                <Text style={styles.combText}> {c}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function SupplementCard({ supplements }: { supplements: any[] }) {
  if (!supplements || supplements.length === 0) {
    return null;
  }
  return (
    <View style={styles.stackCard}>
      <LinearGradient
        colors={["#0F2A4A", "#060E1C"]}
        style={styles.stackGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stackTitleRow}>
          <Ionicons name="moon" size={18} color={Colors.teal} />
          <Text style={[styles.stackTitle, { color: Colors.teal }]}>
            {" "}
            BIOHACKING STACK
          </Text>
        </View>
        {supplements.map((s, i) => (
          <View key={s.id}>
            <View style={styles.suppRow}>
              <View style={styles.suppTimeCol}>
                <Ionicons
                  name={(s.icon || "leaf-outline") as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={Colors.teal}
                />
                <Text style={styles.suppTime}>{s.time}</Text>
              </View>
              <View style={styles.suppInfo}>
                <View style={GlobalStyles.spaceBetween}>
                  <Text style={styles.suppName}>{s.name}</Text>
                  <Text style={styles.suppDose}>{s.dose}</Text>
                </View>
                <Text style={styles.suppPurpose}>{s.purpose}</Text>
              </View>
            </View>
            {i < supplements.length - 1 && (
              <View style={styles.dividerThin} />
            )}
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

function MealPlanCard({ meals }: { meals: any[] }) {
  if (!meals || meals.length === 0) {
    return null;
  }
  return (
    <View style={styles.stackCard}>
      <LinearGradient
        colors={["#0D2B18", "#05140A"]}
        style={styles.stackGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stackTitleRow}>
          <Ionicons name="restaurant" size={18} color="#4ADE80" />
          <Text style={[styles.stackTitle, { color: "#4ADE80" }]}>
            {" "}
            PLANO ALIMENTAR (DIETA)
          </Text>
        </View>
        {meals.map((m, i) => (
          <View key={m.id || i}>
            <View style={styles.mealPlanRow}>
              <View style={styles.mealPlanInfo}>
                <View style={GlobalStyles.spaceBetween}>
                  <Text style={styles.mealPlanName}>{m.meal}</Text>
                  <Text style={styles.mealPlanKcal}>{m.totalKcal} kcal</Text>
                </View>
                <Text style={styles.mealPlanMacros}>
                  Proteína: {m.proteinGrams}g ({m.proteinPercent}%) • Carboidrato: {m.carbGrams}g ({m.carbPercent}%) • Gordura: {m.fatGrams}g ({m.fatPercent}%)
                </Text>
                {m.description ? (
                  <Text style={styles.mealPlanDescription}>{m.description}</Text>
                ) : null}
              </View>
            </View>
            {i < meals.length - 1 && (
              <View style={styles.dividerThin} />
            )}
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

export default function ProtocolScreen({ navigation }: any) {
  const [protocol, setProtocol] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProtocol = async () => {
    try {
      const data = await api.get<any>("/protocol");
      setProtocol(data);
    } catch (err: any) {
      console.warn("Erro ao buscar protocolo:", err.message);
      // Se não houver protocolo, deixa como null e renderizará sugestão de criar
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProtocol();
    }, [])
  );

  const toggleTask = async (id: string) => {
    try {
      await api.patch(`/protocol/tasks/${id}`);
      await fetchProtocol(); // recarrega o protocolo atualizado
    } catch (err: any) {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa: " + err.message);
    }
  };

  if (loading && !protocol) {
    return (
      <SafeAreaView style={[GlobalStyles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </SafeAreaView>
    );
  }

  if (!protocol) {
    return (
      <SafeAreaView style={[GlobalStyles.safeArea, { justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textMuted} style={{ marginBottom: 16 }} />
        <Text style={{ color: Colors.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 8, textAlign: "center" }}>
          Nenhum Protocolo Ativo
        </Text>
        <Text style={{ color: Colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 24 }}>
          Você ainda não possui um protocolo médico ativo gerado pelo sistema.
        </Text>
        <TouchableOpacity
          style={GlobalStyles.btnOutline}
          onPress={() => navigation.navigate("OnboardingChat")}
        >
          <Text style={GlobalStyles.btnOutlineText}>Gerar Novo Protocolo</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const tasks = protocol.tasks || [];
  const adherence = protocol.adherence ?? 0;
  const done = tasks.filter((t: any) => t.done).length;

  const morning = tasks.filter((t: any) => t.time < "12:00");
  const afternoon = tasks.filter((t: any) => t.time >= "12:00" && t.time < "18:00");
  const evening = tasks.filter((t: any) => t.time >= "18:00");

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      {/* Barra de Progresso Fixa no Topo */}
      <View style={styles.topProgressBar}>
        <View style={[styles.topProgressFill, { width: `${adherence}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.screenTitle}>PROTOCOLO ATIVO</Text>
            <Text style={styles.doctorInfo}>
              Versão {protocol.version}
            </Text>
          </View>
          <TouchableOpacity style={{ padding: 4 }} onPress={fetchProtocol}>
            <Ionicons
              name="refresh-outline"
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Objective badge */}
        <LinearGradient
          colors={["#0F2A4A", "#0A1E38"]}
          style={styles.objBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="flag" size={14} color={Colors.teal} />
          <Text style={styles.objText}> {protocol.objective}</Text>
          <View style={styles.reviewPill}>
            <Text style={styles.reviewText}>
              Revisão {protocol.nextReview}
            </Text>
          </View>
        </LinearGradient>

        {/* Bio metrics */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.metricsScroll}
          contentContainerStyle={styles.metricsContent}
        >
          {[
            {
              label: "RECUPERAÇÃO",
              value: `${protocol.recovery}%`,
              color: Colors.teal,
            },
            {
              label: "SONO (OURA)",
              value: protocol.sleep || "N/A",
              color: Colors.blue,
            },
            {
              label: "HIDRATAÇÃO",
              value: protocol.hydration || "N/A",
              color: Colors.blue,
            },
            {
              label: "JEJUM",
              value: protocol.fastingHours || "N/A",
              color: Colors.purple,
            },
          ].map((m) => (
            <View key={m.label} style={styles.metricPill}>
              <Text style={[styles.metricValue, { color: m.color }]}>
                {m.value}
              </Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Alerta de Aderência Baixa */}
        {adherence < 50 && (
          <View style={styles.lowAdherenceAlert}>
            <Ionicons name="warning" size={20} color={Colors.warning} />
            <View style={styles.lowAdherenceTextContainer}>
              <Text style={styles.lowAdherenceTitle}>Atenção Necessária!</Text>
              <Text style={styles.lowAdherenceText}>
                Sua aderência está em {adherence}%. Tente completar mais tarefas
                hoje para melhores resultados.
              </Text>
            </View>
          </View>
        )}

        {/* Adherence cockpit */}
        <View style={styles.adherenceCard}>
          <RingProgress
            value={adherence}
            color={
              adherence >= 80
                ? Colors.success
                : adherence >= 50
                  ? Colors.teal
                  : Colors.warning
            }
          />
          <View style={styles.adherenceRight}>
            <Text style={styles.adherenceTitle}>Aderência ao Protocolo</Text>
            <Text style={styles.adherenceSub}>
              {done} de {tasks.length} tarefas concluídas
            </Text>
            <View style={styles.adherenceBar}>
              <View
                style={[
                  styles.adherenceFill,
                  { width: `${adherence}%` as any },
                ]}
              />
            </View>
            <View
              style={[
                styles.adherenceStatus,
                {
                  backgroundColor:
                    adherence >= 70
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(245,158,11,0.15)",
                },
              ]}
            >
              <Ionicons
                name={adherence >= 70 ? "checkmark-circle" : "alert-circle"}
                size={13}
                color={adherence >= 70 ? Colors.success : Colors.warning}
              />
              <Text
                style={[
                  styles.adherenceStatusText,
                  { color: adherence >= 70 ? Colors.success : Colors.warning },
                ]}
              >
                {" "}
                {adherence >= 70 ? "No caminho certo" : "Atenção necessária"}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline by phase */}
        <PhaseSection
          label="MANHÃ"
          emoji="🌅"
          tasks={morning}
          onToggle={toggleTask}
        />
        <PhaseSection
          label="TARDE"
          emoji="☀️"
          tasks={afternoon}
          onToggle={toggleTask}
        />
        <PhaseSection
          label="NOITE"
          emoji="🌆"
          tasks={evening}
          onToggle={toggleTask}
        />

        {/* Stacks */}
        <MealPlanCard meals={protocol.meals} />
        <MedicationCard medications={protocol.medications} />
        <SupplementCard supplements={protocol.supplements} />

        {/* Alert */}
        <View style={styles.alertBox}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.blue} />
          <Text style={styles.alertText}>
            {" "}
            Protocolo de caráter orientacional.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 40 },
  topProgressBar: {
    height: 4,
    backgroundColor: Colors.bgPrimary,
    width: "100%",
  },
  topProgressFill: {
    height: "100%",
    backgroundColor: Colors.teal,
  },
  lowAdherenceAlert: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(251,191,36,0.12)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.warning,
    marginBottom: 16,
    gap: 12,
  },
  lowAdherenceTextContainer: {
    flex: 1,
  },
  lowAdherenceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.warning,
    marginBottom: 4,
  },
  lowAdherenceText: {
    fontSize: 12,
    color: Colors.warning,
    lineHeight: 18,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  doctorInfo: {
    fontSize: 11,
    color: Colors.teal,
    marginTop: 2,
    fontWeight: "500",
  },
  objBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  objText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    fontWeight: "500",
  },
  reviewPill: {
    backgroundColor: "rgba(0,201,177,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reviewText: { fontSize: 10, color: Colors.teal, fontWeight: "600" },
  metricsScroll: { marginBottom: 14 },
  metricsContent: { gap: 8, paddingRight: 8 },
  metricPill: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    minWidth: 80,
  },
  metricValue: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  metricLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  adherenceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 16,
  },
  ringValue: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 34,
  },
  ringUnit: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  adherenceRight: { flex: 1, gap: 6 },
  adherenceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  adherenceSub: { fontSize: 11, color: Colors.textMuted },
  adherenceBar: {
    height: 5,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 3,
    overflow: "hidden",
  },
  adherenceFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 3,
  },
  adherenceStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  adherenceStatusText: { fontSize: 11, fontWeight: "600" },
  phaseBlock: { marginBottom: 16 },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 10,
    gap: 6,
  },
  phaseEmoji: { fontSize: 14 },
  phaseLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5 },
  phaseLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  taskCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    marginBottom: 8,
    gap: 5,
  },
  taskHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  taskTimeBadge: {
    backgroundColor: Colors.bgPrimary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  taskTime: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  tagPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  tagText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  checkBtn: { marginLeft: "auto" },
  taskTitle: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  taskDone: { textDecorationLine: "line-through", color: Colors.textMuted },
  taskDesc: { fontSize: 12, color: Colors.textSecondary },
  stackCard: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stackGradient: { padding: 16 },
  stackTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  stackTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  medItem: { gap: 8 },
  medName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  medDoseBadge: {
    backgroundColor: "rgba(139,92,246,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.purple,
  },
  medDoseText: { fontSize: 12, color: Colors.purple, fontWeight: "700" },
  medMetaRow: { flexDirection: "row", alignItems: "center" },
  medMeta: { fontSize: 12, color: Colors.textMuted },
  dividerThin: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  instructionsLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  instructionText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  combinationsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  combPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,201,177,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,201,177,0.3)",
  },
  combText: { fontSize: 11, color: Colors.teal, fontWeight: "500" },
  suppRow: { flexDirection: "row", gap: 12, paddingVertical: 6 },
  suppTimeCol: { alignItems: "center", gap: 4, width: 44 },
  suppTime: { fontSize: 10, color: Colors.textMuted, fontWeight: "600" },
  suppInfo: { flex: 1, gap: 3 },
  suppName: { fontSize: 13, fontWeight: "600", color: Colors.textPrimary },
  suppDose: { fontSize: 12, color: Colors.teal, fontWeight: "600" },
  suppPurpose: { fontSize: 11, color: Colors.textMuted },
  alertBox: {
    flexDirection: "row",
    backgroundColor: "rgba(59,130,246,0.08)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    alignItems: "flex-start",
  },
  alertText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  mealPlanRow: {
    paddingVertical: 8,
  },
  mealPlanInfo: {
    flex: 1,
    gap: 4,
  },
  mealPlanName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  mealPlanKcal: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.teal,
  },
  mealPlanMacros: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  mealPlanDescription: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginTop: 4,
  },
});
