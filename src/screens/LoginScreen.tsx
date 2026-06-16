import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("itamar.ribeiro@email.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.navigate("OnboardingChat");
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Ionicons name="heart" size={32} color={Colors.teal} />
            </View>
            <Text style={styles.appName}>ProtomApp</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>
            Acesse sua conta para continuar seu protocolo.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <Text style={GlobalStyles.inputLabel}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textMuted}
                placeholder="seu@email.com"
              />
            </View>

            <View style={styles.spacer} />

            <Text style={GlobalStyles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.textMuted}
                placeholder="••••••••"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.teal, Colors.tealDark]}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={GlobalStyles.btnPrimaryText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={GlobalStyles.btnOutline}>
            <View style={GlobalStyles.row}>
              <Ionicons
                name="logo-apple"
                size={18}
                color={Colors.textPrimary}
              />
              <Text style={[GlobalStyles.btnOutlineText, { marginLeft: 8 }]}>
                Apple
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          <TouchableOpacity style={GlobalStyles.btnOutline}>
            <View style={GlobalStyles.row}>
              <Ionicons
                name="logo-google"
                size={18}
                color={Colors.textPrimary}
              />
              <Text style={[GlobalStyles.btnOutlineText, { marginLeft: 8 }]}>
                Google
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.teal,
    marginBottom: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  form: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  eyeIcon: {
    paddingRight: 14,
  },
  spacer: {
    height: 16,
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginHorizontal: 12,
  },
});
