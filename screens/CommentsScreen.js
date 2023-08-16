import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  LogBox,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Post from "../components/Post";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/outline";
import Comment from "../components/Comment";
import { ChatBubbleBottomCenterTextIcon } from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth";
import { isCloseToBottom } from "../utils/scrollViewUtility";
// import { getComments } from "../utils/commentsUtility";
import { Keyboard } from "react-native";
import usePostUtility from "../hooks/usePostUtility";

const CommentsScreen = () => {
  const route = useRoute();
  const { post, postId, refreshPost, setRefreshPost } = route.params;

  const [userComment, setUserComment] = useState();
  const [commentsList, setCommentsList] = useState();
  const [paginationLinks, setPaginationLinks] = useState();
  const [commsLoading, setCommsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [refreshPost, setRefreshPost] = useState(false);
  const { addComment, getComments } = usePostUtility();
  const navigation = useNavigation();
  const [commentAction, setCommentAction] = useState();

  const loadCommentsToCommentsList = () => {
    getComments(
      postId,
      commentsList,
      setCommentsList,
      setCommsLoading,
      setPaginationLinks
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

  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  return (
    <View className="h-full bg-violet-500 w-full relative">
      <SafeAreaView>
        <View className="bg-white rounded-3xl ">
          <View className="w-full h-16 items-center justify-center relative bg-violet-200 rounded-t-3xl">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="bg-violet-500 rounded-full absolute left-5 top-3 w-10 h-10 items-center justify-center"
            >
              <ArrowLeftIcon size={25} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-lg">Komentarze</Text>
            </View>
          </View>
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
                  getComments(
                    postId,
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
          >
            <Post
              // post={post}
              postId={postId}
              refreshPost={refreshPost}
              setRefreshPost={setRefreshPost}
              commentAction={commentAction}
              setCommentAction={setCommentAction}
            />

            {commentsList && commentsList.length ? (
              commentsList.map((comment) => (
                <Comment
                  key={comment.id}
                  item={comment}
                  refreshCommentsList={onRefresh}
                  setCommentAction={setCommentAction}
                  setRefreshPost={setRefreshPost}
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

      {/* Write Comment Section */}
      <View className="absolute bottom-0 left-0 right-0 bg-violet-300 h-16 items-center">
        <View className="flex-1 flex-row items-center justify-center w-4/5 px-5 my-2 rounded-xl bg-violet-100 text-lg shadow-lg shadow-violet-500">
          <TextInput
            placeholder="Napisz komentarz..."
            className="w-full"
            multiline={true}
            onChangeText={(text) => setUserComment(text)}
            value={userComment}
          />
          <TouchableOpacity
            onPress={() => {
              if (userComment) {
                addComment(postId, userComment);
                Keyboard.dismiss();
                setUserComment("");
                onRefresh(1000);
                setCommentAction(true);
              }
            }}
            className="h-full justify-center"
          >
            <PaperAirplaneIcon size={25} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CommentsScreen;
