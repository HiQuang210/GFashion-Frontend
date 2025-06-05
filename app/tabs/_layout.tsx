import { Tabs } from "expo-router";
import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

function TabIcon({ name, focused }: { name: "home" | "search" | "heart" | "shopping-cart" | "user"; focused: boolean }) {
  return (
    <View
      style={{
        backgroundColor: focused ? "#fff" : "transparent",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        marginTop: 20
      }}
    >
      <Feather name={name} size={24} color={focused ? "#704F38" : "#797979"} />
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
          height: 60,
          borderRadius: 25,
          backgroundColor: "#1F2029",
          overflow: "hidden",
          borderTopWidth: 0, 
        }
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="searchpage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="wishlistpage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="heart" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="cartpage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shopping-cart" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="profilepage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="user" focused={focused} />
          )
        }}
      />
    </Tabs>
  );
}