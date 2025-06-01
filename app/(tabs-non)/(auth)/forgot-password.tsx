import { Link } from "expo-router";
import React, { useState } from "react";

import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre email.");
      return;
    }
    // Ici tu mets ta logique d'envoi de mail de réinitialisation
    Alert.alert("Succès", "Un email de réinitialisation a été envoyé !");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6">Mot de passe oublié</Text>
      <Text className="text-base text-gray-600 mb-6 text-center">
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg"
        placeholderTextColor="#888"
      />
      <TouchableOpacity
        className="w-full bg-blue-500 py-3 rounded-lg mb-4"
        onPress={handleReset}
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-bold text-base">
          Réinitialiser le mot de passe
        </Text>
      </TouchableOpacity>
      <Link href="/(tabs-non)/(auth)/login">
        <Text className="text-blue-500 text-center mt-2">
          Retour à la connexion
        </Text>
      </Link>
    </View>
  );
}
