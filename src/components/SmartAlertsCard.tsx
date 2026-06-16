import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

export type AlertLevel = "critical" | "warning" | "normal";

export interface Alert {
  id: string;
  level: AlertLevel;
  category: "exam" | "adherence" | "weight" | "wearable" | "medication";
  title: string;
  description: string;
  metric?: string;
  value?: string;
  expectedRange?: string;
  recommendation?: string;
}

interface SmartAlertsCardProps {
  alerts: Alert[];
}

const AlertLevelBadge = ({ level }: { level: AlertLevel }) => {
  const config = {
    critical: {
      color: Colors.danger,
      bgColor: "rgba(239,68,68,0.12)",
      icon: "alert-circle" as const,
      label: "CRÍTICO",
    },
    warning: {
      color: Colors.warning,
      bgColor: "rgba(251,191,36,0.12)",
      icon: "warning" as const,
      label: "ATENÇÃO",
    },
    normal: {
      color: Colors.success,
      bgColor: "rgba(16,185,129,0.12)",
      icon: "checkmark-circle" as const,
      label: "NORMAL",
    },
  };

  const { color, bgColor, icon, label } = config[level];

  return (
    <View
      style={[styles.badge, { backgroundColor: bgColor, borderColor: color }]}
    >
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

const CategoryIcon = ({ category }: { category: Alert["category"] }) => {
  const icons: Record<Alert["category"], keyof typeof Ionicons.glyphMap> = {
    exam: "document-text",
    adherence: "checkmark-circle",
    weight: "scale",
    wearable: "watch",
    medication: "medkit",
  };

  return (
    <Ionicons name={icons[category]} size={20} color={Colors.textSecondary} />
  );
};

export const SmartAlertsCard: React.FC<SmartAlertsCardProps> = ({ alerts }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const criticalCount = alerts.filter((a) => a.level === "critical").length;
  const warningCount = alerts.filter((a) => a.level === "warning").length;

  const overallLevel: AlertLevel =
    criticalCount > 0 ? "critical" : warningCount > 0 ? "warning" : "normal";

  const config = {
    critical: {
      color: Colors.danger,
      bgColor: "rgba(239,68,68,0.12)",
      icon: "alert-circle" as const,
      title: "Atenção Necessária",
      subtitle: `${criticalCount} alerta(s) crítico(s)`,
    },
    warning: {
      color: Colors.warning,
      bgColor: "rgba(251,191,36,0.12)",
      icon: "warning" as const,
      title: "Monitoramento",
      subtitle: `${warningCount} ponto(s) de atenção`,
    },
    normal: {
      color: Colors.success,
      bgColor: "rgba(16,185,129,0.12)",
      icon: "checkmark-circle" as const,
      title: "Tudo em Ordem",
      subtitle: "Todas as métricas normais",
    },
  };

  const currentConfig = config[overallLevel];

  const handleAlertPress = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: currentConfig.bgColor,
            borderColor: currentConfig.color,
          },
        ]}
        onPress={() => alerts.length > 0 && setModalVisible(true)}
        activeOpacity={alerts.length > 0 ? 0.7 : 1}
      >
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={currentConfig.icon}
              size={24}
              color={currentConfig.color}
            />
          </View>
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: currentConfig.color }]}>
              {currentConfig.title}
            </Text>
            <Text style={[styles.subtitle, { color: currentConfig.color }]}>
              {currentConfig.subtitle}
            </Text>
          </View>
          {alerts.length > 0 && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentConfig.color}
            />
          )}
        </View>

        {(criticalCount > 0 || warningCount > 0) && (
          <View style={styles.counters}>
            {criticalCount > 0 && (
              <View
                style={[
                  styles.counter,
                  { backgroundColor: "rgba(239,68,68,0.2)" },
                ]}
              >
                <Ionicons name="alert-circle" size={14} color={Colors.danger} />
                <Text style={[styles.counterText, { color: Colors.danger }]}>
                  {criticalCount} crítico(s)
                </Text>
              </View>
            )}
            {warningCount > 0 && (
              <View
                style={[
                  styles.counter,
                  { backgroundColor: "rgba(251,191,36,0.2)" },
                ]}
              >
                <Ionicons name="warning" size={14} color={Colors.warning} />
                <Text style={[styles.counterText, { color: Colors.warning }]}>
                  {warningCount} atenção
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alertas do Sistema</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.alertsList}
              showsVerticalScrollIndicator={false}
            >
              {alerts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="checkmark-circle"
                    size={48}
                    color={Colors.success}
                  />
                  <Text style={styles.emptyStateText}>
                    Parabéns! Todas as suas métricas estão normais.
                  </Text>
                </View>
              ) : (
                alerts.map((alert) => (
                  <TouchableOpacity
                    key={alert.id}
                    style={styles.alertItem}
                    onPress={() => handleAlertPress(alert)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.alertItemHeader}>
                      <CategoryIcon category={alert.category} />
                      <View style={styles.alertItemHeaderText}>
                        <Text style={styles.alertItemTitle}>{alert.title}</Text>
                        <AlertLevelBadge level={alert.level} />
                      </View>
                    </View>
                    <Text style={styles.alertItemDescription}>
                      {alert.description}
                    </Text>
                    {alert.metric && (
                      <View style={styles.alertMetric}>
                        <Text style={styles.alertMetricLabel}>
                          {alert.metric}:
                        </Text>
                        <Text
                          style={[
                            styles.alertMetricValue,
                            {
                              color:
                                alert.level === "critical"
                                  ? Colors.danger
                                  : alert.level === "warning"
                                    ? Colors.warning
                                    : Colors.success,
                            },
                          ]}
                        >
                          {alert.value}
                        </Text>
                      </View>
                    )}
                    {alert.expectedRange && (
                      <Text style={styles.alertRange}>
                        Esperado: {alert.expectedRange}
                      </Text>
                    )}
                    {alert.recommendation && (
                      <View style={styles.recommendationBox}>
                        <Ionicons
                          name="bulb-outline"
                          size={16}
                          color={Colors.teal}
                        />
                        <Text style={styles.recommendationText}>
                          {alert.recommendation}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  counters: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  alertsList: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
  alertItem: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  alertItemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 12,
  },
  alertItemHeaderText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  alertItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  alertItemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertMetric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  alertMetricLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  alertMetricValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  alertRange: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  recommendationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
    backgroundColor: Colors.bgTertiary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
