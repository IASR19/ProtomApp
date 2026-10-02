import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { api } from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "MedicalTeam">;
}

interface MedicalTeamMember {
  id: string;
  name: string;
  role: string;
  contact: string | null;
}

export default function MedicalTeamScreen({ navigation }: Props) {
  const [members, setMembers] = useState<MedicalTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<MedicalTeamMember[]>("/users/medical-team")
      .then((res) => setMembers(res))
      .catch((err) => console.warn("Erro ao buscar equipe médica:", err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>EQUIPE MÉDICA</Text>
          <View style={{ width: 22 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal} style={{ marginTop: 40 }} />
        ) : members.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>
              Nenhum profissional vinculado ainda. Sua equipe médica aparecerá aqui assim que for
              atribuída.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {members.map((member) => (
              <View key={member.id} style={styles.card}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={22} color={Colors.teal} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{member.name}</Text>
                  <Text style={styles.role}>{member.role}</Text>
                  {member.contact ? <Text style={styles.contact}>{member.contact}</Text> : null}
                </View>
              </View>
            ))}
          </View>
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: Colors.teal,
    marginBottom: 2,
  },
  contact: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
