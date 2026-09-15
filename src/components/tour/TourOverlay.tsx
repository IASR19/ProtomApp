import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Colors } from "../../theme/colors";
import { useTour } from "../../context/TourContext";
import type { TourStep } from "../../tour/steps";

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HighlightProps {
  step: TourStep;
  rect: TargetRect;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

function TourHighlight({ step, rect, isLastStep, onNext, onSkip, onComplete }: HighlightProps) {
  const screen = Dimensions.get("window");
  const pad = 6;
  const hole = {
    x: Math.max(rect.x - pad, 0),
    y: Math.max(rect.y - pad, 0),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
  const tooltipFitsBelow = hole.y + hole.height + 160 < screen.height;
  const tooltipTop = tooltipFitsBelow ? hole.y + hole.height + 12 : Math.max(hole.y - 160, 48);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View style={[styles.dim, { top: 0, left: 0, right: 0, height: hole.y }]} />
      <View style={[styles.dim, { top: hole.y + hole.height, left: 0, right: 0, bottom: 0 }]} />
      <View style={[styles.dim, { top: hole.y, left: 0, width: hole.x, height: hole.height }]} />
      <View
        style={[
          styles.dim,
          { top: hole.y, left: hole.x + hole.width, right: 0, height: hole.height },
        ]}
      />

      <View
        pointerEvents="none"
        style={[styles.ring, { top: hole.y, left: hole.x, width: hole.width, height: hole.height }]}
      />

      <View style={[styles.tooltip, { top: tooltipTop }]}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        {step.kind === "nav" ? (
          <TouchableOpacity onPress={onSkip} style={styles.linkBtn}>
            <Text style={styles.linkText}>Pular tutorial</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={onSkip} style={styles.linkBtn}>
              <Text style={styles.linkText}>Pular</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isLastStep ? onComplete : onNext}
              style={styles.primaryBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>{isLastStep ? "Concluir" : "Avançar"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export function TourOverlay() {
  const { running, currentStep, targets, isLastStep, nextStep, skipTour, completeTour } =
    useTour();

  if (!running) return null;

  const rect = currentStep ? targets[currentStep.id] : undefined;

  // O Modal fica montado durante todo o tour (não só quando o passo atual já
  // tem posição registrada), pra trocar de passo não desmontar/remontar o
  // Modal a cada troca de aba — isso evitaria a animação de entrada dele
  // piscando entre um passo e outro.
  return (
    <Modal transparent visible animationType="fade" onRequestClose={skipTour}>
      {currentStep && rect ? (
        <TourHighlight
          step={currentStep}
          rect={rect}
          isLastStep={isLastStep}
          onNext={nextStep}
          onSkip={skipTour}
          onComplete={completeTour}
        />
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    position: "absolute",
    backgroundColor: Colors.overlay,
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.teal,
    borderRadius: 12,
  },
  tooltip: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  linkText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
