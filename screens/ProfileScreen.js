import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import HomeHeader from "../components/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import { useNavigation } from "@react-navigation/native";
const ProfileScreen = () => {
  const { user, onLogoutClick } = useAuth();

  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-violet-500">
      <SafeAreaView>
        <HomeHeader />
      </SafeAreaView>
      <View className="rounded-t-3xl overflow-hidden">
        <ScrollView className="bg-white min-h-screen rounded-t-3xl">
          <View className="items-center mt-5">
            <View className="bg-violet-200 w-20 h-20 rounded-full items-center justify-center border-violet-500 border">
              <UserIcon size={50} color="black" />
            </View>
            <Text className="text-xl mt-2">{user.name}</Text>
            <Text className="text-gray-500">{user.email}</Text>
            <Text className="text-black mt-2">
              Dołączono: {moment(user.created_at).fromNow()}
            </Text>
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
              <TouchableOpacity
                onPress={onLogoutClick}
                className="flex-row items-center justify-center space-x-1 bg-violet-200 py-4 rounded-xl mx-2 shadow-lg shadow-black"
              >
                <Text className="text-center font-semibold">Wyloguj</Text>
                <ArrowLeftOnRectangleIcon size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;
