import { Link, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! This screen doesn't exist." }} />
      <View className=" flex-1 justify-center items-center border-2 border-red-500">
        <Text className="text-red-500">This screen doesn&apos;t exist.</Text>
        <Link className="border rounded-md m-3 p-3" href="/(tabs)/(home)">
          Go to home screen
        </Link>
      </View>
    </>
  );
}
