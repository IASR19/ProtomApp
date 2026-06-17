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
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";
import { GlobalStyles } from "../theme/styles";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("itamar.ribeiro@email.com");
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithSocial } = useAuth();

  const handleAuth = async () => {
    if (!email || !password || (isRegistering && !name)) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      if (isRegistering) {
        await register(name, email, password);
        navigation.replace("OnboardingChat");
      } else {
        await login(email, password);
        if (email === "itamar.ribeiro@email.com") {
          navigation.replace("MainTabs");
        } else {
          navigation.replace("OnboardingChat");
        }
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      // Se o desenvolvedor digitou um e-mail no campo diferente do padrão, usamos ele na simulação.
      // Caso contrário, geramos um e-mail aleatório para forçar a criação de uma nova conta de testes.
      const targetEmail =
        email && email.includes("@") && email !== "itamar.ribeiro@email.com"
          ? email
          : `${provider}-user-${Math.floor(Math.random() * 10000)}@email.com`;

      const { needsProfileSetup } = await loginWithSocial(provider, targetEmail);

      if (needsProfileSetup) {
        // Novo usuário social: precisa definir nome e senha antes de prosseguir
        navigation.replace("SocialSetup");
      } else {
        // Usuário já existente: vai direto para o app
        navigation.replace("MainTabs");
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}>
            {isRegistering ? "Criar nova conta" : "Bem-vindo de volta"}
          </Text>
          <Text style={styles.subtitle}>
            {isRegistering 
              ? "Crie sua conta para iniciar seu protocolo personalizado."
              : "Acesse sua conta para continuar seu protocolo."}
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {isRegistering && (
              <>
                <Text style={GlobalStyles.inputLabel}>Nome Completo</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={Colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={Colors.textMuted}
                    placeholder="Itamar Ribeiro"
                  />
                </View>
                <View style={styles.spacer} />
              </>
            )}

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

          {/* Login/Register Button */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.teal, Colors.tealDark]}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={GlobalStyles.btnPrimaryText}>
                  {isRegistering ? "Registrar" : "Entrar"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity 
            style={GlobalStyles.btnOutline}
            onPress={() => handleSocial("apple")}
            disabled={loading}
          >
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

          <TouchableOpacity 
            style={GlobalStyles.btnOutline}
            onPress={() => handleSocial("google")}
            disabled={loading}
          >
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

          <View style={{ height: 24 }} />

          {/* Register Toggle Link */}
          <TouchableOpacity 
            onPress={() => setIsRegistering(!isRegistering)}
            style={{ alignItems: "center" }}
          >
            <Text style={{ color: Colors.teal, fontWeight: "600", fontSize: 14 }}>
              {isRegistering 
                ? "Já possui uma conta? Faça Login" 
                : "Não possui conta? Cadastre-se"}
            </Text>
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
