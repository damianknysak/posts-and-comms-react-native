import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { HomeIcon, UserIcon } from "react-native-heroicons/outline";

const HomeTabsNavigator = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          if (route.name === "Home") {
            return <HomeIcon color={color} size={25} />;
          } else if (route.name === "Profile") {
            return <UserIcon color={color} size={25} />;
          }
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#865BE5",
        tabBarInactiveTintColor: "white",
        tabBarIndicatorStyle: { backgroundColor: "#865BE5" },
        tabBarStyle: { backgroundColor: "black" },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabsNavigator;
