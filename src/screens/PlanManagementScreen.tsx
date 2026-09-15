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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "PlanManagement">;
}

interface PlanInfo {
  plan: string;
  planRenewalDate: string | null;
  planCancelled: boolean;
}

export default function PlanManagementScreen({ navigation }: Props) {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchPlan = () => {
    setLoading(true);
    setError(false);
    api
      .get<PlanInfo>("/users/plan")
      .then((res) => setPlanInfo(res))
      .catch((err) => {
        console.warn("Erro ao buscar plano:", err.message);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const renewalLabel = planInfo?.planRenewalDate
    ? new Date(planInfo.planRenewalDate).toLocaleDateString("pt-BR")
    : "Não definida";

  const handleCancel = () => {
    Alert.alert(
      "Cancelar assinatura",
      "Seu plano permanecerá ativo até o fim do período atual; não haverá renovação automática. Deseja continuar?",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Confirmar cancelamento",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              const updated = await api.post<PlanInfo>("/users/plan/cancel");
              setPlanInfo(updated);
            } catch (err: any) {
              Alert.alert("Erro", err.message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>GERENCIAR PLANO</Text>
          <View style={{ width: 22 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal} style={{ marginTop: 40 }} />
        ) : error || !planInfo ? (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.errorText}>Não foi possível carregar seu plano.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchPlan}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.planName}>{planInfo.plan}</Text>
              <Text style={styles.renewalLabel}>
                {planInfo.planCancelled
                  ? "Renovação automática cancelada"
                  : `Renova em ${renewalLabel}`}
              </Text>
              {planInfo.planCancelled ? (
                <View style={styles.badgeCancelled}>
                  <Ionicons name="information-circle" size={14} color={Colors.warning} />
                  <Text style={styles.badgeCancelledText}>
                    Seu acesso continua ativo até o fim do período vigente.
                  </Text>
                </View>
              ) : null}
            </View>

            {!planInfo.planCancelled && (
              <TouchableOpacity
                style={styles.btn}
                onPress={handleCancel}
                activeOpacity={0.85}
                disabled={cancelling}
              >
                <LinearGradient
                  colors={[Colors.danger, Colors.danger]}
                  style={styles.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {cancelling ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <>
                      <Ionicons name="close-circle-outline" size={18} color={Colors.white} />
                      <Text style={[GlobalStyles.btnPrimaryText, { marginLeft: 8 }]}>
                        Cancelar Assinatura
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
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
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 4,
  },
  planName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  renewalLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  badgeCancelled: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
  },
  badgeCancelledText: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 16,
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
});
