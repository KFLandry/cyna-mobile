import { Category } from "@/types/category";
import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CategoryGridProps = {
  data: Category[];
  columns?: number;
};

const CARD_SIZE = (Dimensions.get("window").width - 40) / 2; // 2 colonnes, 16px padding

function CategoryCard(category: Category) {
  return (
    <Link href={`/(tabs)/(products)?categoryId=${category.id}`} asChild>
      <TouchableOpacity
        className="bg-white rounded-xl shadow-md m-2 overflow-hidden"
        style={{ width: CARD_SIZE }}
      >
        <Image
          source={
            category.images?.[0]?.url
              ? { uri: category.images[0].url }
              : require("../assets/images/partial-react-logo.png")
          }
          style={{ width: "100%", height: 100, resizeMode: "cover" }}
          className="w-full h-full object-fill"
        />
        <View className="p-2">
          <Text className="text-base font-medium text-gray-900">
            {category.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function CategoryGrid({ data, columns = 2 }: CategoryGridProps) {
  const [showAll, setShowAll] = React.useState(false);
  const displayedData = showAll ? data : data.slice(0, 6);

  return (
    <>
      <Text className="text-lg font-bold">Nos Catégories</Text>
      <FlatList
        data={displayedData}
        numColumns={columns}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => <CategoryCard {...item} />}
        contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
        showsVerticalScrollIndicator={false}
        className="flex justify-center items-center"
      />
      {data.length > 6 && (
        <TouchableOpacity
          className="mx-auto my-2 px-4 py-2 bg-blue-500 rounded-full"
          onPress={() => setShowAll((v) => !v)}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">
            {showAll ? "Voir moins" : "Voir plus"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
