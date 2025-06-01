import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- Composant: Header du profil (photo, nom, email, édition) ---
export default function ProfileHeader({
  user,
  editMode,
  setEditMode,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  email,
  setEmail,
  phone,
  setPhone,
  profileImage,
  setProfileImage,
  pickImage,
  updateUser,
  edit,
}: any) {
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center mb-3">
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri:
                profileImage ||
                "https://ui-avatars.com/api/?name=" +
                  user.firstname +
                  "+" +
                  user.lastname,
            }}
            className="w-16 h-16 rounded-full bg-gray-200"
          />
          <TouchableOpacity
            onPress={pickImage}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#fff",
              borderRadius: 999,
              padding: 4,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          {editMode ? (
            <>
              <TextInput
                value={firstname}
                onChangeText={setFirstname}
                placeholder="Prénom"
                className="font-bold text-lg text-gray-900 mb-1"
                style={{ borderBottomWidth: 1, borderColor: "#e5e7eb" }}
              />
              <TextInput
                value={lastname}
                onChangeText={setLastname}
                placeholder="Nom"
                className="font-bold text-lg text-gray-900"
                style={{ borderBottomWidth: 1, borderColor: "#e5e7eb" }}
              />
            </>
          ) : (
            <>
              <Text className="font-bold text-xl text-gray-900">
                {user.firstname} {user.lastname}
              </Text>
              <Text className="text-gray-500">{user.roles}</Text>
            </>
          )}
        </View>
        {!editMode && (
          <TouchableOpacity onPress={() => setEditMode(true)} className="ml-2">
            <Ionicons name="pencil-outline" size={20} color="#2563eb" />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-2">
        <Text className="text-gray-700 font-semibold">Email</Text>
        {editMode ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            className="text-gray-800"
            style={{ borderBottomWidth: 1, borderColor: "#e5e7eb" }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        ) : (
          <View className="flex-row items-center">
            <Text className="text-gray-800 mr-2">{user.email}</Text>
            {user.emailVerified ? (
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            ) : null}
          </View>
        )}
      </View>
      <View className="mb-2">
        <Text className="text-gray-700 font-semibold">Téléphone</Text>
        {editMode ? (
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Téléphone"
            className="text-gray-800"
            style={{ borderBottomWidth: 1, borderColor: "#e5e7eb" }}
            keyboardType="phone-pad"
          />
        ) : (
          <Text className="text-gray-800">
            {user.phone ? `+${user.phone}` : "Non renseigné"}
          </Text>
        )}
      </View>
      {editMode && (
        <View className="flex-row space-x-2 mt-2">
          <TouchableOpacity
            className="bg-blue-500 rounded-full px-4 py-2 flex-row items-center flex-1 justify-center"
            onPress={edit}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white font-bold">Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-200 rounded-full px-4 py-2 flex-row items-center justify-center"
            onPress={() => {
              setEditMode(false);
              setFirstname(user.firstname);
              setLastname(user.lastname);
              setEmail(user.email);
              setPhone(user.phone?.toString() || "");
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
      )}
    </View>
  );
}
