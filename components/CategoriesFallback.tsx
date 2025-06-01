import { View } from "react-native";

export default function CategoriesFallback() {
  return (
    <View className="w-full h-[250px] bg-gray-200 rounded-2xl my-2 justify-center items-center">
      <View className="w-28 h-6 bg-gray-300 rounded mb-2" />
      <View className="w-56 h-4 bg-gray-300 rounded" />
    </View>
  );
}
