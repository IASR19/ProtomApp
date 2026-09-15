import React from "react";
import { Pressable } from "react-native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { useTourTarget } from "../../hooks/useTourTarget";

interface Props extends BottomTabBarButtonProps {
  tourTargetId: string;
}

/**
 * Envolve o botão padrão da barra de abas só para registrar sua posição no
 * TourContext (usada pelo TourOverlay pra iluminar o ícone certo). Não muda
 * nada do comportamento normal de toque/estilo da aba.
 */
export function TourTabBarButton({ tourTargetId, ...props }: Props) {
  const { ref, onLayout } = useTourTarget(tourTargetId);

  return (
    <Pressable {...props} ref={ref} onLayout={onLayout}>
      {props.children}
    </Pressable>
  );
}
