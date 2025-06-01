import React from "react";
import { Pressable, Text, View } from "react-native";

// Stepper visuel
const steps = [
  { label: "Paiement" },
  { label: "Quantité" },
  { label: "Récap" },
  { label: "Confirmation" },
];
export function StripeStepper({
  currentStep,
  setStep,
  maxStep,
}: {
  currentStep: number;
  setStep: (step: number) => void;
  maxStep: number;
}) {
  return (
    <View className="flex-row items-center justify-between w-full px-2 mb-8 mt-2">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        const isClickable = idx <= maxStep;

        return (
          <React.Fragment key={step.label}>
            <Pressable
              disabled={!isClickable}
              onPress={() => isClickable && setStep(idx)}
              className="items-center"
            >
              <View
                className={[
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center",
                  isCompleted
                    ? "bg-blue-600 border-blue-600"
                    : isActive
                    ? "bg-white border-blue-600"
                    : "bg-gray-100 border-gray-300",
                  isClickable && !isActive ? "opacity-80" : "",
                ].join(" ")}
                style={
                  isClickable && !isActive
                    ? { borderStyle: "dashed" }
                    : undefined
                }
              >
                <Text
                  className={[
                    "font-bold",
                    isCompleted
                      ? "text-white"
                      : isActive
                      ? "text-blue-600"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  {idx + 1}
                </Text>
              </View>
              <Text
                className={[
                  "text-xs mt-2 text-center",
                  isActive
                    ? "text-blue-600 font-bold"
                    : isCompleted
                    ? "text-blue-600"
                    : "text-gray-400",
                ].join(" ")}
              >
                {step.label}
              </Text>
            </Pressable>
            {idx < steps.length - 1 && (
              <View className="flex-1 h-0.5 bg-gray-200 mx-1 self-center" />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
