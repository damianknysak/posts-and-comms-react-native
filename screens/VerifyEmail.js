import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as Progress from "react-native-progress";
import {
  EnvelopeIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/native";

const VerifyEmail = () => {
  const SCREEN_WIDTH = Dimensions.get("screen").width;
  const { EmailVerificationStatus } = useAuth();
  const route = useRoute();
  const { user, token } = route.params;
  const { setSessionData } = useAuth();
  const [warning, setWarning] = useState();

  const handlePress = async () => {
    if (await EmailVerificationStatus(user.id)) {
      setSessionData(user, token);
    } else {
      // konto jeszcze nieaktywowane
      setWarning("Konto nieaktywowane, spróbuj ponownie");
    }
  };

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
      <View className="flex-row items-center space-x-2 mt-6 ">
        <Text className="text-white font-semibold text-lg">
          Potwierdź swój e-mail
        </Text>

        <EnvelopeIcon color={"white"} size={25} />
      </View>
      {warning && (
        <View className="flex-row items-center space-x-2 ">
          <Text className="text-red-700 font-semibold">{warning}</Text>

          <ExclamationCircleIcon color={"red"} size={25} />
        </View>
      )}

      <TouchableOpacity
        onPress={handlePress}
        className="p-3 my-3 shadow-lg border-white border shadow-white bg-violet-500 rounded-xl"
      >
        <Text className="font-semibold text-xl text-white">
          Dokonałem weryfikacji maila
        </Text>
      </TouchableOpacity>

      <Text className="text-white text-center font-semibold text-sm mt-6">
        Wysłaliśmy na twój adres wiadomość która pozwoli ci dokonać weryfikacji
        konta. Jeśli potwierdziłeś kliknij "Dokonałem weryfikacji maila".
      </Text>
    </View>
  );
};

export default VerifyEmail;
