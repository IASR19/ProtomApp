import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { useTour } from "../../context/TourContext";

interface Props {
  navigation: any;
}

export function TourFab({ navigation }: Props) {
  const { activeTabName, startManual } = useTour();

  const handlePress = () => {
    // O tour sempre começa no passo da Home; se a pessoa estiver em outra
    // aba, leva ela pra Home antes de abrir o popup de boas-vindas.
    if (activeTabName !== "Dashboard") {
      navigation.navigate("Dashboard");
    }
    startManual();
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress} activeOpacity={0.85}>
      <Ionicons name="help" size={22} color={Colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 80,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
