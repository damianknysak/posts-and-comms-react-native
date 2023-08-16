import { View, Text, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Progress from "react-native-progress";

const WelcomeLoadingScreen = () => {
  const SCREEN_WIDTH = Dimensions.get("screen").width;
  return (
    <View className="flex-1 justify-center items-center bg-violet-500">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Image
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH,
        }}
        source={require("../assets/logo-white.png")}
      />
      <Progress.Bar
        animated={true}
        indeterminate={true}
        borderColor="white"
        color="white"
        width={200}
      />
      <Text className="text-white font-semibold text-lg mt-6">
        Jeszcze chwila ...{" "}
      </Text>
    </View>
  );
};

export default WelcomeLoadingScreen;
