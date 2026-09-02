import { Platform } from "react-native";

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

type GoogleTokenClient = {
  requestAccessToken: (override?: { prompt?: string }) => void;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
    }) => GoogleTokenClient;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

function loadGoogleIdentityScript(): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.reject(
      new Error("Login com Google está disponível no navegador."),
    );
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const src = "https://accounts.google.com/gsi/client";
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar o login do Google.")), { once: true });
      if (window.google?.accounts?.oauth2) {
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar o login do Google."));
    document.head.appendChild(script);
  });
}

async function signInWithGoogleWeb(clientId: string): Promise<string> {
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error("Não foi possível iniciar o login do Google.");
  }

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error) {
          const canceled = response.error === "access_denied" || response.error === "popup_closed";
          reject(
            new Error(
              canceled
                ? "Login com Google cancelado."
                : response.error_description || "Não foi possível autenticar com o Google.",
            ),
          );
          return;
        }

        if (!response.access_token) {
          reject(new Error("O Google não retornou um token válido."));
          return;
        }

        resolve(response.access_token);
      },
    });

    client.requestAccessToken({ prompt: "select_account" });
  });
}

export async function signInWithGoogle(): Promise<string> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Login com Google não está configurado. Defina EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.",
    );
  }

  if (Platform.OS !== "web") {
    throw new Error("Por enquanto o login com Google está disponível no navegador.");
  }

  return signInWithGoogleWeb(GOOGLE_CLIENT_ID);
}
