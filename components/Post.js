import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/pl";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline";
import usePostUtility from "../hooks/usePostUtility";

const Post = ({
  refreshPost,
  setRefreshPost,
  post,
  postId,
  commentAction,
  setCommentAction,
}) => {
  const [likePressed, setLikePressed] = useState(false);
  const [hahaPressed, setHahaPressed] = useState(false);
  const [cryPressed, setCryPressed] = useState(false);
  const [heartPressed, setHeartPressed] = useState(false);
  const { HOST_URI, user } = useAuth();
  const [postLoading, setPostLoading] = useState(false);
  const [item, setItem] = useState();
  const [deleteThisPost, setDeleteThisPost] = useState(false);
  const [localRefreshPost, setLocalRefreshPost] = useState(false);
  const navigation = useNavigation();
  const {
    addLikeToPost,
    dislikePost,
    checkIfUserLikedPosts,
    getPost,
    deletePost,
  } = usePostUtility();

  useEffect(() => {
    if (localRefreshPost || refreshPost || commentAction) {
      getPost(setItem, setPostLoading, postId);
      likeCheck();
      setLocalRefreshPost(false);
      if (setRefreshPost) {
        setRefreshPost(false);
      }
      if (commentAction) {
        setCommentAction(false);
      }
    }
  }, [localRefreshPost, refreshPost, commentAction]);

  const resetReactionValues = (apartFrom) => {
    apartFrom != "like" && setLikePressed(false);
    apartFrom != "haha" && setHahaPressed(false);
    apartFrom != "cry" && setCryPressed(false);
    apartFrom != "super" && setHeartPressed(false);
  };

  //first check if user liked the post
  const likeCheck = async () => {
    const db_reaction = await checkIfUserLikedPosts(postId);
    resetReactionValues();

    if (db_reaction) {
      db_reaction == "like" && setLikePressed(true);
      db_reaction == "haha" && setHahaPressed(true);
      db_reaction == "cry" && setCryPressed(true);
      db_reaction == "super" && setHeartPressed(true);
    }
  };

  const handleReactionPress = (str) => {
    const button =
      str == "like"
        ? likePressed
        : str == "haha"
        ? hahaPressed
        : str == "cry"
        ? cryPressed
        : heartPressed;
    const setButton =
      str == "like"
        ? setLikePressed
        : str == "haha"
        ? setHahaPressed
        : str == "cry"
        ? setCryPressed
        : setHeartPressed;
    button ? dislikePost(postId) : addLikeToPost(postId, str);
    resetReactionValues(str);
    setButton(!button);
    if (setRefreshPost) {
      setRefreshPost(true);
      setLocalRefreshPost(true);
    } else {
      setLocalRefreshPost(true);
    }
  };

  const handleDelete = () => {
    deletePost(postId);
    setDeleteThisPost(true);
  };

  useEffect(() => {
    //distinguish if its loaded from list or will be loaded
    if (post) {
      setItem(post);
    } else {
      getPost(setItem, setPostLoading, postId);
    }
    likeCheck();
  }, []);

  //wait for whole list refreshes
  useEffect(() => {
    //dont refresh on first load
    item && post && setItem(post);
  }, [post]);

  return (
    <>
      {item && !deleteThisPost && (
        <View className="shadow-2xl shadow-black bg-white mb-8 ">
          {item && item.authorId == user.id && (
            <View className="flex-row justify-around mt-4 pb-2 border-b border-violet-300">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("EditPost", { post: item });
                }}
                className="flex-row items-center space-x-1 bg-violet-100 shadow-lg shadow-black p-2 rounded-xl"
              >
                <Text className="text-gray-500">Edytuj</Text>
                <PencilSquareIcon size={20} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CustomDialog", {
                    handleDelete,
                    topic: "Usuń post",
                    description:
                      "Czy jesteś pewien, że chcesz usunąć ten post ?",
                  });
                }}
                className="flex-row items-center space-x-1 bg-violet-100 p-2 shadow-lg shadow-black rounded-xl"
              >
                <Text className="text-red-800">Usuń</Text>
                <TrashIcon size={20} color="rgb(153,27,27)" />
              </TouchableOpacity>
            </View>
          )}
          <View className="flex-row px-4 pt-2 pb-5 justify-between">
            <Text className="font-semibold">{item.author}</Text>
            <Text>{moment(item.createdAt).fromNow()}</Text>
          </View>
          <Image
            className="w-full h-52"
            source={{
              uri: `${HOST_URI}/storage/${item.image}`,
            }}
          />
          <View className="p-3 space-y-3">
            <Text className="font-semibold">{item.title}</Text>
          </View>
          <View className="p-3 border-t border-gray-200">
            <View className="flex-row">
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="items-center"
                  onPress={() => {
                    handleReactionPress("like");
                  }}
                >
                  <AntDesign
                    name="like2"
                    size={25}
                    color={likePressed ? "#8B5CF6" : "black"}
                  />
                  <Text className="text-violet-500 font-semibold">
                    {item.likes.likeReactionAmount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center"
                  onPress={() => {
                    handleReactionPress("haha");
                  }}
                >
                  <FontAwesome5
                    name="laugh-beam"
                    size={25}
                    color={hahaPressed ? "orange" : "black"}
                  />
                  <Text className="text-orange-400 font-semibold">
                    {item.likes.hahaReactionAmount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center"
                  onPress={() => {
                    handleReactionPress("cry");
                  }}
                >
                  <FontAwesome5
                    name="sad-cry"
                    size={25}
                    color={cryPressed ? "blue" : "black"}
                  />
                  <Text className="text-blue-700 font-semibold">
                    {item.likes.cryReactionAmount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center"
                  onPress={() => {
                    handleReactionPress("super");
                  }}
                >
                  <AntDesign
                    name="hearto"
                    size={25}
                    color={heartPressed ? "red" : "black"}
                  />
                  <Text className="text-red-600 font-semibold">
                    {item.likes.superReactionAmount}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Comments", {
                    post: item,
                    postId: postId,
                    refreshPost: localRefreshPost,
                    setRefreshPost: setLocalRefreshPost,
                  });
                }}
                className="flex-1 flex-row justify-end items-center"
              >
                <Text>
                  Komentarze:{" "}
                  <Text className="font-semibold">{item.commentsAmount}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Post;
