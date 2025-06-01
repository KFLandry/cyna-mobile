import React from "react";
import { Pressable, Text } from "react-native";

// Bouton réutilisable

export function MainButton({
  children,
  onPress,
  disabled = true,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  onPress: React.ComponentProps<typeof Pressable>["onPress"];
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={
        `${
          disabled ? "bg-blue-600" : "bg-gray-600"
        } rounded-xl py-3 px-6 w-full items-center mt-3 active:opacity-80 ` +
        className
      }
      {...props}
    >
      <Text className="text-white font-bold text-base">{children}</Text>
    </Pressable>
  );
}
