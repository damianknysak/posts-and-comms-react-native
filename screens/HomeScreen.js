import {
  View,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import Post from "../components/Post";
import HomeHeader from "../components/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { isCloseToBottom } from "../utils/scrollViewUtility";
import { PlusCircleIcon } from "react-native-heroicons/outline";
import usePostUtility from "../hooks/usePostUtility";
const HomeScreen = () => {
  const { user, API_URI, token } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState();
  const [postsLoading, setPostsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef();
  // const [refreshPostFromParent, setRefreshPostFromParent] = useState();
  const { getPosts } = usePostUtility();
  const loadPostsToPostsList = () => {
    getPosts(postsList, setPostsList, setPostsLoading, setPaginationLinks);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
    loadPostsToPostsList();
  }, []);

  useEffect(() => {
    loadPostsToPostsList();
  }, []);

  const navigation = useNavigation();
  // on Home press scroll to top
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      onRefresh();
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="flex-1 relative bg-violet-500">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView>
        {user && (
          <>
            <HomeHeader />

            <View className="rounded-t-3xl overflow-hidden">
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ref={scrollViewRef}
                contentContainerStyle={{
                  paddingBottom: 350,
                }}
                className="bg-white min-h-screen rounded-t-3xl"
                onScroll={({ nativeEvent }) => {
                  if (isCloseToBottom(nativeEvent)) {
                    //fetch for next page
                    if (paginationLinks.next && !postsLoading) {
                      getPosts(
                        postsList,
                        setPostsList,
                        setPostsLoading,
                        setPaginationLinks,
                        paginationLinks.next,
                        false
                      );
                    }
                  }
                }}
                scrollEventThrottle={400}
              >
                {postsList &&
                  postsList.map((post) => (
                    <Post
                      // ref={useRef()}
                      // refreshPostFromParent={refreshPostFromParent}
                      // setRefreshPostFromParent={setRefreshPostFromParent}
                      key={post.id}
                      post={post}
                      postId={post.id}
                    />
                  ))}
                {postsLoading && (
                  <View className="items-center justify-center h-20">
                    <ActivityIndicator color="#8B5CF6" size={30} />
                  </View>
                )}
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddPost");
        }}
        className="absolute bottom-3 right-3 bg-violet-500 p-3 rounded-xl flex-row justify-end items-center space-x-1"
      >
        <Text className="text-white font-semibold">Dodaj post</Text>
        <PlusCircleIcon size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
