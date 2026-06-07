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
import { mockUser } from "../mocks";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../navigation";

interface Props {
  navigation: BottomTabNavigationProp<MainTabParamList, "Profile">;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
}

function MenuItem({
  icon,
  label,
  value,
  danger = false,
  onPress,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, danger && styles.menuItemDanger]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? Colors.danger : Colors.textSecondary}
        style={{ marginRight: 14 }}
      />
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
      {value ? (
        <Text style={styles.menuValue}>{value}</Text>
      ) : !danger ? (
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>MEU PERFIL</Text>
          <Ionicons
            name="settings-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{mockUser.initials}</Text>
          </View>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
        </View>

        {/* Premium Plan */}
        <View style={styles.planCard}>
          <View style={GlobalStyles.row}>
            <Text style={styles.planIcon}>👑</Text>
            <Text style={styles.planLabel}> Plano {mockUser.plan}</Text>
          </View>
          <View style={GlobalStyles.row}>
            <Text style={styles.planRenewal}>
              Renova em {mockUser.planRenewal}
            </Text>
            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Gerenciar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="people-outline"
            label="Equipe Médica"
            onPress={() => {}}
          />
          <MenuItem
            icon="logo-apple"
            label="Dispositivos (IoT)"
            value="Apple Watch Conectado"
          />
          <MenuItem
            icon="notifications-outline"
            label="Notificações"
            onPress={() => {}}
          />
          <MenuItem
            icon="shield-outline"
            label="Privacidade e LGPD"
            onPress={() => {}}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => (navigation as any).navigate("Disclaimer")}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}> Sair da Conta</Text>
        </TouchableOpacity>

        {/* Compliance notice */}
        <Text style={styles.compliance}>
          Dados protegidos conforme LGPD e HIPAA
        </Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  userCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.bgPrimary,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  planCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.teal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  planIcon: {
    fontSize: 16,
  },
  planLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  planRenewal: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  manageBtn: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  manageBtnText: {
    fontSize: 12,
    color: Colors.teal,
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  menuLabelDanger: {
    color: Colors.danger,
  },
  menuValue: {
    fontSize: 12,
    color: Colors.teal,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: "rgba(239,68,68,0.05)",
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    color: Colors.danger,
    fontWeight: "600",
  },
  compliance: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
  },
});
