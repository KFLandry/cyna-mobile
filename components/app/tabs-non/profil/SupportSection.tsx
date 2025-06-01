import React from "react";
import { Linking, Text, View } from "react-native";

// --- Composant: Support ---
export default function ProfileSupportSection() {
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="font-semibold text-gray-700 mb-2">Contact support</Text>
      <Text className="text-gray-800 mb-1">
        Email :{" "}
        <Text
          style={{ color: "#2563eb" }}
          onPress={() => Linking.openURL("mailto:support@cyna.com")}
        >
          support@cyna.com
        </Text>
      </Text>
      <Text className="text-gray-800">
        Téléphone :{" "}
        <Text
          style={{ color: "#2563eb" }}
          onPress={() => Linking.openURL("tel:+33123456789")}
        >
          01 23 45 67 89
        </Text>
      </Text>
    </View>
  );
}
