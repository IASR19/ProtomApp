import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

// Screens
import DisclaimerScreen from "../screens/DisclaimerScreen";
import LoginScreen from "../screens/LoginScreen";
import ObjectiveScreen from "../screens/ObjectiveScreen";
import BiometricsScreen from "../screens/BiometricsScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProtocolScreen from "../screens/ProtocolScreen";
import ExamsUploadScreen from "../screens/ExamsUploadScreen";
import ExamsEvolutionScreen from "../screens/ExamsEvolutionScreen";
import WorkoutIndicationScreen from "../screens/WorkoutIndicationScreen";
import Workout3DScreen from "../screens/Workout3DScreen";
import NutritionScreen from "../screens/NutritionScreen";
import BodyScanScreen from "../screens/BodyScanScreen";
import PrescriptionsScreen from "../screens/PrescriptionsScreen";
import PartnersScreen from "../screens/PartnersScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
  Disclaimer: undefined;
  Login: undefined;
  Objective: undefined;
  Biometrics: undefined;
  MainTabs: undefined;
  ExamsUpload: undefined;
  ExamsEvolution: undefined;
  WorkoutIndication: undefined;
  Workout3D: undefined;
  Nutrition: undefined;
  BodyScan: undefined;
  Prescriptions: undefined;
  Partners: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Protocol: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgSecondary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.teal,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: "home-outline",
            Protocol: "list-outline",
            Profile: "person-outline",
          };
          return (
            <Ionicons
              name={icons[route.name] ?? "ellipse-outline"}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Protocol"
        component={ProtocolScreen}
        options={{ title: "Protocolo" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Disclaimer"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Objective" component={ObjectiveScreen} />
      <Stack.Screen name="Biometrics" component={BiometricsScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ExamsUpload" component={ExamsUploadScreen} />
      <Stack.Screen name="ExamsEvolution" component={ExamsEvolutionScreen} />
      <Stack.Screen
        name="WorkoutIndication"
        component={WorkoutIndicationScreen}
      />
      <Stack.Screen name="Workout3D" component={Workout3DScreen} />
      <Stack.Screen name="Nutrition" component={NutritionScreen} />
      <Stack.Screen name="BodyScan" component={BodyScanScreen} />
      <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />
      <Stack.Screen name="Partners" component={PartnersScreen} />
    </Stack.Navigator>
  );
}
