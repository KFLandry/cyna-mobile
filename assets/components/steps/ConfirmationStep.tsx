import React from "react";
import { Text, View } from "react-native";

export function ConfirmationStep() {
  return (
    <View className="items-center py-10">
      <Text className="text-2xl font-bold mb-4">
        Merci pour votre abonnement !
      </Text>
      <Text>Un email de confirmation vous a été envoyé.</Text>
    </View>
  );
}
