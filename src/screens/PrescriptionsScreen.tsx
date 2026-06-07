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
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import { mockPrescriptions } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Prescriptions">;
}

export default function PrescriptionsScreen({ navigation }: Props) {
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
          <Text style={styles.screenTitle}>COFRE MÉDICO</Text>
          <Ionicons
            name="search-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* Security Banner */}
        <TouchableOpacity style={styles.securityBanner} activeOpacity={0.8}>
          <Ionicons name="lock-closed" size={16} color={Colors.teal} />
          <Text style={styles.securityText}>
            {" "}
            Ambiente Seguro e Criptografado
          </Text>
        </TouchableOpacity>

        {/* Prescriptions List */}
        <View style={styles.list}>
          {mockPrescriptions.map((item) => {
            const isSigned = item.statusType === "signed";
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    isSigned ? styles.iconBoxSigned : styles.iconBoxVerified,
                  ]}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={isSigned ? Colors.blue : Colors.danger}
                  />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>
                    Enviado por {item.sentBy} em {item.date}
                  </Text>
                  <View style={GlobalStyles.row}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color={Colors.success}
                    />
                    <Text style={styles.cardStatus}> {item.status}</Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legal Notice */}
        <View style={styles.legalBox}>
          <Text style={styles.legalText}>
            A responsabilidade clínica é exclusiva do médico emissor.
          </Text>
          <Text style={styles.legalHighlight}>
            O ProtomApp não prescreve medicamentos.
          </Text>
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
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  securityBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,201,177,0.10)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.teal,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.teal,
  },
  list: {
    gap: 10,
    marginBottom: 24,
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
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSigned: {
    backgroundColor: "rgba(59,130,246,0.15)",
  },
  iconBoxVerified: {
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardStatus: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "500",
  },
  legalBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 4,
  },
  legalText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
  },
  legalHighlight: {
    fontSize: 12,
    color: Colors.teal,
    fontWeight: "600",
    textAlign: "center",
  },
});
