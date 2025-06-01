import React from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { MainButton } from "./MainButton";
import { Product } from "@/types/product";

export function QuantityStep({
  currentProduct,
  quantity,
  setQuantity,
  onNext,
}: {
  currentProduct: Product;
  quantity: string;
  setQuantity: (v: string) => void;
  onNext: () => void;
}) {
  function getPricingModelLabel(model: string) {
    switch (model) {
      case "PER_MONTH_PER_USER":
        return "Tarification récurrente à l'utilisateur par mois";
      case "PER_YEAR_PER_USER":
        return "Tarification récurrente à l'utilisateur par an";
      case "PER_MONTH_PER_DEVICE":
        return "Tarification récurrente par appareil par mois";
      case "PER_YEAR_PER_DEVICE":
        return "Tarification récurrente par appareil par an";
      case "ONE_TIME":
        return "Tarification unique";
      case "PAY_AS_YOU_GO":
        return "Tarification à l'usage (pay as you go)";
      case "FREE":
        return "Gratuit";
      default:
        return "Inconnu";
    }
  }

  const disableQuantity =
    currentProduct.pricingModel === "ONE_TIME" ||
    currentProduct.pricingModel === "PAY_AS_YOU_GO";

  const qty = Number(quantity) || 1;

  return (
    <View className="w-full px-4 py-8 bg-white rounded-3xl shadow-lg items-center border border-blue-50">
      {/* Nom du produit */}
      <Text className="text-3xl font-extrabold text-gray-900 mb-1 text-center tracking-tight">
        {currentProduct.name}
      </Text>
      {/* Modèle de tarification */}
      <Text className="text-lg  font-semibold m-4 text-center">
        {getPricingModelLabel(String(currentProduct.pricingModel))}
      </Text>
      {/* Sélecteur de quantité */}
      {!disableQuantity && (
        <View className="flex-row items-center mb-8">
          <Text className="text-gray-700 font-semibold text-lg mr-4">
            Quantité
          </Text>
          <View className="flex-row items-center bg-blue-50 rounded-2xl px-2 py-1">
            <Pressable
              onPress={() => setQuantity(String(Math.max(1, qty - 1)))}
              className="px-3 py-1 rounded-l-2xl bg-blue-100 active:bg-blue-200"
            >
              <Text className="text-2xl text-blue-600 font-bold">-</Text>
            </Pressable>
            <TextInput
              value={String(qty)}
              onChangeText={(v) => {
                const n = Math.max(1, parseInt(v) || 1);
                setQuantity(String(n));
              }}
              keyboardType="number-pad"
              className="mx-2 w-12 text-center text-lg font-bold text-gray-900 bg-white rounded-lg border border-blue-100"
            />
            <Pressable
              onPress={() => setQuantity(String(qty + 1))}
              className="px-3 py-1 rounded-r-2xl bg-blue-100 active:bg-blue-200"
            >
              <Text className="text-2xl text-blue-600 font-bold">+</Text>
            </Pressable>
          </View>
        </View>
      )}
      {/* Bouton continuer */}
      <MainButton
        onPress={onNext}
        className="w-full mt-2 text-lg py-3 rounded-2xl"
      >
        Continuer
      </MainButton>
    </View>
  );
}
