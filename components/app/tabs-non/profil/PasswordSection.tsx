import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// --- Composant: Changement de mot de passe ---
export default function ProfilePasswordSection({
  showPwdForm,
  setShowPwdForm,
  newPwd,
  setNewPwd,
  confirmPwd,
  setConfirmPwd,
  pwdError,
  setPwdError,
  resetPassword,
  email,
}: any) {
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="font-semibold text-gray-700 mb-2">
        Sécurité du compte
      </Text>
      {showPwdForm ? (
        <>
          <View className="mb-2">
            <Text className="text-gray-700 text-xs mb-1">
              Nouveau mot de passe
            </Text>
            <View className="bg-white rounded-lg border border-gray-200 px-3 py-2">
              <TextInput
                value={newPwd}
                onChangeText={setNewPwd}
                secureTextEntry
                placeholder="Nouveau mot de passe"
                className="text-gray-900"
              />
            </View>
          </View>
          <View className="mb-2">
            <Text className="text-gray-700 text-xs mb-1">
              Confirmer le mot de passe
            </Text>
            <View className="bg-white rounded-lg border border-gray-200 px-3 py-2">
              <TextInput
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                secureTextEntry
                placeholder="Confirmer le mot de passe"
                className="text-gray-900"
              />
            </View>
          </View>
          {pwdError ? (
            <Text className="text-red-500 text-xs mb-2">{pwdError}</Text>
          ) : null}
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="bg-blue-500 rounded-full px-4 py-2 flex-row items-center flex-1 justify-center"
              onPress={() => {
                if (!newPwd || !confirmPwd) {
                  setPwdError("Veuillez remplir les deux champs.");
                  return;
                }
                if (newPwd !== confirmPwd) {
                  setPwdError("Les mots de passe ne correspondent pas.");
                  return;
                }
                if (resetPassword) {
                  resetPassword(newPwd)
                    .then(() => {
                      alert("Mot de passe modifié avec succès !");
                    })
                    .catch((error: any) => {
                      alert(
                        "Erreur lors de la modification du mot de passe : " +
                          error.message
                      );
                    });
                } else {
                  alert(
                    "La fonction de réinitialisation du mot de passe n'est pas disponible."
                  );
                }
                setPwdError("");
                setShowPwdForm(false);
                setNewPwd("");
                setConfirmPwd("");
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text className="text-white font-bold">Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 rounded-full px-4 py-2 flex-row items-center justify-center"
              onPress={() => {
                setShowPwdForm(false);
                setPwdError("");
                setNewPwd("");
                setConfirmPwd("");
              }}
            >
              <Ionicons
                name="close-outline"
                size={18}
                color="#374151"
                style={{ marginRight: 6 }}
              />
              <Text className="text-gray-700 font-bold">Annuler</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity
          className="bg-blue-100 rounded-full px-4 py-2 flex-row items-center"
          onPress={() => setShowPwdForm(true)}
        >
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#2563eb"
            style={{ marginRight: 6 }}
          />
          <Text className="text-blue-700 font-bold">
            Modifier mon mot de passe
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
