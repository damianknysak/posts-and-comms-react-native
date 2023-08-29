import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/pl";
import useAuth from "../hooks/useAuth";
import { PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import usePostUtility from "../hooks/usePostUtility";

const Comment = ({ item, withPostLinks, setCommentAction, setRefreshPost }) => {
  const { user, HOST_URI } = useAuth();
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const navigation = useNavigation();
  const [editedComment, setEditedComment] = useState("");
  const { deleteComment } = usePostUtility();
  const handleDelete = () => {
    if (deleteComment(item.id)) {
      if (setCommentAction && setRefreshPost) {
        setCommentAction(true);
        setRefreshPost(true);
      }

      setIsCommentDeleted(true);
    }
  };

  useEffect(() => {
    if (editedComment) {
      item.comment = editedComment;
      setEditedComment("");
    }
  }, [editedComment]);
  return (
    <>
      {isCommentDeleted || (
        <View className={withPostLinks && "border-b border-violet-500"}>
          {withPostLinks && (
            <View className=" border-violet-500">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Comments", {
                    postId: item.postId,
                  });
                }}
                className="items-center justify-center mt-2 bg-violet-500 mx-10 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">
                  Przejdź do Posta nr {item.postId}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View className="shadow-sm bg-white shadow-black mx-4 my-1 rounded-xl">
            <View className="bg-violet-200 space-y-2 p-2 rounded-xl">
              <View className="flex-row justify-between">
                <View className="flex-row items-center space-x-1">
                  <Image
                    className="w-8 h-8 rounded-full"
                    source={{
                      uri: `${HOST_URI}/storage/${item.author.profile_image}`,
                    }}
                  />
                  <Text className="font-semibold">{item.author.name}</Text>
                </View>

                <Text>{moment(item.createdAt).fromNow()}</Text>
              </View>
              <View>
                <Text>{item.comment}</Text>
              </View>
            </View>
            {user.id == item.author.id && (
              <View className="flex-row justify-around py-1 ">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditComment", {
                      item,
                      setEditedComment,
                    });
                  }}
                  className="flex-row items-center space-x-1"
                >
                  <Text className="text-gray-500">Edytuj</Text>
                  <PencilSquareIcon size={20} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CustomDialog", {
                      handleDelete,
                      topic: "Usuń komentarz",
                      description:
                        "Czy jesteś pewien, że chcesz usunąć ten komentarz ?",
                    });
                  }}
                  className="flex-row items-center space-x-1"
                >
                  <Text className="text-red-800">Usuń</Text>
                  <TrashIcon size={20} color="rgb(153,27,27)" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default Comment;
