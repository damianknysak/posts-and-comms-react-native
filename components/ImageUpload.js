import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PhotoIcon } from "react-native-heroicons/outline";

export default function ImageUpload({ image, setImage, text }) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="mt-2 ">
      <View className="space-y-2 ">
        <TouchableOpacity
          onPress={pickImage}
          className="border border-violet-500 items-center bg-violet-100  shadow-lg shadow-violet-500 py-1 w-full rounded-xl"
        >
          <Text className="font-bold text-black">
            {text ? text : "Wybierz zdjęcie"}
          </Text>
          <PhotoIcon size={25} color="black" />
        </TouchableOpacity>
      </View>
      {image && (
        <View className="items-center">
          <Image
            source={{ uri: image }}
            className="w-52 h-52 mt-2 rounded-xl"
          />
        </View>
      )}
    </View>
  );
}
