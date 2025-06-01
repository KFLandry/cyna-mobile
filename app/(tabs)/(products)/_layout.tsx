import { Stack } from "expo-router";
import React from "react";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen name="products" options={{ title: "Product Details" }} />
    </Stack>
  );
}
