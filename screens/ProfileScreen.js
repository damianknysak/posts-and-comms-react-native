import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import HomeHeader from "../components/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  CakeIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentIcon,
  PencilSquareIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import EditDate from "../components/EditDate";

const ProfileScreen = () => {
  const { user, onLogoutClick, HOST_URI, refreshUser, updateUser } = useAuth();
  const [newProfileImage, setNewProfileImage] = useState();
  const navigation = useNavigation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfileImage(result.assets[0].uri);
      await updateUser(result.assets[0].uri);

      refreshUser();
    }
  };

  return (
    <View className="flex-1 bg-violet-500">
      <SafeAreaView>
        <HomeHeader />
      </SafeAreaView>
      <View className="rounded-t-3xl overflow-hidden">
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 250,
          }}
          className="bg-white min-h-screen rounded-t-3xl"
        >
          <View className="items-center mt-5">
            <Text className="font-semibold text-lg my-5">Twoje konto</Text>
            <View className="relative bg-violet-200 w-20 h-20 rounded-full items-center justify-center border-violet-500 border">
              <Image
                className="w-20 h-20 rounded-full"
                source={{
                  uri: newProfileImage
                    ? newProfileImage
                    : `${HOST_URI}/storage/${user.profile_image}`,
                }}
              />
              <TouchableOpacity
                onPress={pickImage}
                className="absolute p-2 -bottom-2 -right-2 bg-violet-500 rounded-full"
              >
                <PencilSquareIcon size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl mt-2">{user.name}</Text>
            <Text className="text-gray-500">{user.email}</Text>
            <Text className="text-black mt-2">
              Dołączono: {moment(user.created_at).fromNow()}
            </Text>
            <Text className="text-black mt-2">
              Data urodzenia:{" "}
              {user.date_of_birth
                ? new Date(user.date_of_birth).toLocaleDateString()
                : "nie podano"}
            </Text>
            <View className="space-y-5  w-full py-3">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ResetPassword");
                }}
                className="flex-row items-center justify-center space-x-1 bg-violet-200 py-4 rounded-xl mx-2 shadow-lg shadow-black"
              >
                <Text className="text-center font-semibold">Resetuj hasło</Text>
                <ArrowPathIcon size={30} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onLogoutClick}
                className="flex-row items-center justify-center space-x-1 bg-violet-200 py-4 rounded-xl mx-2 shadow-lg shadow-black"
              >
                <Text className="text-center font-semibold">Wyloguj</Text>
                <ArrowLeftOnRectangleIcon size={30} color="black" />
              </TouchableOpacity>
              <EditDate dateOfBirth={new Date(user.date_of_birth)} />
            </View>
            <Text className="font-semibold text-lg my-5">Twoja aktywność</Text>
            <View className="space-y-5  w-full pb-5">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("UsersPosts");
                }}
                className="flex-row items-center justify-center space-x-1 bg-violet-200 py-4 rounded-xl mx-2 shadow-lg shadow-black"
              >
                <Text className="text-center font-semibold">
                  Zobacz swoje posty
                </Text>
                <ClipboardDocumentIcon size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("UsersComments");
                }}
                className="flex-row items-center justify-center space-x-1 bg-violet-200 py-4 rounded-xl mx-2 shadow-lg shadow-black"
              >
                <Text className="text-center font-semibold">
                  Zobacz swoje komentarze
                </Text>
                <ChatBubbleBottomCenterTextIcon size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;
