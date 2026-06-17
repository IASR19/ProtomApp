import { Platform } from "react-native";

// Em desenvolvimento, o simulador de iOS roda no localhost. O Android Emulator precisa de 10.0.2.2.
// Para rodar em aparelho físico, substitua pelo seu IP de rede local (ex: 192.168.X.X).
const BASE_URL = Platform.select({
  android: "http://10.0.2.2:3001/api",
  default: "http://localhost:3001/api",
});

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export function registerUnauthorizedListener(callback: () => void) {
  onUnauthorized = callback;
}

async function request<T>(
  method: string,
  path: string,
  body?: any,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!response.ok) {
    let errorMessage = "Ocorreu um erro na requisição.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (_) {
      // Falha ao parsear erro como JSON, mantém mensagem padrão
    }

    if (response.status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    throw new ApiError(errorMessage, response.status);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as any;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: any, options?: RequestInit) => request<T>("POST", path, body, options),
  put: <T>(path: string, body?: any, options?: RequestInit) => request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: any, options?: RequestInit) => request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestInit) => request<T>("DELETE", path, undefined, options),
};
