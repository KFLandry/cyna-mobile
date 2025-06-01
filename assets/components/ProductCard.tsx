import { useCart } from "@/providers/CartProvider";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { addProduct, removeProduct, products } = useCart();

  // Vérifie si le produit est dans le panier
  const isInCart = (productId: number) =>
    products.some((p) => p.id === productId);

  const toggleCart = (product: Product) => {
    if (isInCart(product.id)) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  return (
    <TouchableOpacity
      className="flex-row bg-white rounded-2xl shadow mb-4 overflow-hidden"
      onPress={onPress}
      activeOpacity={0.93}
      style={{ minHeight: 110, position: "relative" }}
    >
      {/* Image à gauche */}
      <Image
        source={{
          uri: product.images?.[0]?.url || "https://via.placeholder.com/100",
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
          {product.name}
        </Text>
        <Text className="text-gray-500 text-sm" numberOfLines={1}>
          {product.brand}
        </Text>
        <Text className="text-gray-700 text-xs mt-1" numberOfLines={1}>
          {product.pricingModel ? String(product.pricingModel) : ""}
        </Text>
        <View className="flex-row items-end mt-2">
          <Text className="text-blue-600 font-bold text-xl">
            {product.amount / 100} €
          </Text>
        </View>
        {product.promo && (
          <Text className="text-xs text-red-500 font-semibold mt-1">
            En promo
          </Text>
        )}
      </View>

      {/* Bouton favoris en haut à droite */}
      <TouchableOpacity
        onPress={toggleCart.bind(null, product)}
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
        activeOpacity={0.7}
      >
        <Ionicons
          name={isInCart(product.id) ? "cart" : "cart-outline"}
          size={22}
          color={isInCart(product.id) ? "#22c55e" : "#d1d5db"}
        />
      </TouchableOpacity>

      {/* Bouton abonnement en bas à droite */}
      <View
        style={{
          position: "absolute",
          bottom: 12,
          right: 14,
          zIndex: 2,
        }}
      >
        <Link
          href={`/(tabs-non)/(checkout)?priceId=${product.priceId}`}
          asChild
        >
          <TouchableOpacity
            className="flex-row items-center bg-blue-100 px-4 py-2 rounded-full"
            activeOpacity={0.85}
          >
            <Ionicons
              name="flash-outline"
              size={18}
              color="#2563eb"
              style={{ marginRight: 6 }}
            />
            <Text className="text-blue-700 font-bold text-xs">Go</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </TouchableOpacity>
  );
}
