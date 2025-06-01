import { Product } from "@/types/product";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useState } from "react";

type CartContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  clearCart: () => void;
  exist?: (productId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  // Charger le panier au démarrage
  React.useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("cartItems");
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch {
          setProducts([]);
        }
      }
    })();
  }, []);

  // Sauvegarder le panier à chaque changement
  React.useEffect(() => {
    SecureStore.setItemAsync("cartItems", JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const removeProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCart = () => {
    setProducts([]);
    SecureStore.deleteItemAsync("cartItems");
  };

  const exist = (productId: number) => {
    return products.some((p) => p.id === productId);
  };

  return (
    <CartContext.Provider
      value={{ products, addProduct, removeProduct, clearCart, exist }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
