import React from "react";
import { Text, View } from "react-native";

export default function ProductCardFallback() {
  return (
    <View
      className="flex-row bg-white rounded-2xl shadow mb-4 overflow-hidden opacity-80"
      style={{ minHeight: 110, position: "relative" }}
    >
      {/* Image placeholder */}
      <View
        className="w-24 h-full"
        style={{
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          backgroundColor: "#f3f4f6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#d1d5db", fontSize: 32 }}>🛒</Text>
      </View>

      {/* Infos placeholder */}
      <View className="flex-1 px-4 py-3 justify-center">
        <View
          style={{
            backgroundColor: "#f3f4f6",
            height: 18,
            width: "60%",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            backgroundColor: "#f3f4f6",
            height: 14,
            width: "40%",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            backgroundColor: "#f3f4f6",
            height: 12,
            width: "30%",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            backgroundColor: "#f3f4f6",
            height: 20,
            width: "30%",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <Text className="text-xs text-red-400 font-semibold mt-1">
          Produit indisponible
        </Text>
      </View>
    </View>
  );
}
