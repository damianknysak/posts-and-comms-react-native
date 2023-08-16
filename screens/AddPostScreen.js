import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ExclamationCircleIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import ImageUpload from "../components/ImageUpload";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import usePostUtility from "../hooks/usePostUtility";

const AddPostScreen = () => {
  const [image, setImage] = useState();
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();
  const [formError, setFormError] = useState(false);
  const { API_URI, token } = useAuth();
  const navigation = useNavigation();
  const { addPost } = usePostUtility();
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
            className="w-16 h-16"
            source={require("../assets/logo-small.png")}
          />
        </View>
        <View className="flex-1 bg-white rounded-t-3xl ">
          <View className="m-5 space-y-4">
            <View className="flex-row items-start space-x-1">
              <Text className="text-violet-500 text-3xl font-bold mb-2">
                Dodaj post
              </Text>
            </View>
            {formError && (
              <>
                <View className="flex-row items-center">
                  <ExclamationCircleIcon size={25} color="red" />
                  <Text className="text-red-500">
                    {" "}
                    Wypełnij wszystkie pola, by dodać post
                  </Text>
                </View>
              </>
            )}
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="font-bold">Tytuł </Text>
              </View>

              <TextInput
                onChangeText={(text) => {
                  setTitle(text);
                }}
                placeholderTextColor={"#d8bfd8"}
                placeholder="Wpisz swój tytuł ..."
                multiline={true}
                className="w-full px-2 h-14 rounded-xl bg-violet-100 shadow-lg shadow-violet-500"
              ></TextInput>
            </View>
            <View className="space-y-2 mb-3">
              <View className="flex-row items-center">
                <Text className="font-bold">Slug </Text>
              </View>
              <View className="flex-row items-center w-full px-2 h-14 rounded-xl bg-violet-100 shadow-lg shadow-violet-500">
                <TextInput
                  onChangeText={(text) => {
                    setSlug(text);
                  }}
                  className="text-lg flex-1"
                  placeholderTextColor={"#d8bfd8"}
                  placeholder="Wpisz slug ..."
                />
                <TouchableOpacity onPress={() => {}}></TouchableOpacity>
              </View>
            </View>
            <ImageUpload image={image} setImage={setImage} />
            <TouchableOpacity
              onPress={() => {}}
              className="flex-row items-center"
            ></TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (image && title && slug) {
                  addPost(title, slug, image);
                  navigation.navigate("Home");
                } else {
                  setFormError(true);
                }
              }}
              className="flex-row items-center space-x-2 bg-violet-500 h-14 justify-center rounded-xl mb-5 shadow-2xl shadow-violet-500"
            >
              <Text className="text-center text-white text-xl font-bold">
                Dodaj Post
              </Text>
              <PlusCircleIcon size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPostScreen;
