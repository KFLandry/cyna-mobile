import ProductModal from "@/components/modals/ProductModal";
import ProductCard from "@/components/ProductCard";
import ProductCardFallback from "@/components/ProductCardFallback";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// URL de l'API backend (remplace par ton URL)
const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://10.0.2.2:8080/api/v1";

// On récupére les catégories
export const fetchCategories = async (): Promise<Category[]> => {
  return fetch(`${BACKEND_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erreur de récupération des catégories:", error);
      return [];
    });
};

// On récupére les produits avec les filtres
const fetchProducts = async (
  categoryIds: number[],
  promoOnly: boolean,
  sort:
    | "asc"
    | "desc"
    | "priceAsc"
    | "priceDesc"
    | "createdAtAsc"
    | "createdAtDesc",
  page: number,
  pageSize: number
): Promise<{ products: Product[]; total: number }> => {
  // Appel API réel avec pagination, tri et filtres côté backend
  const url = `${BACKEND_URL}/products/pagination?categoryIds=${categoryIds.join(
    ","
  )}&promoOnly=${promoOnly}&sort=${sort}&page=${page}&size=${pageSize}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des produits");
  }
  // API retourne { products, total }
  const data = await response.json();
  return { products: data.products || [], total: data.size || 0 };
};

const fetchProductById = async (id: number): Promise<Product | null> => {
  const response = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error(
      `Erreur lors de la récupération du produit: ${response.status} ${errorData.message}`
    );
    return null;
  }
  return response.json() || null;
};

// Search products by keyword
const fetchProductsByKeyword = async (
  keyword: string,
  page: number,
  pageSize: number
): Promise<{ products: Product[]; total: number }> => {
  const url = `${BACKEND_URL}/products/search?keyword=${encodeURIComponent(
    keyword
  )}&page=${page}&size=${pageSize}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Erreur lors de la recherche de produits: " + ${errorData.message});`
    );
  }
  const data = await response.json();
  return { products: data.products || [], total: data.size || 0 };
};

// Nombre de produits par page
const PAGE_SIZE = 6;

export default function ProductListScreen() {
  // Récupération des paramètres de recherche
  const idProduct = useSearchParams().get("id");
  const categoryId = useSearchParams().get("categoryId");
  const word = useSearchParams().get("search");
  const pathname = usePathname();
  console.log("Pathname:", pathname);
  console.log("ID Produit:", idProduct);
  console.log("ID Catégorie:", categoryId);
  console.log("Mot clé de recherche:", word);

  // États pour les filtres et les produits
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categoryId ? [Number(categoryId)] : []
  );
  const [promoOnly, setPromoOnly] = useState(false);
  const [sort, setSort] = useState<
    "asc" | "desc" | "priceAsc" | "priceDesc" | "createdAtAsc" | "createdAtDesc"
  >("asc");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [productsError, setProductsError] = useState(false);

  // Fetch catégories au chargement
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Fetch produits à chaque changement de filtre/tri/page
  useEffect(() => {
    setLoading(true);
    setProductsError(false);
    // Si un mot clé de recherche est fourni, on effectue une recherche
    if (word) {
      fetchProductsByKeyword(word, page, PAGE_SIZE)
        .then(({ products, total }) => {
          console.log("Produits trouvés:", products);
          console.log("Total de produits trouvés:", total);
          setProducts(products);
          setTotal(total);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error("Erreur de recherche de produits:", error);
          setProducts([]);
          setTotal(0);
          setProductsError(true);
          setLoading(false);
        });
      return;
    }

    // Sinon, on récupère les produits avec les filtres et tri
    fetchProducts(selectedCategories, promoOnly, sort, page, PAGE_SIZE)
      .then(async ({ products, total }) => {
        setProducts(products);
        setTotal(total);
        setLoading(false);
        // Redirection vers la models detail si id Produit
        if (idProduct) {
          let product = products.find((p) => p.id === Number(idProduct));
          if (!product) {
            // Si le produit n'est pas trouvé, on réinitialise l'id
            const fetchedProduct = await fetchProductById(Number(idProduct));
            if (fetchedProduct) {
              setSelectedProduct(fetchedProduct);
            } else {
              setSelectedProduct(null);
            }
          } else {
            setSelectedProduct(product);
          }
        }
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setProductsError(true);
        setLoading(false);
      });
  }, [selectedCategories, promoOnly, sort, page, idProduct, word]);

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE) - 1;
  console.log("Total pages:", totalPages);

  // Changement promo
  const togglePromo = () => {
    setPage(1);
    setPromoOnly((p) => !p);
  };

  // Changement page
  const goToPage = (p: number) => setPage(p);

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Filtres */}
      <View className="flex-row items-center justify-between mb-2 space-x-2">
        {/* Bouton pour ouvrir la modal de catégories */}
        <TouchableOpacity
          onPress={() => setCategoryModalVisible(true)}
          className="px-3 py-1 rounded-full border bg-gray-100 border-gray-300"
          activeOpacity={0.8}
        >
          <Text className="text-gray-700">
            {selectedCategories.length === 0
              ? "Catégorie"
              : categories.find((c) => c.id === selectedCategories[0])?.name}
          </Text>
        </TouchableOpacity>
        {/* Promo */}
        <TouchableOpacity
          onPress={togglePromo}
          className={`px-3 py-1 rounded-full border ${
            promoOnly
              ? "bg-blue-500 border-blue-500"
              : "bg-gray-100 border-gray-300"
          }`}
          activeOpacity={0.8}
        >
          <Text className={promoOnly ? "text-white" : "text-gray-700"}>
            Promo
          </Text>
        </TouchableOpacity>
        {/* Tri prix */}
        <TouchableOpacity
          onPress={() => {
            setPage(1);
            setSort((s) =>
              s === "asc"
                ? "desc"
                : s === "desc"
                ? "priceAsc"
                : s === "priceAsc"
                ? "priceDesc"
                : s === "priceDesc"
                ? "createdAtAsc"
                : s === "createdAtAsc"
                ? "createdAtDesc"
                : "asc"
            );
          }}
          className="px-3 py-1 rounded-full border bg-gray-100 border-gray-300"
          activeOpacity={0.8}
        >
          <Text className="text-gray-700">
            {sort === "asc"
              ? "A-Z"
              : sort === "desc"
              ? "Z-A"
              : sort === "priceAsc"
              ? "Prix ↑"
              : sort === "priceDesc"
              ? "Prix ↓"
              : sort === "createdAtAsc"
              ? "Nouveaux ↑"
              : sort === "createdAtDesc"
              ? "Nouveaux ↓"
              : "Trier"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de sélection de catégorie */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setCategoryModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              minWidth: 250,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSelectedCategories([]);
                setCategoryModalVisible(false);
                setPage(1);
              }}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={
                  selectedCategories.length === 0
                    ? "checkbox"
                    : "square-outline"
                }
                size={20}
                color="#2563eb"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
                Toutes les catégories
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => {
              const checked = selectedCategories.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setSelectedCategories((prev) =>
                      checked
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id]
                    );
                    setPage(1);
                  }}
                  style={{
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={checked ? "checkbox" : "square-outline"}
                    size={20}
                    color={checked ? "#2563eb" : "#9ca3af"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: checked ? "#2563eb" : "#1f2937",
                      fontWeight: checked ? "bold" : "normal",
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {/* Bouton de validation */}
            <TouchableOpacity
              onPress={() => setCategoryModalVisible(false)}
              style={{
                marginTop: 16,
                backgroundColor: "#2563eb",
                borderRadius: 8,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Valider
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Liste des produits */}
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-8" />
      ) : productsError ? (
        // Affiche un fallback global si erreur de chargement
        <ProductCardFallback />
      ) : products.length === 0 ? (
        // Affiche un fallback si aucun produit trouvé
        <ProductCardFallback />
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item: Product) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => setSelectedProduct(item)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
          {/* Pagination moderne */}
          {totalPages > 1 && (
            <View className="flex-row justify-center items-center mt-2 mb-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <TouchableOpacity
                  key={i + 1}
                  onPress={() => goToPage(i + 1)}
                  className={`mx-1 px-3 py-1 rounded-full ${
                    page === i + 1 ? "bg-blue-500" : "bg-gray-200"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`font-bold ${
                      page === i + 1 ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
      {/* Modal produit */}
      <ProductModal
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </View>
  );
}
