import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// --- Composant: Validation Email ---
export default function ProfileEmailValidation({ user, verifyEmail }: any) {
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="font-semibold text-gray-700 mb-2">Validation email</Text>
      <View className="flex-row items-center">
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: user.emailVerified ? "#22c55e" : "#f59e42",
            marginRight: 8,
          }}
        />
        <Text className="text-gray-800">
          {user.emailVerified ? "Email vérifié" : "Email non vérifié"}
        </Text>
        {!user.emailVerified && (
          <TouchableOpacity
            className="ml-4"
            onPress={() => {
              verifyEmail()
                .then(() => {
                  alert("Un nouvel email de vérification a été envoyé.");
                })
                .catch((error: { message: string }) => {
                  alert(
                    "Erreur lors de l'envoi de l'email de vérification : " +
                      error.message
                  );
                });
            }}
          >
            <Text className="text-blue-600 font-bold text-xs">
              Renvoyer l’email
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
