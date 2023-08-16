import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import BouncyCheckbox from "react-native-bouncy-checkbox";
const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLoginClick } = useAuth();
  const [rememberUser, setRememberUser] = useState(false);

  const [loginError, setLoginError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();

  const navigation = useNavigation();
  return (
    <ScrollView
      scrollEnabled={false}
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
              Zaloguj się
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                {loginError && (
                  <>
                    <ExclamationCircleIcon size={25} color="red" />
                    <Text className="text-red-500"> Błędne dane logowania</Text>
                  </>
                )}
              </View>
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
            <TouchableOpacity
              onPress={() => {
                setRememberUser(!rememberUser);
              }}
              className="flex-row items-center"
            >
              <BouncyCheckbox
                disableBuiltInState
                isChecked={rememberUser}
                size={25}
                fillColor="#865BE5"
                unfillColor="#FFFFFF"
                onPress={() => {
                  setRememberUser(!rememberUser);
                }}
              />
              <Text className="font-semibold">Zapamiętaj mnie</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPasswordError(null);
                setEmailError(null);
                setLoginError(null);

                email || setEmailError("Nie podałeś maila");
                password || setPasswordError("Nie podałeś hasła");

                email &&
                  password &&
                  onLoginClick(email, password, rememberUser)
                    .then((res) => {
                      if (res != "success") {
                        setLoginError("Błędne dane logowania");
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
                Zaloguj się
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-center">
              <Text>Nie masz jeszcze konta? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text className="text-violet-500 font-bold">
                  Zarejestruj się
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginScreen;
