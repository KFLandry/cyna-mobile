import Carousel from "@/components/Carousel";
import CategoriesFallback from "@/components/CategoriesFallback";
import CategoryGrid from "@/components/CategoryGrid";
import PromoFallback from "@/components/PromoFallback";
import TopProductsCarousel from "@/components/TopProductsCarousel";
import TopProductsFallback from "@/components/TopProductsFallback";
import { CarouselType } from "@/types/Carousel";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { fetchCategories } from "../(products)";

export default function HomeScreen() {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  console.log("BACKEND_URL:", BACKEND_URL);

  const [promos, setPromos] = useState<CarouselType[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [promosError, setPromosError] = useState(false);
  const [topProductsError, setTopProductsError] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  // Simule une récupération de données
  useEffect(() => {
    const fetchData = async () => {
      await Promise.allSettled([
        fetchCategories()
          .then((data) => {
            setCategories(data);
            setCategoriesError(false);
          })
          .catch(() => setCategoriesError(true)),
        fetch(`${BACKEND_URL}/products/top-products?top=14`)
          .then(async (res) => {
            if (!res.ok) throw new Error();
            const data = await res.json();
            setTopProducts(data);
            setTopProductsError(false);
          })
          .catch(() => setTopProductsError(true)),
        fetch(`${BACKEND_URL}/carousel?limits=10`)
          .then(async (res) => {
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPromos(data);
            setPromosError(false);
          })
          .catch(() => setPromosError(true)),
      ]);
      // Si une des requêtes a échoué, on affiche un message d'erreur
      if (promosError || topProductsError || categoriesError) {
        console.error(
          "Une erreur est survenue lors du chargement des données."
        );
        Alert.alert(
          "Erreur de chargement",
          "Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.",
          [{ text: "OK" }]
        );
      }
      setLoading(false); // On enlève le loading quand tout est fini
    };

    fetchData();
  }, [BACKEND_URL, categoriesError, promosError, topProductsError]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-600 mb-4">
            Bienvenue sur Cyna !
          </Text>
          <View
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderTopColor: "#fff" }}
          />
          <Text className="text-lg text-gray-500">Chargement en cours...</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={[]} // Pas de data, on utilise seulement ListHeaderComponent
      keyExtractor={() => ""}
      ListHeaderComponent={
        <View className="h-full">
          {/* Carousel */}
          <View className="mt-6 flex-1 size-fit">
            {promosError ? <PromoFallback /> : <Carousel data={promos} />}
          </View>

          {/* Top produits */}
          <View className="mt-2 flex-1">
            {topProductsError ? (
              <TopProductsFallback />
            ) : (
              <TopProductsCarousel data={topProducts} />
            )}
          </View>

          {/* Catégories */}
          <View className="mt-6 px-4 flex-1">
            {categoriesError ? (
              <CategoriesFallback />
            ) : (
              <CategoryGrid data={categories} />
            )}
          </View>
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32, backgroundColor: "#f7f7f7" }}
      renderItem={undefined}
    />
  );
}
