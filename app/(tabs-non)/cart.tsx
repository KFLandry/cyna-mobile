import { CartItem } from "@/components/cartItem";
import { useCart } from "@/providers/CartProvider";
import React from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function CartScreen() {
  const { products, removeProduct, clearCart } = useCart();

  const handleRemove = (id: number) => {
    removeProduct(id);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Vider le panier",
      "Voulez-vous vraiment supprimer tous les produits du panier ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Vider", style: "destructive", onPress: () => clearCart() },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 pt-6">
      <View className="flex-row justify-between items-center px-4 mb-4">
        <Text className="text-2xl font-bold">Mon panier</Text>
        {products.length > 0 && (
          <TouchableOpacity
            className="bg-red-100 px-4 py-2 rounded-full"
            onPress={handleClearAll}
            activeOpacity={0.8}
          >
            <Text className="text-red-600 font-semibold">Tout vider</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem item={item} handleRemove={() => handleRemove(item.id)} />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-20">
            Aucun produit dans le panier.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
