import ProfileDangerZone from "@/components/app/tabs-non/profil/DangerZone";
import ProfileEmailValidation from "@/components/app/tabs-non/profil/EmailValidation";
import ProfilePasswordSection from "@/components/app/tabs-non/profil/PasswordSection";
import ProfileHeader from "@/components/app/tabs-non/profil/ProfileHeader";
import ProfileStripeSection from "@/components/app/tabs-non/profil/StripeSection";
import ProfileSupportSection from "@/components/app/tabs-non/profil/SupportSection";
import { useUser } from "@/providers/UserProvider";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

// --- Composant principal ---
export default function ProfilsScreen() {
  const {
    user,
    fetchUser,
    updateUser,
    uploadProfilePicture,
    logout,
    verifyEmail,
    deleteAccount,
    resetPassword,
    fetchCustomerPortalUrl,
  } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");

  const edit = async () => {
    if (!firstname || !lastname || !email) {
      alert("Tous les champs sont requis.");
      return;
    }
    const updatedUser = {
      firstname,
      lastname,
      email,
      phone: phone ? Number(phone) : undefined,
      urlProfile: profileImage,
    };
    try {
      if (updateUser) {
        updateUser(updatedUser);
        setEditMode(false);
        alert("Profil mis à jour avec succès !");
      }
    } catch (error: any) {
      alert("Erreur lors de la mise à jour du profil : " + error.message);
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
      setPhone(user.phone?.toString() ?? "");
      setProfileImage(user.urlProfile ?? "");
    }
  }, [user]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("L'accès à la galerie est requis pour changer la photo de profil.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      if (uploadProfilePicture) {
        const uri = result.assets[0].uri;
        let fileToUpload: any = uri;
        if (typeof window !== "undefined" && uri.startsWith("file")) {
          const response = await fetch(uri);
          const blob = await response.blob();
          const name = uri.split("/").pop() || "profile.jpg";
          debugger;
          fileToUpload = new File([blob], name, { type: blob.type });
        }
        uploadProfilePicture(fileToUpload)
          .then(() => {
            alert("Photo de profil mise à jour avec succès !");
          })
          .catch((error) => {
            alert(
              "Erreur lors de la mise à jour de la photo : " + error.message
            );
          });
      }
    }
  };

  if (!user)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );

  return (
    <>
      <Stack.Screen options={{ title: "Profil" }} />
      <View className="flex-1 bg-white px-4 pt-6">
        <ProfileHeader
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
          firstname={firstname}
          setFirstname={setFirstname}
          lastname={lastname}
          setLastname={setLastname}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          pickImage={pickImage}
          updateUser={updateUser}
          edit={edit}
        />
        <ProfileStripeSection
          user={user}
          fetchCustomerPortalUrl={fetchCustomerPortalUrl}
        />
        <ProfileEmailValidation user={user} verifyEmail={verifyEmail} />
        <ProfilePasswordSection
          showPwdForm={showPwdForm}
          setShowPwdForm={setShowPwdForm}
          newPwd={newPwd}
          setNewPwd={setNewPwd}
          confirmPwd={confirmPwd}
          setConfirmPwd={setConfirmPwd}
          pwdError={pwdError}
          setPwdError={setPwdError}
          resetPassword={resetPassword}
          email={email}
        />
        <ProfileSupportSection />
        <ProfileDangerZone
          deleteAccount={deleteAccount}
          logout={logout}
          user={user}
        />
      </View>
    </>
  );
}
