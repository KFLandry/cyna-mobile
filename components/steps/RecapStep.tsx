import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { MainButton } from "./MainButton";
import { Product } from "@/types/product";

export function RecapStep({
  currentProduct,
  quantity,
  loading,
  onPay,
  onCancel,
}: {
  currentProduct: Product;
  quantity: string;
  loading: boolean;
  onPay: () => void;
  onCancel: () => void;
}) {
  const handleCancel = () => {
    Alert.alert(
      "Annuler le paiement",
      "Êtes-vous sûr de vouloir annuler ? Le parcours sera réinitialisé et vous devrez tout recommencer.",
      [
        { text: "Continuer", style: "cancel" },
        {
          text: "Annuler le checkout",
          style: "destructive",
          onPress: onCancel,
        },
      ]
    );
  };
  return (
    <View className="w-full items-center px-2">
      <Image
        source={{
          uri:
            currentProduct.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        }}
        className="w-full h-36 rounded-xl"
        resizeMode="cover"
      />
      <View className="w-full p-5 items-center">
        <Text className="text-lg font-bold text-blue-600 mb-4 text-center">
          Récapitulatif de l’abonnement
        </Text>
        <View className="flex-row justify-between w-full mb-2">
          <Text className="text-gray-500 font-bold text-base">Produit :</Text>
          <Text className="text-gray-700 font-semibold text-base">
            {currentProduct?.name || "Produit inconnu"}
          </Text>
        </View>
        <View className="flex-row justify-between w-full mb-2">
          <Text className="text-gray-500 font-bold text-base">PriceId :</Text>
          <Text className="text-gray-700 font-semibold text-base">
            {currentProduct?.priceId || "ID de prix inconnu"}
          </Text>
        </View>
        <View className="flex-row justify-between w-full mb-2">
          <Text className="text-gray-500 font-bold text-base">Modèle :</Text>
          <Text className="text-gray-700 font-semibold text-base">
            {currentProduct?.pricingModel
              ? String(currentProduct.pricingModel)
              : "Modèle inconnu"}
          </Text>
        </View>
        <View className="flex-row justify-between w-full mb-2">
          <Text className="text-gray-500 font-bold text-base">Quantité :</Text>
          <Text className="text-gray-700 font-semibold text-base">
            {quantity}
          </Text>
        </View>
        <View className="flex-row justify-between w-full mb-2">
          <Text className="text-gray-500 font-bold text-base">
            Prix à payer :
          </Text>
          <Text className="text-gray-700 font-semibold text-base">
            {(Number(quantity) * (currentProduct?.amount || 0)) / 100} €
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mt-6" />
        ) : (
          <MainButton onPress={onPay} className="mt-6 shadow">
            Payer maintenant
          </MainButton>
        )}
        <Pressable
          className="mt-3 py-2 w-full items-center"
          onPress={handleCancel}
        >
          <Text className="text-blue-600 font-bold text-base">Annuler</Text>
        </Pressable>
      </View>
    </View>
  );
}
