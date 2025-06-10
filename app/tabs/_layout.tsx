import React, { useState, useEffect, useCallback } from "react";
import { View, useWindowDimensions, StyleSheet, TouchableOpacity, Text } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Feather from "@expo/vector-icons/Feather";
import { TabNavigationProvider } from "@/contexts/TabNavigation";
import { UserAPI } from "@/api/services/UserService";
import { CartUtils } from "@/utils/cartHelper";
import { CartItemData } from "@/types/user";
import styles from "@/styles/layout";
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
  const [cartItemCount, setCartItemCount] = useState(0);

  const routes: Route[] = [
    { key: "home", title: "Home", icon: "home" },
    { key: "search", title: "Search", icon: "search" },
    { key: "wishlist", title: "Wishlist", icon: "heart" },
    { key: "cart", title: "Cart", icon: "shopping-cart" },
    { key: "profile", title: "Profile", icon: "user" },
  ];

  const fetchCartItemCount = useCallback(async () => {
    try {
      const response = await UserAPI.getUserCart();
      if (response.status === "OK" && response.data) {
        const cartItems = response.data as CartItemData[];
        const totalItems = CartUtils.calculateTotalItems(cartItems);
        setCartItemCount(totalItems);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartItemCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartItemCount();
  }, [fetchCartItemCount]);

  useEffect(() => {
    if (routes[index].key === 'cart') {
      fetchCartItemCount();
    }
  }, [index, fetchCartItemCount]);

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
          const isCartTab = route.key === 'cart';
          const showBadge = isCartTab && cartItemCount > 0;
          
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
                {showBadge && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {cartItemCount > 99 ? '99+' : cartItemCount.toString()}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabNavigationProvider value={{ navigateToTab, refreshCartCount: fetchCartItemCount }}>
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

export default SwipeTabLayout;