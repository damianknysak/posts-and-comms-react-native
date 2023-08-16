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
  PencilSquareIcon,
} from "react-native-heroicons/outline";
import ImageUpload from "../components/ImageUpload";
import useAuth from "../hooks/useAuth";
import { useNavigation, useRoute } from "@react-navigation/native";
import usePostUtility from "../hooks/usePostUtility";

const EditPostScreen = () => {
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();
  const [formError, setFormError] = useState(false);
  const { API_URI, token, HOST_URI } = useAuth();
  const route = useRoute();
  const { post } = route.params;
  const { editPost } = usePostUtility();
  const navigation = useNavigation();

  useEffect(() => {
    setTitle(post.title);
    setSlug(post.slug);
    setOldImage(post.image);
  }, []);

  useEffect(() => {
    if (image) {
      setOldImage(null);
    }
  }, [image]);

  useEffect(() => {
    console.log(`oldImage: ${oldImage}`);
  }, [oldImage]);
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
                Edytuj post
              </Text>
            </View>
            {formError && (
              <>
                <View className="flex-row items-center">
                  <ExclamationCircleIcon size={25} color="red" />
                  <Text className="text-red-500">
                    {" "}
                    Wypełnij wszystkie pola, by edytować post
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
                value={title}
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
                  value={slug}
                  className="text-lg flex-1"
                  placeholderTextColor={"#d8bfd8"}
                  placeholder="Wpisz slug ..."
                />
                <TouchableOpacity onPress={() => {}}></TouchableOpacity>
              </View>
            </View>
            <ImageUpload
              text={"Zmień zdjęcie"}
              image={image}
              setImage={setImage}
            />
            {oldImage && (
              <View className="items-center ">
                <Image
                  className="w-52 h-52 rounded-xl"
                  source={{ uri: `${HOST_URI}/storage/${oldImage}` }}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={() => {}}
              className="flex-row items-center"
            ></TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (title && slug) {
                  editPost(post.id, title, slug, image ? image : null);
                  navigation.navigate("Home");
                } else {
                  setFormError(true);
                }
              }}
              className="flex-row items-center space-x-2 bg-violet-500 h-14 justify-center rounded-xl mb-5 shadow-2xl shadow-violet-500"
            >
              <Text className="text-center text-white text-xl font-bold">
                Edytuj Post
              </Text>
              <PencilSquareIcon size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default EditPostScreen;
