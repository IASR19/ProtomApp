import React from "react";
import { PlatformPressable } from "@react-navigation/elements";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { useTourTarget } from "../../hooks/useTourTarget";

interface Props extends BottomTabBarButtonProps {
  tourTargetId: string;
}

/**
 * Envolve o botão padrão da barra de abas só para registrar sua posição no
 * TourContext (usada pelo TourOverlay pra iluminar o ícone certo). Usa
 * PlatformPressable (o mesmo componente que o React Navigation usa por
 * padrão) em vez de Pressable puro: no web, o botão vira um <a href> e é o
 * PlatformPressable que faz preventDefault no clique pra navegar via SPA em
 * vez de disparar um GET de página cheia (que dá 404, já que o host não tem
 * fallback pra rotas aninhadas).
 */
export function TourTabBarButton({ tourTargetId, ...props }: Props) {
  const { ref, onLayout } = useTourTarget(tourTargetId);

  return (
    <PlatformPressable {...props} ref={ref} onLayout={onLayout}>
      {props.children}
    </PlatformPressable>
  );
}
