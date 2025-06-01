import HeaderBar from "@/components/HeaderBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <>
      <HeaderBar />
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="(home)/index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(products)"
          options={{
            title: "Products",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cube" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
