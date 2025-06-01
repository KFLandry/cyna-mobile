import { Stack } from "expo-router";
import React from "react";

export default function ProfilsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Mon compte" }}
      ></Stack.Screen>
    </Stack>
  );
}
