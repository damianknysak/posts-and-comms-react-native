import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  LogBox,
} from "react-native";
import React, { useState } from "react";
import {
  PencilSquareIcon,
  UserPlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { editComment } from "../utils/commentsUtility";
import useAuth from "../hooks/useAuth";
import usePostUtility from "../hooks/usePostUtility";

const EditCommentScreen = () => {
  const navigation = useNavigation();
  const { API_URI, token, user } = useAuth();
  const route = useRoute();
  const { item, setEditedComment } = route.params;
  const { editComment } = usePostUtility();
  const [commentCurrentlyEditing, setCommentCurrentlyEditing] = useState("");

  const handleEdit = () => {
    if (commentCurrentlyEditing) {
      //if edited in DB go back
      if (editComment(item.id, item.postId, user.id, commentCurrentlyEditing)) {
        setEditedComment(commentCurrentlyEditing);
        navigation.goBack();
      }
    }
  };

  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  return (
    <GestureHandlerRootView>
      <View className="h-full w-screen items-center justify-center">
        <View
          style={{ elevation: 300 }}
          className="relative w-5/6 rounded-3xl h-64 mb-20 bg-violet-500 "
        >
          <Text className="font-bold text-center mt-4 text-lg">
            Edytuj komentarz
          </Text>
          <TouchableOpacity
            className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <XMarkIcon size={30} color="black" />
          </TouchableOpacity>
          <View className="m-3">
            <Text className="text-black pt-4 pb-1 font-semibold">
              Zawartość komentarza:
            </Text>
            <TextInput
              multiline={true}
              className="bg-white h-20 w-full mb-2 px-2 rounded border border-gray-500"
              color="black"
              onChangeText={(text) => {
                setCommentCurrentlyEditing(text);
              }}
            >
              <Text>{item.comment}</Text>
            </TextInput>

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate("CustomDialog", {
                  handleDelete: handleEdit,
                  topic: "Edytuj komentarz",
                  description:
                    "Czy jesteś pewien, że chcesz edytować ten komentarz ?",
                });
              }}
              className="flex-row justify-center space-x-3 bg-white rounded items-center"
            >
              <PencilSquareIcon size={20} color="black" />
              <Text className="text-black py-2 font-bold">Edytuj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default EditCommentScreen;
