import React, { useEffect } from "react";
import { Text, View } from "react-native";
import ProfileStripeSection from "../app/tabs-non/profil/StripeSection";
import { MainButton } from "./MainButton";

export function PaymentMethodStep({
  user,
  onNext,
  fetchCustomerPortalUrl,
}: {
  user: any;
  onNext: () => void;
  fetchCustomerPortalUrl?: () => Promise<string | null>;
}) {
  useEffect(() => {
    if (user?.defaultCard) onNext();
  }, [user?.defaultCard, onNext]);

  if (user?.defaultCard) return null;
  return (
    <View className="items-center my-4 w-full px-2">
      <Text className="text-xl font-bold text-blue-600 mb-2">
        Ajouter un moyen de paiement
      </Text>
      <Text className="text-gray-500 mb-5 text-center">
        Pour continuer, ajoutez une carte bancaire à votre compte.
      </Text>
      <ProfileStripeSection
        user={user}
        fetchCustomerPortalUrl={fetchCustomerPortalUrl}
      />
      <MainButton onPress={onNext} disabled={!user?.customerId}>
        J&apos;ai ajouté un moyen de paiement
      </MainButton>
    </View>
  );
}
