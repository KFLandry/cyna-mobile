import { useUser } from "@/providers/UserProvider";
import { Stack } from "expo-router";
import React from "react";

export default function TabNonLayout() {
  const { user } = useUser();

  return (
    <Stack
      screenOptions={{
        animation: "fade",
      }}
    >
      <Stack.Protected guard={!!user?.isLoggedIn}>
        <Stack.Screen name="(profils)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(checkout)"
          options={{ title: "Checkout", headerShown: false }}
        ></Stack.Screen>
      </Stack.Protected>

      <Stack.Screen
        name="(auth)"
        options={{ headerShown: true, title: "Authentification" }}
      />
      <Stack.Screen
        name="cart"
        options={{ headerShown: true, title: "Panier" }}
      />
    </Stack>
  );
}
