import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "NotificationPreferences">;
}

interface Preferences {
  notifyPush: boolean;
  notifyEmail: boolean;
  notifyProtocolReminders: boolean;
  notifyExamAlerts: boolean;
}

const OPTIONS: { key: keyof Preferences; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "notifyPush", label: "Notificações push", icon: "notifications-outline" },
  { key: "notifyEmail", label: "Notificações por e-mail", icon: "mail-outline" },
  { key: "notifyProtocolReminders", label: "Lembretes do protocolo", icon: "list-outline" },
  { key: "notifyExamAlerts", label: "Alertas de exames", icon: "document-text-outline" },
];

export default function NotificationPreferencesScreen({ navigation }: Props) {
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPrefs = () => {
    setLoading(true);
    setError(false);
    api
      .get<any>("/users/profile")
      .then((user) =>
        setPrefs({
          notifyPush: user.notifyPush ?? true,
          notifyEmail: user.notifyEmail ?? true,
          notifyProtocolReminders: user.notifyProtocolReminders ?? true,
          notifyExamAlerts: user.notifyExamAlerts ?? true,
        }),
      )
      .catch((err) => {
        console.warn("Erro ao buscar preferências:", err.message);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrefs();
  }, []);

  const toggle = async (key: keyof Preferences) => {
    if (!prefs) return;
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    try {
      await api.put("/users/notification-preferences", { [key]: updated[key] });
    } catch (err: any) {
      console.warn("Erro ao salvar preferência:", err.message);
      setPrefs(prefs);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>NOTIFICAÇÕES</Text>
          <View style={{ width: 22 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal} style={{ marginTop: 40 }} />
        ) : error || !prefs ? (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.errorText}>Não foi possível carregar suas preferências.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchPrefs}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.list}>
              {OPTIONS.map((opt) => (
                <View key={opt.key} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name={opt.icon} size={20} color={Colors.teal} />
                    <Text style={styles.rowLabel}>{opt.label}</Text>
                  </View>
                  <Switch
                    value={prefs[opt.key]}
                    onValueChange={() => toggle(opt.key)}
                    disabled={saving}
                    trackColor={{ false: Colors.border, true: Colors.teal }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.noteRow}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.noteText}>
                Suas preferências ficam salvas e serão respeitadas assim que o envio de
                notificações push/e-mail estiver disponível.
              </Text>
            </View>
          </>
        )}
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
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  errorState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 16,
  },
});
