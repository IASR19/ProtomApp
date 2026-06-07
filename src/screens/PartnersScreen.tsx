import React, { useState } from "react";
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
import { mockPartners } from "../mocks";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Partners">;
}

type TabKey = "Suplementos" | "Farmácias" | "Exames";

const TAB_DATA: Record<TabKey, typeof mockPartners.supplements> = {
  Suplementos: mockPartners.supplements,
  Farmácias: mockPartners.pharmacies,
  Exames: mockPartners.exams,
};

export default function PartnersScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("Suplementos");
  const items = TAB_DATA[activeTab];

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
          <Text style={styles.screenTitle}>BENEFÍCIOS PROTOMAPP</Text>
          <Ionicons
            name="search-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </View>

        {/* Savings Banner */}
        <View style={styles.savingsBanner}>
          <View>
            <Text style={styles.savingsLabel}>ECONOMIA ACUMULADA</Text>
            <Text style={styles.savingsValue}>
              R$ {mockPartners.savings.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <Ionicons name="wallet" size={36} color={Colors.teal} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {mockPartners.tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab as TabKey)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Items */}
        <View style={styles.itemList}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              activeOpacity={0.8}
            >
              <View style={styles.itemIcon}>
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={Colors.teal}
                />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  savingsBanner: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.teal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  savingsLabel: {
    fontSize: 11,
    color: Colors.teal,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.bgPrimary,
  },
  tabText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  tabTextActive: {
    color: Colors.teal,
    fontWeight: "700",
  },
  itemList: {
    gap: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  discountBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  discountText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.success,
  },
});
