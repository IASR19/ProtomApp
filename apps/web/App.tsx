import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation";
import { AuthProvider } from "./src/context/AuthContext";
import { TourProvider } from "./src/context/TourContext";

export default function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <NavigationContainer documentTitle={{ formatter: () => "ProtomApp" }}>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </TourProvider>
    </AuthProvider>
  );
}
