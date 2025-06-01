import { Text, View } from "react-native";

export default function TopProductsFallback() {
  return (
    <>
      <Text className="text-lg font-bold mb-2 px-4">Top produits</Text>
      <View className="w-full h-[200px] bg-gray-200 rounded-2xl my-2 justify-center items-center">
        <View className="w-32 h-6 bg-gray-300 rounded mb-2" />
        <View className="w-48 h-4 bg-gray-300 rounded" />
      </View>
    </>
  );
}
