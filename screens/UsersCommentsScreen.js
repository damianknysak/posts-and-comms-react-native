import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import usePostUtility from "../hooks/usePostUtility";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { ChatBubbleBottomCenterTextIcon } from "react-native-heroicons/outline";
import Comment from "../components/Comment";
import { isCloseToBottom } from "../utils/scrollViewUtility";

const UsersCommentsScreen = () => {
  const [userComment, setUserComment] = useState();
  const [commentsList, setCommentsList] = useState();
  const [paginationLinks, setPaginationLinks] = useState();
  const [commsLoading, setCommsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshPost, setRefreshPost] = useState(false);
  const { getComments } = usePostUtility();
  const navigation = useNavigation();
  const { API_URI, user } = useAuth();

  const loadCommentsToCommentsList = () => {
    getComments(
      0,
      commentsList,
      setCommentsList,
      setCommsLoading,
      setPaginationLinks,
      `${API_URI}/comments?authorId[eq]=${user.id}`
    );
  };

  const onRefresh = useCallback((delay = 0) => {
    setRefreshing(true);
    setRefreshPost(true);
    setTimeout(() => {}, delay);
    loadCommentsToCommentsList();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadCommentsToCommentsList();
  }, []);

  return (
    <View className="flex-1 bg-violet-500">
      <SafeAreaView className="h-screen w-full">
        <View className="h-16 items-center justify-center">
          <Text className="text-white text-lg font-semibold">
            Twoje komentarze
          </Text>
        </View>
        <View className="rounded-t-3xl overflow-hidden">
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              paddingBottom: commentsList ? 400 : 100,
            }}
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                //fetch for next page
                if (paginationLinks.next && !commsLoading) {
                  console.log(paginationLinks.next);
                  getComments(
                    0,
                    commentsList,
                    setCommentsList,
                    setCommsLoading,
                    setPaginationLinks,
                    paginationLinks.next,
                    false
                  );
                }
              }
            }}
            scrollEventThrottle={400}
            className="bg-white min-h-screen rounded-t-3xl"
          >
            {commentsList && commentsList.length ? (
              commentsList.map((comment) => (
                <Comment
                  key={comment.id}
                  item={comment}
                  refreshCommentsList={onRefresh}
                  withPostLinks={true}
                />
              ))
            ) : (
              <View className="flex-1 items-center justify-center space-y-2">
                <Text>Brak komentarzy do wyświetlenia</Text>
                <ChatBubbleBottomCenterTextIcon size={25} color="black" />
              </View>
            )}
            {commsLoading && (
              <View className="w-full h-10 items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size={30} />
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default UsersCommentsScreen;
