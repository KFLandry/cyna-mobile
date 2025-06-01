import { QuantityStep } from "@/components/steps/QuantityStep";
import { useUser } from "@/providers/UserProvider";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { ConfirmationStep } from "../../../components/steps/ConfirmationStep";
import { PaymentMethodStep } from "../../../components/steps/PaymentMethodStep";

import { RecapStep } from "../../../components/steps/RecapStep";
import { StripeStepper } from "../../../components/steps/StripeStepper";
import { Product } from "@/types/product";

export default function CheckoutScreen() {
  // Vérification de la présence de l'URL de backend et de la clé publique Stripe
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const productId = useSearchParams().get("productId");
  const { user, fetchCustomerPortalUrl } = useUser();
  const [step, setStep] = useState(0);
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      setLoading(true);
      fetch(`${BACKEND_URL}/products/${productId}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Error fetching product:", errorData);
            throw new Error(
              "Erreur lors de la récupération du produit : " +
                res.status +
                " - " +
                errorData.message
            );
          }
          return res.json();
        })
        .then((data) => {
          setCurrentProduct(data);
        })
        .catch((error) => {
          Alert.alert("Erreur", error.message);
          router.back();
        })
        .finally(() => setLoading(false));
    }
  }, [productId, BACKEND_URL, router]);

  useEffect(() => {
    const prepareStripePayment = async () => {
      if (
        step !== 2 ||
        !currentProduct ||
        !user?.token ||
        !user?.customerId ||
        !quantity
      )
        return;
      setLoading(true);
      try {
        // 1. Créer la subscription et récupérer le clientSecret
        const res1 = await fetch(
          `${BACKEND_URL}/subscriptions/create-subscription`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              priceId: currentProduct.priceId,
              quantity,
              customerId: user.customerId,
            }),
          }
        );
        if (!res1.ok) {
          const errorData = await res1.json();
          setStep(1);
          throw new Error(
            `Erreur lors de la création du PaymentIntent. Code : ${res1.status} : ${errorData.message}`
          );
        }
        const subscription = await res1.json();

        // 2. Récupérer la clé éphémère Stripe
        const res2 = await fetch(
          `${BACKEND_URL}/subscriptions/${user.customerId}/ephemeral-key`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res2.ok) {
          const errorData = await res2.json();
          setStep(1);
          throw new Error(
            `Erreur lors de la récupération de la clé éphémère. Code : ${res2.status} : ${errorData.message}`
          );
        }
        const ephemeralKey = await res2.text();

        console.log("Ephemeral Key:", ephemeralKey);
        console.log("Subscription Client Secret:", subscription.clientSecret);

        // 3. Initialiser la PaymentSheet Stripe
        const { error } = await initPaymentSheet({
          customerId: user.customerId,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: subscription.clientSecret,
          merchantDisplayName: "Cyna Mobile",
        });
        if (error) {
          Alert.alert("Erreur Stripe", error.message);
        }
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };

    prepareStripePayment();
  }, [
    step,
    currentProduct,
    user?.token,
    user?.customerId,
    quantity,
    BACKEND_URL,
    initPaymentSheet,
  ]);

  const handlePay = async () => {
    const { error } = await presentPaymentSheet();
    if (error) Alert.alert("Erreur", error.message);
    else setStep(3);
  };

  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error(
      "STRIPE_PUBLISHABLE_KEY is not defined in environment variables."
    );
  }
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          router.back();
        }}
      >
        <View className="flex-1 bg-black/25 justify-center items-center">
          <View className="bg-white rounded-3xl w-[480px] max-w-full min-h-[600px] py-10 px-8 items-center overflow-hidden shadow-2xl">
            {/* Bouton de fermeture */}
            <View className="w-full flex-row justify-end">
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  router.push("/(tabs)/(home)"); // Redirige vers la page d'accueil
                }}
                className="p-2 rounded-full hover:bg-gray-100"
                accessibilityLabel="Fermer le checkout"
              >
                <Text className="text-2xl text-gray-400 font-bold">×</Text>
              </Pressable>
            </View>
            <StripeStepper currentStep={step} setStep={setStep} maxStep={2} />
            {step === 0 && (
              <PaymentMethodStep
                user={user}
                onNext={() => setStep(1)}
                fetchCustomerPortalUrl={fetchCustomerPortalUrl}
              />
            )}
            {step === 1 && currentProduct && (
              <QuantityStep
                currentProduct={currentProduct}
                quantity={quantity}
                setQuantity={setQuantity}
                onNext={() => {
                  setStep(2);
                }}
              />
            )}
            {step === 2 && currentProduct && (
              <RecapStep
                currentProduct={currentProduct}
                quantity={quantity}
                loading={loading}
                onPay={handlePay}
                onCancel={() => {
                  setModalVisible(false);
                  router.push("/(tabs)/(home)"); // Redirige vers la page d'accueil
                  setStep(0);
                }}
              />
            )}
            {step === 3 && <ConfirmationStep fetchCustomerPortalUrl={fetchCustomerPortalUrl} />}
          </View>
        </View>
      </Modal>
    </StripeProvider>
  );
}
