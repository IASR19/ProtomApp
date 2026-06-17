import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
