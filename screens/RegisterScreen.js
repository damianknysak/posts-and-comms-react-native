import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { ExclamationCircleIcon } from "react-native-heroicons/outline";

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState();
  const [name, setName] = useState("");

  //validation
  const [loginError, setLoginError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [nameError, setNameError] = useState();

  const { onRegisterClick } = useAuth();

  const navigation = useNavigation();
  return (
    <ScrollView
      // scrollEnabled={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-violet-500"
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-center items-center">
          <Image
            className="w-36 h-36"
            source={require("../assets/logo-white.png")}
          />
        </View>
        <View className="flex-1 bg-white rounded-t-3xl ">
          <View className="m-5 space-y-4">
            <Text className="text-violet-500 text-3xl font-bold mb-2">
              Zarejestruj się
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                {loginError && (
                  <>
                    <ExclamationCircleIcon size={25} color="red" />
                    <Text className="text-red-500">
                      {" "}
                      Błędne dane rejestracji
                    </Text>
                  </>
                )}
              </View>
              <View className="flex-row items-center">
                <Text className="font-bold">Imię i nazwisko </Text>
                {nameError && (
                  <>
                    <View className="flex-row items-center space-x-1">
                      <ExclamationCircleIcon size={25} color="red" />
                      <Text className="text-red-500">{nameError}</Text>
                    </View>
                  </>
                )}
              </View>
              <TextInput
                onChangeText={(value) => setName(value)}
                placeholderTextColor={"#d8bfd8"}
                placeholder="Wpisz swoje imię i nazwisko ..."
                className="w-full px-2 h-14 rounded-xl bg-violet-100 text-lg shadow-lg shadow-violet-500"
              ></TextInput>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="font-bold">Email </Text>
                {emailError && (
                  <>
                    <View className="flex-row items-center space-x-1">
                      <ExclamationCircleIcon size={25} color="red" />
                      <Text className="text-red-500">{emailError}</Text>
                    </View>
                  </>
                )}
              </View>
              <TextInput
                onChangeText={(value) => setEmail(value)}
                placeholderTextColor={"#d8bfd8"}
                placeholder="Wpisz swój email ..."
                className="w-full px-2 h-14 rounded-xl bg-violet-100 text-lg shadow-lg shadow-violet-500"
              ></TextInput>
            </View>
            <View className="space-y-2 mb-3">
              <View className="flex-row items-center">
                <Text className="font-bold">Hasło </Text>
                {passwordError && (
                  <>
                    <View className="flex-row items-center space-x-1">
                      <ExclamationCircleIcon size={25} color="red" />
                      <Text className="text-red-500">{passwordError}</Text>
                    </View>
                  </>
                )}
              </View>
              <View className="flex-row items-center w-full px-2 h-14 rounded-xl bg-violet-100 shadow-lg shadow-violet-500">
                <TextInput
                  onChangeText={(value) => setPassword(value)}
                  className="text-lg flex-1"
                  secureTextEntry={passwordVisible}
                  placeholderTextColor={"#d8bfd8"}
                  placeholder="Wpisz swoje hasło ..."
                />
                <TouchableOpacity
                  onPress={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                >
                  {passwordVisible ? (
                    <EyeIcon size={20} color="gray" />
                  ) : (
                    <EyeSlashIcon size={20} color="gray" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="space-y-2 mb-3">
              <Text className="font-bold">Potwierdź Hasło</Text>
              <View className="flex-row items-center w-full px-2 h-14 rounded-xl bg-violet-100 shadow-lg shadow-violet-500">
                <TextInput
                  onChangeText={(value) => setConfirmationPassword(value)}
                  className="text-lg flex-1"
                  secureTextEntry={passwordVisible}
                  placeholderTextColor={"#d8bfd8"}
                  placeholder="Wpisz swoje hasło ..."
                />
                <TouchableOpacity
                  onPress={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                >
                  {passwordVisible ? (
                    <EyeIcon size={20} color="gray" />
                  ) : (
                    <EyeSlashIcon size={20} color="gray" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setPasswordError(null);
                setEmailError(null);
                setLoginError(null);
                setNameError(null);

                name || setNameError("Nie podałeś danych");
                email || setEmailError("Nie podałeś maila");
                password || setPasswordError("Nie podałeś hasła");

                const doPasswordsMatch =
                  password && password == confirmationPassword ? true : false;

                doPasswordsMatch || setPasswordError("Hasła nie są takie same");

                name &&
                  email &&
                  password &&
                  doPasswordsMatch &&
                  onRegisterClick(name, email, password, confirmationPassword)
                    .then((res) => {
                      if (res != "success") {
                        setLoginError("Błędne dane rejestracji");
                      }
                      console.log(res);
                    })
                    .catch((e) => {
                      setLoginError(e);
                    });
              }}
              className="bg-violet-500 h-14 justify-center rounded-xl mb-5 shadow-2xl shadow-violet-500"
            >
              <Text className="text-center text-white text-xl font-bold">
                Stwórz konto
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-center">
              <Text>Masz już konto? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text className="text-violet-500 font-bold">Zaloguj się</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default RegisterScreen;
