import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "./hooks/useAuth";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeTabsNavigator from "./HomeTabsNavigator";
import CommentsScreen from "./screens/CommentsScreen";
import CustomDialogScreen from "./screens/CustomDialogScreen";
import EditCommentScreen from "./screens/EditCommentScreen";
import AddPostScreen from "./screens/AddPostScreen";
import EditPostScreen from "./screens/EditPostScreen";
import { PostUtilityProvider } from "./hooks/usePostUtility";
import UsersPostsScreen from "./screens/UsersPostsScreen";
import UsersCommentsScreen from "./screens/UsersCommentsScreen";
import WelcomeLoadingScreen from "./screens/WelcomeLoadingScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { user, token, isAuthLoading } = useAuth();

  return (
    <>
      {token ? (
        <PostUtilityProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabsNavigator}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
              }}
            />
            <Stack.Screen
              name="Comments"
              component={CommentsScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
                animationTypeForReplace: "push",
                animation: "slide_from_bottom",
                presentation: "containedTransparentModal",
              }}
            />
            <Stack.Screen
              name="AddPost"
              component={AddPostScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
                animationTypeForReplace: "push",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="EditPost"
              component={EditPostScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
                animationTypeForReplace: "push",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="CustomDialog"
              component={CustomDialogScreen}
              options={{
                presentation: "containedTransparentModal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditComment"
              component={EditCommentScreen}
              options={{
                presentation: "containedTransparentModal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UsersPosts"
              component={UsersPostsScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
                animationTypeForReplace: "push",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="UsersComments"
              component={UsersCommentsScreen}
              options={{
                headerShown: false,
                navigationBarColor: "transparent",
                navigationBarHidden: true,
                animationTypeForReplace: "push",
                animation: "slide_from_bottom",
              }}
            />
          </Stack.Navigator>
        </PostUtilityProvider>
      ) : (
        <>
          {isAuthLoading ? (
            <Stack.Navigator>
              <Stack.Screen
                name="WelcomeLoading"
                component={WelcomeLoadingScreen}
                options={{
                  headerShown: false,
                  navigationBarColor: "transparent",
                  navigationBarHidden: true,
                }}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  headerShown: false,
                  navigationBarColor: "transparent",
                  navigationBarHidden: true,
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                  navigationBarColor: "transparent",
                  navigationBarHidden: true,
                }}
              />
            </Stack.Navigator>
          )}
        </>
      )}
    </>
  );
};

export default StackNavigator;
