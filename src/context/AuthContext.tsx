import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setApiAccessToken, registerUnauthorizedListener } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  initialWeight?: number;
  weight?: number;
  goalWeight?: number;
  objective?: string;
}

interface SocialLoginResult {
  needsProfileSetup: boolean;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: "google" | "apple", mockEmail: string) => Promise<SocialLoginResult>;
  setPassword: (password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hook for global 401 interceptor
  useEffect(() => {
    registerUnauthorizedListener(async () => {
      console.warn("Sessão expirada ou não autorizada. Limpando credenciais locais...");
      await AsyncStorage.multiRemove(["@ProtomApp:token", "@ProtomApp:user"]);
      setApiAccessToken(null);
      setToken(null);
      setUser(null);
    });
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem("@ProtomApp:token");
        const storedUser = await AsyncStorage.getItem("@ProtomApp:user");

        if (storedToken && storedUser) {
          setApiAccessToken(storedToken);
          
          // Verify token validity with backend profile API
          try {
            const userProfile = await api.get<User>("/users/profile");
            setToken(storedToken);
            setUser(userProfile);
            await AsyncStorage.setItem("@ProtomApp:user", JSON.stringify(userProfile));
          } catch (apiErr: any) {
            console.warn("Falha ao validar token com o back-end:", apiErr.message);
            
            // If explicitly unauthorized, clear session
            if (apiErr.status === 401 || apiErr.message.includes("401") || apiErr.message.toLowerCase().includes("unauthorized") || apiErr.message.toLowerCase().includes("não autorizado")) {
              await AsyncStorage.multiRemove(["@ProtomApp:token", "@ProtomApp:user"]);
              setApiAccessToken(null);
              setToken(null);
              setUser(null);
            } else {
              // Maintain local session if offline network failure
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar credenciais do armazenamento local:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ accessToken: string; user: User }>("/auth/login", {
        email,
        password,
      });

      const { accessToken, user: loggedUser } = response;

      await AsyncStorage.setItem("@ProtomApp:token", accessToken);
      await AsyncStorage.setItem("@ProtomApp:user", JSON.stringify(loggedUser));

      setApiAccessToken(accessToken);
      setToken(accessToken);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ accessToken: string; user: User }>("/auth/register", {
        name,
        email,
        password,
      });

      const { accessToken, user: loggedUser } = response;

      await AsyncStorage.setItem("@ProtomApp:token", accessToken);
      await AsyncStorage.setItem("@ProtomApp:user", JSON.stringify(loggedUser));

      setApiAccessToken(accessToken);
      setToken(accessToken);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (
    provider: "google" | "apple",
    mockEmail: string,
  ): Promise<SocialLoginResult> => {
    setIsLoading(true);
    try {
      const path = provider === "google" ? "/auth/google" : "/auth/apple";
      const response = await api.post<{
        accessToken: string;
        user: User;
        needsProfileSetup?: boolean;
      }>(path, {
        idToken: `mock-${mockEmail}`,
      });

      const { accessToken, user: loggedUser, needsProfileSetup } = response;

      await AsyncStorage.setItem("@ProtomApp:token", accessToken);
      await AsyncStorage.setItem("@ProtomApp:user", JSON.stringify(loggedUser));

      setApiAccessToken(accessToken);
      setToken(accessToken);
      setUser(loggedUser);

      return { needsProfileSetup: !!needsProfileSetup };
    } finally {
      setIsLoading(false);
    }
  };

  const setPassword = async (password: string, name?: string) => {
    await api.post("/auth/set-password", { password, name });
    // If name was updated, refresh local user data
    if (name && user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      await AsyncStorage.setItem("@ProtomApp:user", JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await api.post("/auth/logout").catch((err) => {
          console.warn("Aviso ao revogar token no back-end:", err.message);
        });
      }
    } finally {
      await AsyncStorage.multiRemove(["@ProtomApp:token", "@ProtomApp:user"]);
      setApiAccessToken(null);
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithSocial,
        setPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
