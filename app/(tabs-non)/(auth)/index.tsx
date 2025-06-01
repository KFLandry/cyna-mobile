import { Link } from "expo-router";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function AuthRedirectScreen() {
  return (
    <>
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-2xl font-bold mb-8 text-gray-900">Bienvenue</Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Connectez-vous ou créez un compte pour profiter de toutes les
          fonctionnalités.
        </Text>
        <Link href="/(tabs-non)/(auth)/login" asChild>
          <TouchableOpacity
            className="w-full bg-blue-500 py-3 rounded-lg mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-base">
              Se connecter
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs-non)/(auth)/logon" asChild>
          <TouchableOpacity
            className="w-full bg-gray-100 py-3 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-blue-500 text-center font-bold text-base">
              Créer un compte
            </Text>
          </TouchableOpacity>
        </Link>
        {/* Lien vers la page d'accueil */}
        <Link href="/(tabs)/(home)" asChild>
          <TouchableOpacity className="mt-8" activeOpacity={0.7}>
            <Text className="text-gray-400 underline text-center">
              Retour à l&apos;accueil
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Section contact support */}
      <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
        <Text className="font-semibold text-gray-700 mb-2">
          Contact support
        </Text>
        <Text className="text-gray-800 mb-1">
          Email :{" "}
          <Text
            style={{ color: "#2563eb" }}
            onPress={() => Linking.openURL("mailto:support@tonsite.com")}
          >
            support@tonsite.com
          </Text>
        </Text>
      </View>
    </>
  );
}
