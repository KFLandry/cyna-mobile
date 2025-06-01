import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { MainButton } from "./MainButton";

export const PRICING_MODELS = [
  { label: "Par mois / utilisateur", value: "PER_MONTH_PER_USER" },
  { label: "Par an / utilisateur", value: "PER_YEAR_PER_USER" },
  { label: "Par mois / device", value: "PER_MONTH_PER_DEVICE" },
  { label: "Par an / device", value: "PER_YEAR_PER_DEVICE" },
];

export function QuantityStep({
  pricingModel,
  setPricingModel,
  quantity,
  setQuantity,
  onNext,
}: {
  pricingModel: string;
  setPricingModel: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <View className="items-center my-4 w-full px-2">
      <Text className="text-lg font-bold text-blue-600 mb-3">
        Choisissez votre offre
      </Text>
      <View className="w-full mb-2">
        {PRICING_MODELS.map((pm) => (
          <Pressable
            key={pm.value}
            className={[
              "border rounded-xl py-2 px-4 my-1 w-full items-center",
              pricingModel === pm.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white",
            ].join(" ")}
            onPress={() => setPricingModel(pm.value)}
          >
            <Text
              className={[
                "text-base",
                pricingModel === pm.value
                  ? "text-blue-600 font-bold"
                  : "text-gray-700",
              ].join(" ")}
            >
              {pm.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        placeholder="Quantité"
        className="border border-gray-200 rounded-xl py-2 px-4 w-24 my-4 text-center text-base"
      />
      <MainButton onPress={onNext}>Continuer</MainButton>
    </View>
  );
}
