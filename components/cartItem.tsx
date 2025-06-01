import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function CartItem({
  item,
  handleRemove,
}: {
  item: Product;
  handleRemove: (id: number) => void;
}) {
  return (
    <Link href={`/(tabs)/(products)?id=${item.id}`} asChild>
      <TouchableOpacity
        className="flex-row bg-white rounded-2xl shadow mb-4 mx-4 overflow-hidden"
        style={{ minHeight: 120, position: "relative" }}
        activeOpacity={0.93}
      >
        {/* Image à gauche */}
        <Image
          source={{
            uri: item.images?.[0]?.url || "https://via.placeholder.com/100",
          }}
          className="w-24 h-full"
          style={{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: "#f3f4f6",
          }}
          resizeMode="cover"
        />
        {/* Infos au centre */}
        <View className="flex-1 px-4 py-3 justify-center">
          <Text className="font-bold text-lg text-gray-900" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-gray-500 text-sm" numberOfLines={2}>
            {item.description}
          </Text>
          <Text className="text-gray-700 text-xs mt-1" numberOfLines={1}>
            {item.pricingModel ? String(item.pricingModel) : ""}
          </Text>
          <View className="flex-row items-end mt-2">
            <Text className="text-blue-600 font-bold text-xl">
              {item.amount / 100} €
            </Text>
          </View>
          {item.promo && (
            <Text className="text-xs text-red-500 font-semibold mt-1">
              En promo
            </Text>
          )}
        </View>
        {/* Bouton poubelle flottant en haut à droite */}
        <TouchableOpacity
          onPress={() => handleRemove(item.id)}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            zIndex: 2,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 6,
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 2,
            elevation: 2,
          }}
          accessibilityLabel="Supprimer du panier"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
        {/* Bouton abonnement flottant en bas à droite */}
        <Link href={`/(tabs-non)/(checkout)?productId=${item.id}`} asChild>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 12,
              right: 14,
              zIndex: 2,
              backgroundColor: "#2563eb",
              borderRadius: 20,
              padding: 10,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowRadius: 2,
              elevation: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="flash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </Link>
      </TouchableOpacity>
    </Link>
  );
}
