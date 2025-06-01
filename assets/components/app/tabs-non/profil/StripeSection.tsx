import { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// --- Composant: Section Stripe ---
export default function ProfileStripeSection({
  user,
  fetchCustomerPortalUrl,
}: {
  user: User;
  fetchCustomerPortalUrl?: () => Promise<string | null>;
}) {
  const openStripePortal = async () => {
    if (fetchCustomerPortalUrl) {
      const url = await fetchCustomerPortalUrl();
      if (url) {
        WebBrowser.openBrowserAsync(url);
      } else {
        alert(
          "Impossible de créer le compte Stripe. Veuillez réessayer plus tard."
        );
      }
    }
  };
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="font-semibold text-gray-700 mb-2">Compte Stripe</Text>
      {user.customerId ? (
        <>
          <Text className="text-gray-800 mb-2">
            ID Stripe: <Text className="font-mono">{user.customerId}</Text>
          </Text>
          <TouchableOpacity
            className="bg-blue-100 rounded-full px-4 py-2 flex-row items-center mb-2"
            onPress={openStripePortal}
          >
            <Ionicons
              name="person-circle-outline"
              size={18}
              color="#2563eb"
              style={{ marginRight: 6 }}
            />
            <Text className="text-blue-700 font-bold">
              Accéder au portail client
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          className="bg-blue-500 rounded-full px-4 py-2 flex-row items-center"
          onPress={openStripePortal}
        >
          <Ionicons
            name="add-circle-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text className="text-white font-bold">Créer mon compte Stripe</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
