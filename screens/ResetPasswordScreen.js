import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import {
  ExclamationCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const { resetPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorInfo, setErrorInfo] = useState("");

  const handleReset = async () => {
    const reset = await resetPassword(
      currentPassword,
      newPassword,
      passwordConfirmation
    );

    if (reset) navigation.goBack();
    setErrorInfo("Błędne hasło");
  };
  return (
    <View className="h-full w-screen items-center justify-center">
      <View
        style={{ elevation: 300 }}
        className="relative w-5/6 rounded-3xl mb-52 pb-3 bg-violet-500 "
      >
        <Text className="font-bold text-center mt-4 text-lg">Zmień hasło</Text>
        <TouchableOpacity
          className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <XMarkIcon size={30} color="black" />
        </TouchableOpacity>
        {errorInfo && (
          <View className="flex-row ml-2 space-x-2 items-center">
            <ExclamationCircleIcon size={30} color="red" />
            <Text className="text-red-700">{errorInfo}</Text>
          </View>
        )}

        <View className="m-3 space-y-1">
          <Text className="text-black font-semibold">Stare hasło:</Text>
          <TextInput
            secureTextEntry={true}
            className="bg-white w-full px-2 py-1 rounded border border-gray-500"
            color="black"
            onChangeText={(text) => {
              setCurrentPassword(text);
            }}
          />
          <Text className="text-black font-semibold">Nowe hasło:</Text>
          <TextInput
            secureTextEntry={true}
            className="bg-white w-full px-2 py-1 rounded border border-gray-500"
            color="black"
            onChangeText={(text) => {
              setNewPassword(text);
            }}
          />
          <Text className="text-black font-semibold">
            Potwierdź nowe hasło:
          </Text>
          <TextInput
            secureTextEntry={true}
            className="bg-white w-full  px-2 py-1 rounded border border-gray-500"
            color="black"
            onChangeText={(text) => {
              setPasswordConfirmation(text);
            }}
          />
          <View className="my-2"></View>
          <TouchableOpacity
            onPress={() => {
              if (
                !(
                  currentPassword &&
                  newPassword &&
                  passwordConfirmation &&
                  newPassword == passwordConfirmation &&
                  newPassword.length >= 8 &&
                  newPassword.length >= 8
                )
              ) {
                setErrorInfo("Podane dane są błędne");
                return;
              }
              Keyboard.dismiss();
              navigation.navigate("CustomDialog", {
                handleDelete: handleReset,
                topic: "Resetuj hasło",
                description:
                  "Czy jesteś pewien, że chcesz zresetować swoje hasło ?",
              });
            }}
            className="flex-row py-1 justify-center space-x-3 bg-white rounded items-center"
          >
            <PencilSquareIcon size={20} color="black" />
            <Text className="text-black py-2 font-bold">Zmień hasło</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
