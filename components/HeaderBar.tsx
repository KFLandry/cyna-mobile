import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

export default function HeaderBar() {
  const router = useRouter();
  return (
    <View className="fixed flex-row items-center justify-between my-4 px-1 py-2 bg-white shadow-md">
      {/* Logo */}
      <Link href="/(tabs)/(home)">
        <Image
          source={require("../assets/logo/cyna_it_logo.jpeg")}
          resizeMode="contain"
          style={{ width: 50, height: 50 }}
        />
      </Link>

      {/* Barre de recherche */}
      <View className="flex-1 mx-3">
        <TextInput
          placeholder="Rechercher..."
          className="bg-gray-100 rounded-full px-4 py-2 text-base"
          onSubmitEditing={(e) => {
            const query = e.nativeEvent.text;
            router.push(
              `/(tabs)/(products)?search=${encodeURIComponent(query)}`
            );
          }}
        />
      </View>

      {/* Icônes à droite */}
      <View className="flex-row items-center space-x-3">
        <Link href="/(tabs-non)/cart" asChild>
          <TouchableOpacity>
            <Ionicons name="cart-outline" size={32} color="#222" />
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs-non)/(profils)" asChild>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="#222" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
