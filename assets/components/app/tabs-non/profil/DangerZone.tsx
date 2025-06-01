import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// --- Composant: Danger zone ---
export default function ProfileDangerZone({
  deleteAccount,
  logout,
  resetPassword,
  user,
}: any) {
  return (
    <View className="mt-8">
      <TouchableOpacity
        className="bg-red-100 rounded-full px-4 py-3 flex-row items-center justify-center mb-3"
        onPress={() => {
          if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
            if (deleteAccount) {
              deleteAccount()
                .then(() => {
                  alert("Votre compte a été supprimé avec succès.");
                  logout();
                  router.push("/(tabs)/(home)");
                })
                .catch((error: any) => {
                  alert(
                    "Erreur lors de la suppression du compte : " + error.message
                  );
                });
            } else {
              alert("La suppression du compte n'est pas disponible.");
            }
          }
        }}
      >
        <Ionicons
          name="trash-outline"
          size={18}
          color="#ef4444"
          style={{ marginRight: 6 }}
        />
        <Text className="text-red-600 font-bold">Supprimer mon compte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-gray-200 rounded-full px-4 py-3 flex-row items-center justify-center"
        onPress={() => {
          logout();
          router.push("/(tabs)/(home)");
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color="#374151"
          style={{ marginRight: 6 }}
        />
        <Text className="text-gray-700 font-bold">Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
