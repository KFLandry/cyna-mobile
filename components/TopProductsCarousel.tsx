import { useCart } from "@/providers/CartProvider";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

type TopProductsCarouselProps = {
  data: Product[];
};

export default function TopProductsCarousel({
  data,
}: TopProductsCarouselProps) {
  const { addProduct, removeProduct, products } = useCart();
  const [showAll, setShowAll] = React.useState(false);
  const displayedData = showAll ? data : data.slice(0, 10);

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
  const renderItem = ({ item }: { item: Product; index: number }) => (
    <View className="w-64 bg-white rounded-xl shadow-md mr-4 p-3 relative">
      {/* Icône panier/favoris */}
      <TouchableOpacity
        style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
        onPress={() => toggleCart(item)}
        hitSlop={10}
      >
        <Ionicons
          name={isInCart(item.id) ? "cart" : "cart-outline"}
          size={24}
          color={isInCart(item.id) ? "#22c55e" : "#d1d5db"}
        />
      </TouchableOpacity>
      <Image
        source={
          item.images && item.images[0] && item.images[0].url
            ? { uri: item.images[0].url }
            : require("../assets/images/download.jpeg")
        }
        style={{
          width: "100%",
          height: 100,
          borderRadius: 12,
          resizeMode: "cover",
        }}
      />
      {/* Titre, description, ventes, prix et bouton d'abonnement */}
      <Link href={`/(tabs)/(products)?id=${item.id}`} asChild>
        <TouchableOpacity>
          <Text
            className="mt-2 text-base font-bold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-1" numberOfLines={2}>
            {item.description}
          </Text>
          <Text className="text-xs text-gray-400 mb-1">
            {item.salesNumber ?? 0} achats
          </Text>
          <Text className="text-xs text-gray-500 mb-2">
            {String(item.pricingModel)}
          </Text>
          <Text className="text-lg font-semibold text-blue-600 mb-2">
            {item.amount} €
          </Text>
        </TouchableOpacity>
      </Link>
      <Link
        className="bg-blue-500 rounded-full py-2"
        href={`/(tabs-non)/(checkout)?productId=${item.id}`}
        asChild
      >
        <Text className="text-white text-center font-bold">
          Prendre un abonnement
        </Text>
      </Link>
    </View>
  );

  return (
    <View className="mt-8">
      <Text className="text-lg font-bold mb-2 px-4">Top produits</Text>
      <FlatList
        data={displayedData}
        horizontal
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
      />
      {data.length > 10 && (
        <TouchableOpacity
          style={{
            alignSelf: "center",
            marginTop: 8,
            backgroundColor: "#f3f4f6",
            borderRadius: 9999,
            paddingHorizontal: 20,
            paddingVertical: 8,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
          onPress={() => setShowAll((v) => !v)}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {showAll ? "Réduire" : "Voir plus"}
          </Text>
          <Ionicons
            name={showAll ? "chevron-up-outline" : "chevron-forward-outline"}
            size={18}
            color="#2563eb"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
