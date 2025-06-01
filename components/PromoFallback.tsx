import { Text, View } from "react-native";

export default function PromoFallback() {
  return (
    <>
      <Text className="text-lg font-bold mb-2">Nos promotions du moment</Text>
      <View className="w-full h-[130px] bg-gray-200 rounded-2xl my-2 justify-center items-center">
        {/* Optionnel : un skeleton ou une icône */}
        <View className="w-24 h-6 bg-gray-300 rounded mb-2" />
        <View className="w-40 h-4 bg-gray-300 rounded" />
      </View>
    </>
  );
}
