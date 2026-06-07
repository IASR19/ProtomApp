import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Disclaimer">;
};

export default function DisclaimerScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Ionicons name="heart" size={40} color={Colors.teal} />
          </View>
          <Text style={styles.appName}>ProtomApp</Text>
        </View>

        {/* Disclaimer Card */}
        <View style={styles.disclaimerCard}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={20} color={Colors.danger} />
            <Text style={styles.warningTitle}> Aviso Importante</Text>
          </View>

          <Text style={styles.disclaimerText}>
            Este aplicativo tem caráter exclusivamente{" "}
            <Text style={styles.bold}>educacional e informativo</Text>.
          </Text>

          <Text style={styles.disclaimerText}>
            As informações, protocolos e sugestões apresentadas não substituem,
            em hipótese alguma, a consulta, o diagnóstico ou a prescrição de um
            médico habilitado.
          </Text>

          <Text style={styles.disclaimerText}>
            Ao prosseguir, você concorda que o ProtomApp atua apenas como um
            facilitador de organização e educação em saúde.
          </Text>
        </View>

        {/* Info Boxes */}
        <View style={styles.infoRow}>
          <View style={[styles.infoBox, { borderLeftColor: Colors.blue }]}>
            <View style={GlobalStyles.row}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.blue} />
              <Text style={[styles.infoTitle, { color: Colors.blue }]}>
                {" "}
                Blindagem Jurídica
              </Text>
            </View>
            <Text style={styles.infoText}>
              A primeira interação garante a proteção legal do aplicativo.
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.teal, Colors.tealDark]}
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={GlobalStyles.btnPrimaryText}>Li e Concordo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.teal,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  disclaimerCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.danger,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  infoRow: {
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.blue,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.border,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.border,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
