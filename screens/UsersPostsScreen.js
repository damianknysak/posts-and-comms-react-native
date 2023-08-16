import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Post from "../components/Post";
import HomeHeader from "../components/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import moment from "moment";
import "moment/locale/pl";
import { useNavigation } from "@react-navigation/native";
import usePostUtility from "../hooks/usePostUtility";
const UsersPostsScreen = () => {
  const { user, API_URI, token, onLogoutClick } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState();
  const [postsLoading, setPostsLoading] = useState(false);
  const [reactionsAmount, setReactionsAmount] = useState();
  const { getPosts } = usePostUtility();
  useEffect(() => {
    getPosts(
      postsList,
      setPostsList,
      setPostsLoading,
      setPaginationLinks,
      `${API_URI}/posts?authorId[eq]=${user.id}`
    );
  }, []);
  return (
    <View className="flex-1 bg-violet-500">
      <SafeAreaView className="h-screen w-full">
        <View className="h-16 items-center justify-center">
          <Text className="text-white text-lg font-semibold">Twoje posty</Text>
        </View>
        <View className="rounded-t-3xl overflow-hidden">
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 200,
            }}
            className="bg-white min-h-screen rounded-t-3xl"
          >
            {postsList &&
              postsList.map((post) => (
                <Post key={post.id} post={post} postId={post.id} />
              ))}
            {postsLoading && (
              <View className="items-center justify-center h-20">
                <ActivityIndicator color="#8B5CF6" size={30} />
              </View>
            )}
            {!postsLoading && postsList.length == 0 && (
              <View className="items-center justify-center h-20">
                <Text className="text-black text-lg">Brak postów</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default UsersPostsScreen;
