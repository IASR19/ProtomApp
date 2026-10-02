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
import { useAuth } from "../context/AuthContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SocialSetup">;
};

export default function SocialSetupScreen({ navigation }: Props) {
  const { user, setPassword } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor, informe seu nome completo.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await setPassword(password, name.trim());
      navigation.replace("OnboardingChat");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível salvar os dados.");
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
          {/* Icon + Title */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={36} color={Colors.teal} />
            </View>
          </View>

          <Text style={styles.title}>Finalize seu Cadastro</Text>
          <Text style={styles.subtitle}>
            Sua conta foi criada com {"\n"}
            <Text style={styles.emailHighlight}>{user?.email}</Text>
            {"\n\n"}
            Confirme seu nome e defina uma senha para acessar o ProtomApp com e-mail e senha também.
          </Text>

          {/* Name */}
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
              placeholder="Seu nome completo"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.spacer} />

          {/* Password */}
          <Text style={GlobalStyles.inputLabel}>Criar Senha</Text>
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
              onChangeText={setPasswordValue}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.textMuted}
              placeholder="Mínimo 6 caracteres"
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

          <View style={styles.spacer} />

          {/* Confirm Password */}
          <Text style={GlobalStyles.inputLabel}>Confirmar Senha</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholderTextColor={Colors.textMuted}
              placeholder="Repita a senha"
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Password strength hint */}
          <View style={styles.hintBox}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.teal} />
            <Text style={styles.hintText}>
              {" "}Use letras, números e símbolos para uma senha mais segura.
            </Text>
          </View>

          <View style={{ height: 32 }} />

          {/* Submit */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleComplete}
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
                <Text style={GlobalStyles.btnPrimaryText}>Finalizar Cadastro</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.compliance}>
            Dados protegidos conforme LGPD e HIPAA
          </Text>
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
  iconWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.teal,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  emailHighlight: {
    color: Colors.teal,
    fontWeight: "600",
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
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(0,201,177,0.08)",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0,201,177,0.2)",
  },
  hintText: {
    fontSize: 12,
    color: Colors.teal,
    flex: 1,
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  compliance: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
  },
});
