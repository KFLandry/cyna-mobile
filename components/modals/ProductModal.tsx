import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
}

// Pour le voyant de statut
function getStatusColor(status: string) {
  if (status === "AVAILABLE") return "#22c55e"; // vert
  if (status === "UNAVAILABLE") return "#f59e42"; // orange
  return "#a3a3a3"; // gris
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductModal({
  product,
  visible,
  onClose,
}: ProductModalProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: "https://via.placeholder.com/400x220" }];

  // Gestion du scroll pour pagination
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setImageIndex(idx);
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%] pb-0">
          {/* Images en haut, scroll horizontal */}
          <View
            style={{
              width: SCREEN_WIDTH,
              height: 220,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
            }}
          >
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              style={{ width: SCREEN_WIDTH, height: 220 }}
            >
              {images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img.url }}
                  style={{
                    width: SCREEN_WIDTH,
                    height: 220,
                    resizeMode: "cover",
                  }}
                />
              ))}
            </ScrollView>
            {/* Points de pagination */}
            <View
              style={{
                position: "absolute",
                bottom: 12,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {images.map((_, idx) => (
                <View
                  key={idx}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor: idx === imageIndex ? "#2563eb" : "#d1d5db",
                  }}
                />
              ))}
            </View>
            {/* Bouton fermer en haut à droite */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 4,
                elevation: 2,
              }}
              onPress={onClose}
              hitSlop={16}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Contenu principal */}
          <ScrollView
            style={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 24,
            }}
          >
            {/* Nom & marque */}
            <View className="flex-row items-center mb-1">
              <Text className="font-bold text-2xl flex-1">{product.name}</Text>
              {/* Voyant statut */}
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: getStatusColor(product.status),
                  marginRight: 6,
                }}
              />
              <Text className="text-xs text-gray-500">{product.status}</Text>
            </View>
            <Text className="text-gray-500 mb-2">{product.brand}</Text>
            {/* Description */}
            <Text className="text-gray-700 mb-2">{product.description}</Text>
            <Text className="text-gray-700 mb-2">{product.caracteristics}</Text>
            {/* Prix et modèle */}
            <View className="flex-row items-end mb-2">
              <Text className="text-gray-700 mr-1">Price Model :</Text>
              <Text className="text-blue-600 font-bold text-xl">
                {String(product.pricingModel)}
              </Text>
            </View>
            <View className="flex-row items-end mb-2">
              <Text className="text-blue-600 font-bold text-xl">
                {product.amount / 100}
              </Text>

              <Text className="text-blue-600 font-semibold ml-1 text-base">
                €
              </Text>
            </View>
            {/* Promo */}
            {product.promo && (
              <Text className="text-xs text-red-500 font-semibold mb-2">
                En promo
              </Text>
            )}
            {/* Autres infos */}
            <Text className="text-gray-700 mb-2">
              Catégorie: {product.categoryId}
            </Text>
            <Text className="text-gray-700 mb-2">
              Ventes: {product.salesNumber || 0}
            </Text>
            <Text className="text-gray-400 text-xs mb-2">
              Ajouté le {new Date(product.createdAt).toLocaleDateString()}
            </Text>
            {/* Bouton abonnement */}
            <Link
              className="bg-blue-600 py-3 rounded-xl mt-4"
              href={`/(tabs-non)/(checkout)?productId=${product.id}`}
              asChild
            >
              <Text className="text-white text-center font-bold text-base">
                Prendre un abonnement
              </Text>
            </Link>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
