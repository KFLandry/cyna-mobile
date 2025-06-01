import type { User } from "@/types/user";

import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useCallback, useContext, useState } from "react";

type UserContextType = {
  user: User | null;
  token: string | null;
  logon: ({
    firstname,
    lastname,
    email,
    password,
  }: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  fetchCustomerPortalUrl?: () => Promise<string | null>;
  updateUser?: (user: Partial<User>) => void;
  uploadProfilePicture?: (file: File) => Promise<void>;
  verifyEmail?: () => Promise<void>;
  resetPassword?: (token: string, newPassword: string) => Promise<void>;
  patchUser?: (user: Partial<User>) => Promise<void>;
  deleteAccount?: () => Promise<void>;
  fetchUrl?: (customerId: string) => Promise<string | null>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://10.0.2.2:8080/api/v1";
export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Récupération du token au démarrage
  React.useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("userToken");
      if (storedToken) {
        setToken(storedToken);
      }
    })();
  }, []);

  // Décoder le token pour récupérer l'id/email
  const decodeToken = (token: string) => {
    try {
      return jwtDecode<{ jti: number; email: string }>(token);
    } catch {
      return null;
    }
  };

  // Login: stocke le token et fetch l'user
  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data?.message || res.statusText || "Unknown error";
        console.error("Login failed:", errorMsg);
        throw new Error(errorMsg);
      }
      const jwt = data.token;
      console.log("JWT received:", jwt);
      if (!jwt) {
        throw new Error("No JWT returned");
      }
      setToken(jwt);
      await SecureStore.setItemAsync("userToken", jwt);
      const decoded = decodeToken(jwt);
      console.log("Decoded JWT:", decoded);
      if (decoded?.jti) {
        // Fetch user complet depuis backend
        const resUser = await fetch(`${BACKEND_URL}/user/${decoded.jti}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        let userData = await resUser.json().catch((err) => {
          console.error("Error fetching user data:", err);
          return null;
        });

        userData = {
          ...userData,
          defaultCard: false,
          isLoggedIn: true,
          token: jwt,
        };
        console.log("User data fetched:", userData);
        setUser(userData);
      }
    },
    []
  );

  const logon = useCallback(
    async ({
      firstname,
      lastname,
      email,
      password,
    }: {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    }) => {
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          role: "USER",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data?.message || res.statusText || "Unknown error";
        console.error("Registration failed:", errorMsg);
        throw new Error(`Registration failed: ${errorMsg}`);
      }

      console.log("User registered:", data);
      // Après l'inscription, on peut automatiquement connecter l'utilisateur
      setToken(data.jwt);
      await SecureStore.setItemAsync("userToken", data.jwt);
      await login({ email, password });
    },
    [login]
  );

  // Logout: reset tout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    SecureStore.deleteItemAsync("userToken");
  }, []);

  // Fetch user si besoin
  const fetchUser = useCallback(async () => {
    if (!token || user) return;

    const decoded = decodeToken(token);
    if (decoded?.jti) {
      const res = await fetch(`${BACKEND_URL}/user/${decoded.jti}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await res.json();
      setUser(userData);
    }
  }, [token, user]);

  // modifier les infos de l'user cote serveur
  const patchUser = useCallback(
    async (updatedFields: Partial<User>) => {
      if (!user || !token) return;
      const res = await fetch(`${BACKEND_URL}/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        const errorMsg = (await res.json()).message || res.statusText;
        throw new Error(`Failed to update user: ${errorMsg}`);
      }
      const updatedUser = await res.json();
      setUser(updatedUser);
    },
    [user, token]
  );
  // Fonction pour mettre à jour partiellement l'utilisateur
  const updateUser = useCallback(
    (updatedFields: Partial<User>) => {
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedFields } : prevUser
      );
      // Appel à l'API pour mettre à jour l'utilisateur côté serveur
      patchUser(updatedFields).catch((error) => {
        console.error("Error updating user:", error);
      });
    },
    [patchUser]
  );

  // Upload user profile picture
  const uploadProfilePicture = useCallback(
    async (file: File) => {
      if (!user || !token) return;
      debugger;
      const formData = new FormData();
      formData.append("profile", file);
      debugger;
      try {
        const response = await fetch(
          `${BACKEND_URL}/user/${user.id}/profiles`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        console.log("Profile picture uploaded:", data);

        if (!response.ok) throw new Error("Upload failed");

        updateUser({ urlProfile: data.url });
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw new Error(`Failed to upload profile picture: ${error}`);
      }
    },
    [user, token, updateUser]
  );

  // Vérification de l'email
  const verifyEmail = useCallback(async () => {
    console.log("Verifying email for user:", user?.email);
    const res = await fetch(
      `${BACKEND_URL}/auth/verify-email?email=${user?.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      const errorMsg = (await res.json()).message || res.statusText;
      console.error("Email verification failed:", errorMsg);
      throw new Error(`Email verification failed: ${errorMsg}`);
    }
    // No return value needed
  }, [user?.email]);

  // Fectch url
  const fetchUrl = useCallback(
    async (customerId: string) => {
      const res = await fetch(
        `${BACKEND_URL}/subscriptions/${customerId}/customer-portal`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorMsg = (await res.json()).message || res.statusText;
        throw new Error(`Failed to fetch customer portal URL: ${errorMsg}`);
      }
      const data = await res.text();
      console.log("Customer portal URL fetched:", data);
      return data ?? null;
    },
    [token]
  );

  // Fetch customer portal URL
  const fetchCustomerPortalUrl = useCallback(async (): Promise<
    string | null
  > => {
    if (!user) {
      throw new Error("User is not defined");
    }
    if (!user.customerId) {
      const res = await fetch(`${BACKEND_URL}/subscriptions/create-customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          name: `${user?.firstname} ${user?.lastname}`,
          email: user?.email,
        }),
      });
      if (!res.ok) {
        const errorMsg = (await res.json()).message || res.statusText;
        throw new Error(`Failed to fetch customer portal URL: ${errorMsg}`);
      }
      const { customer } = await res.json();
      debugger;
      updateUser({ customerId: customer.customer_id });
      return fetchUrl(customer.customer_id);
    } else {
      // If customerId exists, fetch the portal URL
      return fetchUrl(user.customerId);
    }
  }, [user, token, updateUser, fetchUrl]);

  // Delete user account
  const deleteAccount = useCallback(async () => {
    if (!user || !token) return;
    const res = await fetch(`${BACKEND_URL}/user/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorMsg = (await res.json()).message || res.statusText;
      throw new Error(`Failed to delete account: ${errorMsg}`);
    }
    setUser(null);
    setToken(null);
  }, [user, token]);

  // Reset password
  const resetPassword = useCallback(
    async (newPassword: string) => {
      if (!user) {
        console.error("User is not defined");
        throw new Error("User is not defined");
      }
      console.log("Resetting password for user:", user?.id);
      const res = await fetch(`${BACKEND_URL}/user/${user.id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) {
        const errorMsg = (await res.json()).message || res.statusText;
        console.error("Reset password failed:", errorMsg);
        throw new Error(`Failed to reset password: ${errorMsg}`);
      }
    },
    [user, token]
  );
  return (
    <UserContext.Provider
      value={{
        user,
        token,
        logon,
        login,
        logout,
        fetchUser,
        updateUser,
        uploadProfilePicture,
        verifyEmail,
        fetchCustomerPortalUrl,
        fetchUrl,
        patchUser,
        deleteAccount,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
