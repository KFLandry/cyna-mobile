import { Stack } from "expo-router";
import React from "react";

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Checkout" }}></Stack.Screen>
    </Stack>
  );
}
