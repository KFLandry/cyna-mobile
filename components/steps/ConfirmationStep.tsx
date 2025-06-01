import React, { useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

export function ConfirmationStep({
  fetchCustomerPortalUrl,
}: {
  fetchCustomerPortalUrl?: () => Promise<string | null>;
}) {
  const [loading, setLoading] = useState(false);

  const openStripePortal = async () => {
    if (!fetchCustomerPortalUrl){
      Alert.alert(
        "Erreur",
        "La fonction de récupération de l'URL du portail Stripe n'est pas disponible."
      );
      return;
    };
    setLoading(true);
    try {
      const url = await fetchCustomerPortalUrl();
      console.log("URL du portail Stripe:", url);
      if (url) {
        await WebBrowser.openBrowserAsync(url);
      } else {
        Alert.alert(
          "Erreur",
          "Impossible d'ouvrir le portail Stripe. Veuillez réessayer plus tard."
        );
      }
    } catch {
      Alert.alert("Erreur", "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-center py-10">
      {/* Animation/Sticker de célébration */}
      <Text className="text-6xl mb-2 animate-bounce">🎉</Text>
      <Text className="text-2xl font-extrabold mb-2 text-blue-700 text-center">
        Merci et bienvenue chez Cyna&nbsp;!
      </Text>
      <Text className="text-gray-600 mb-6 text-center text-base">
        Votre abonnement a été créé avec succès.{"\n"}
        Gérez vos abonnements, votre profil Stripe et télécharger vos factures
        via votre portail client.
      </Text>
      <TouchableOpacity
        className={`bg-blue-500 rounded-full px-5 py-3 flex-row items-center mb-4 shadow-lg ${
          loading ? "opacity-60" : ""
        }`}
        onPress={openStripePortal}
        activeOpacity={0.85}
        disabled={loading}
      >
        <Text className="text-white font-bold text-base">
          Accéder au portail client
        </Text>
      </TouchableOpacity>
      {/* Sticker d'email */}
      <View className="flex-row items-center mt-2">
        <Text className="text-2xl mr-2">📬</Text>
        <Text className="text-gray-500 text-base">
          Un email de confirmation vous a été envoyé.
        </Text>
      </View>
      {/* Message final positif */}
      <Text className="mt-6 text-green-600 font-semibold text-center">
        Toute l’équipe Cyna vous souhaite une expérience exceptionnelle&nbsp;!
        🚀
      </Text>
    </View>
  );
}
