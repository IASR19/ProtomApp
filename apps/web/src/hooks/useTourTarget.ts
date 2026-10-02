import { useCallback, useRef } from "react";
import type { View } from "react-native";
import { useTour } from "../context/TourContext";

/**
 * Avisa o TourContext onde, na tela, o elemento do passo `id` está posicionado.
 * Usar o `ref` e o `onLayout` retornados no componente que deve ser destacado
 * pelo tour (View, Pressable, TouchableOpacity — qualquer um que suporte
 * `measureInWindow`).
 */
export function useTourTarget(id: string) {
  const { registerTarget } = useTour();
  const ref = useRef<View>(null);

  const onLayout = useCallback(() => {
    // onLayout só avisa que o layout terminou; a posição em relação à TELA
    // (não ao pai) vem de measureInWindow, chamado no próximo tick.
    requestAnimationFrame(() => {
      ref.current?.measureInWindow((x, y, width, height) => {
        registerTarget(id, { x, y, width, height });
      });
    });
  }, [id, registerTarget]);

  return { ref, onLayout };
}
