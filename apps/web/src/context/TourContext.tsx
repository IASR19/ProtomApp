import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOUR_STEPS } from "../tour/steps";
import { useAuth } from "./AuthContext";

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TourContextData {
  running: boolean;
  currentIndex: number;
  currentStep: (typeof TOUR_STEPS)[number] | null;
  isLastStep: boolean;
  welcomeVisible: boolean;
  welcomeIsAuto: boolean;
  targets: Record<string, TargetRect>;
  activeTabName: string | null;
  registerTarget: (id: string, rect: TargetRect) => void;
  checkAutoStart: () => void;
  startManual: () => void;
  beginAfterWelcome: () => void;
  skipWelcome: () => void;
  nextStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  handleTabFocus: (routeName: string) => void;
}

const TourContext = createContext<TourContextData>({} as TourContextData);

function storageKey(userId: string) {
  return `@ProtomApp:tourSeen:${userId}`;
}

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeIsAuto, setWelcomeIsAuto] = useState(false);
  const [targets, setTargets] = useState<Record<string, TargetRect>>({});
  const [activeTabName, setActiveTabName] = useState<string | null>(null);
  const checkedForUserId = useRef<string | null>(null);

  const registerTarget = useCallback((id: string, rect: TargetRect) => {
    setTargets((prev) => ({ ...prev, [id]: rect }));
  }, []);

  const checkAutoStart = useCallback(() => {
    const userId = user?.id;
    if (!userId) return;
    // Evita checar/disparar duas vezes pro mesmo usuário na mesma sessão do app
    // (ex.: efeito de montagem rodando de novo em dev).
    if (checkedForUserId.current === userId) return;
    checkedForUserId.current = userId;

    AsyncStorage.getItem(storageKey(userId))
      .then((seen) => {
        if (!seen) {
          setWelcomeIsAuto(true);
          setWelcomeVisible(true);
        }
      })
      .catch((err) => {
        console.warn("Erro ao checar se o tutorial já foi visto:", err.message);
      });
  }, [user?.id]);

  const startManual = useCallback(() => {
    setWelcomeIsAuto(false);
    setWelcomeVisible(true);
  }, []);

  const beginAfterWelcome = useCallback(() => {
    setWelcomeVisible(false);
    setCurrentIndex(0);
    setRunning(true);
  }, []);

  const markSeen = useCallback(() => {
    const userId = user?.id;
    if (!userId) return;
    AsyncStorage.setItem(storageKey(userId), "1").catch((err) => {
      console.warn("Erro ao salvar que o tutorial foi visto:", err.message);
    });
  }, [user?.id]);

  const skipWelcome = useCallback(() => {
    setWelcomeVisible(false);
    // Pular o popup automático conta como "já visto"; um replay manual pulado não mexe em nada.
    if (welcomeIsAuto) {
      markSeen();
    }
  }, [welcomeIsAuto, markSeen]);

  const nextStep = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, TOUR_STEPS.length - 1));
  }, []);

  const skipTour = useCallback(() => {
    setRunning(false);
    markSeen();
  }, [markSeen]);

  const completeTour = useCallback(() => {
    setRunning(false);
    markSeen();
  }, [markSeen]);

  const handleTabFocus = useCallback(
    (routeName: string) => {
      setActiveTabName(routeName);
      setCurrentIndex((i) => {
        const step = TOUR_STEPS[i];
        if (running && step?.kind === "nav" && step.navTarget === routeName) {
          return Math.min(i + 1, TOUR_STEPS.length - 1);
        }
        return i;
      });
    },
    [running],
  );

  const currentStep = running ? TOUR_STEPS[currentIndex] ?? null : null;
  const isLastStep = currentIndex === TOUR_STEPS.length - 1;

  return (
    <TourContext.Provider
      value={{
        running,
        currentIndex,
        currentStep,
        isLastStep,
        welcomeVisible,
        welcomeIsAuto,
        targets,
        activeTabName,
        registerTarget,
        checkAutoStart,
        startManual,
        beginAfterWelcome,
        skipWelcome,
        nextStep,
        skipTour,
        completeTour,
        handleTabFocus,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour deve ser usado dentro de um TourProvider");
  }
  return context;
}
