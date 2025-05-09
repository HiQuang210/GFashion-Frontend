import { Tabs } from "expo-router";

import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

function TabIcon({ name, focused }: { name: "home" | "shopping-cart" | "heart" | "message-circle" | "user"; focused: boolean }) {
  return (
    <View
      style={{
        backgroundColor: focused ? "#fff" : "transparent",
        marginTop: 25,
        borderRadius: 99,
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
      }}
    >
      <Feather name={name} size={24} color={focused ? "#6C4B3C" : "#797979"} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          marginHorizontal: 20,
          height: 70,
          borderRadius: 30,
          backgroundColor: "#1F2029",
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cartpage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shopping-cart" focused={focused} />
          ),
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="wishlistpage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="heart" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messagepage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="message-circle" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profilepage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="user" focused={focused} />
          ),
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}