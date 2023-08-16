import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import { UserCircleIcon } from "react-native-heroicons/outline";

const HomeHeader = () => {
  const { user } = useAuth();

  return (
    <>
      <View className="mb-3 px-2 flex-row items-center justify-between">
        <View className="flex-1">
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
