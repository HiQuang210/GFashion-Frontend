import React, { useState } from "react";
import { View, useWindowDimensions, StyleSheet, TouchableOpacity } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Feather from "@expo/vector-icons/Feather";
import { TabNavigationProvider } from "@/contexts/TabNavigation";

import Homepage from "./homepage";
import SearchPage from "./searchpage";
import WishlistPage from "./wishlistpage";
import CartPage from "./cartpage";
import ProfilePage from "./profilepage";

type Route = {
  key: string;
  title: string;
  icon: "home" | "search" | "heart" | "shopping-cart" | "user";
};

const SwipeTabLayout = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes: Route[] = [
    { key: "home", title: "Home", icon: "home" },
    { key: "search", title: "Search", icon: "search" },
    { key: "wishlist", title: "Wishlist", icon: "heart" },
    { key: "cart", title: "Cart", icon: "shopping-cart" },
    { key: "profile", title: "Profile", icon: "user" },
  ];

  const navigateToTab = (tabKey: string) => {
    const tabIndex = routes.findIndex(route => route.key === tabKey);
    if (tabIndex !== -1) {
      setIndex(tabIndex);
    }
  };

  const renderScene = SceneMap({
    home: Homepage,
    search: SearchPage,
    wishlist: WishlistPage,
    cart: CartPage,
    profile: ProfilePage,
  });

  const renderTabBar = () => {
    return (
      <View style={styles.tabBarContainer}>
        {routes.map((route, i: number) => {
          const focused = index === i;
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItemWrapper}
              onPress={() => setIndex(i)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: focused ? "#fff" : "transparent" },
                ]}
              >
                <Feather
                  name={route.icon}
                  size={24}
                  color={focused ? "#704F38" : "#fff"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabNavigationProvider value={{ navigateToTab }}>
      <View style={{ flex: 1 }}>
        <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null}
        swipeEnabled={routes[index].key !== 'cart'} 
      />
        {renderTabBar()}
      </View>
    </TabNavigationProvider>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 25,
    marginHorizontal: 20,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#C4A484", 
    overflow: "hidden",
    left: 0,
    right: 0,
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});

export default SwipeTabLayout;