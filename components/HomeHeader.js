import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import { UserCircleIcon } from "react-native-heroicons/outline";

const HomeHeader = () => {
  const { user, HOST_URI } = useAuth();

  return (
    <>
      <View className="mb-3 px-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Image
            className="w-12 h-12 rounded-full"
            source={{ uri: `${HOST_URI}/storage/${user.profile_image}` }}
          />
          <Text className="text-white font-semibold">{user.name}</Text>
        </View>
        <Image
          className="w-14 h-14"
          source={require("../assets/logo-small.png")}
        />
        <View className="flex-1"></View>
      </View>
    </>
  );
};

export default HomeHeader;
