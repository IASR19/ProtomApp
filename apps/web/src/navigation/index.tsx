import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { useTour } from "../context/TourContext";
import { TourOverlay } from "../components/tour/TourOverlay";
import { TourWelcomeModal } from "../components/tour/TourWelcomeModal";
import { TourFab } from "../components/tour/TourFab";
import { TourTabBarButton } from "../components/tour/TourTabBarButton";

// Screens
import DisclaimerScreen from "../screens/DisclaimerScreen";
import LoginScreen from "../screens/LoginScreen";
import OnboardingChatScreen from "../screens/OnboardingChatScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProtocolScreen from "../screens/ProtocolScreen";
import RoutineHubScreen from "../screens/RoutineHubScreen";
import HealthHubScreen from "../screens/HealthHubScreen";
import ExamsUploadScreen from "../screens/ExamsUploadScreen";
import ExamsEvolutionScreen from "../screens/ExamsEvolutionScreen";
import WorkoutIndicationScreen from "../screens/WorkoutIndicationScreen";
import Workout3DScreen from "../screens/Workout3DScreen";
import NutritionScreen from "../screens/NutritionScreen";
import BodyScanScreen from "../screens/BodyScanScreen";
import PrescriptionsScreen from "../screens/PrescriptionsScreen";
import PartnersScreen from "../screens/PartnersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SocialSetupScreen from "../screens/SocialSetupScreen";
import DailyCheckinScreen from "../screens/DailyCheckinScreen";
import MedicalTeamScreen from "../screens/MedicalTeamScreen";
import NotificationPreferencesScreen from "../screens/NotificationPreferencesScreen";
import PlanManagementScreen from "../screens/PlanManagementScreen";

export type RootStackParamList = {
  Disclaimer: undefined;
  Login: undefined;
  SocialSetup: undefined;
  OnboardingChat: undefined;
  MainTabs: undefined;
  ExamsUpload: undefined;
  ExamsEvolution: undefined;
  WorkoutIndication: undefined;
  Workout3D: undefined;
  Nutrition: undefined;
  BodyScan: undefined;
  Prescriptions: undefined;
  Partners: undefined;
  DailyCheckin: undefined;
  MedicalTeam: undefined;
  NotificationPreferences: undefined;
  PlanManagement: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Routine: undefined;
  Health: undefined;
  Protocol: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs({ navigation }: any) {
  const tour = useTour();

  useEffect(() => {
    // checkAutoStart muda de identidade quando o usuário logado muda (ver
    // TourContext), então este efeito roda de novo se outra conta logar
    // nesta mesma sessão do app, sem depender de MainTabs remontar.
    tour.checkAutoStart();
  }, [tour.checkAutoStart]);

  return (
    <>
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
              Routine: "barbell-outline",
              Health: "pulse-outline",
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
          listeners={{ focus: () => tour.handleTabFocus("Dashboard") }}
        />
        <Tab.Screen
          name="Routine"
          component={RoutineHubScreen}
          options={{
            title: "Rotina",
            tabBarButton: (props) => <TourTabBarButton {...props} tourTargetId="tab-Routine" />,
          }}
          listeners={{ focus: () => tour.handleTabFocus("Routine") }}
        />
        <Tab.Screen
          name="Health"
          component={HealthHubScreen}
          options={{
            title: "Saúde",
            tabBarButton: (props) => <TourTabBarButton {...props} tourTargetId="tab-Health" />,
          }}
          listeners={{ focus: () => tour.handleTabFocus("Health") }}
        />
        <Tab.Screen
          name="Protocol"
          component={ProtocolScreen}
          options={{
            title: "Protocolo",
            tabBarButton: (props) => <TourTabBarButton {...props} tourTargetId="tab-Protocol" />,
          }}
          listeners={{ focus: () => tour.handleTabFocus("Protocol") }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Perfil",
            tabBarButton: (props) => <TourTabBarButton {...props} tourTargetId="tab-Profile" />,
          }}
          listeners={{ focus: () => tour.handleTabFocus("Profile") }}
        />
      </Tab.Navigator>

      <TourOverlay />
      <TourWelcomeModal />
      <TourFab navigation={navigation} />
    </>
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
      <Stack.Screen name="SocialSetup" component={SocialSetupScreen} />
      <Stack.Screen name="OnboardingChat" component={OnboardingChatScreen} />
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
      <Stack.Screen name="DailyCheckin" component={DailyCheckinScreen} />
      <Stack.Screen name="MedicalTeam" component={MedicalTeamScreen} />
      <Stack.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
      />
      <Stack.Screen name="PlanManagement" component={PlanManagementScreen} />
    </Stack.Navigator>
  );
}
