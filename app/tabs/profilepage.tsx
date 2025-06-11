import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from '@tanstack/react-query';
import { useUser } from "@/hooks/useUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useTabNavigation } from "@/contexts/TabNavigation";
import SectionProfile from "@/components/SectionProfile";
import LogoutSection from "@/components/SectionLogout";
import StatsCard from "@/components/StatsCard";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorite";
import { OrderAPI } from "@/api/services/OrderService";
import { styles } from "@/styles/profile";

const formatCurrency = (value: number = 0) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

export default function ProfilePage() {
  const {
    userInfo,
    isLoading: isAuthLoading,
    refreshUserData,
  } = useAuthContext();
  const [showLogout, setShowLogout] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { navigateToTab } = useTabNavigation();
  const router = useRouter();

  const userId = userInfo?._id;
  const { favorites, isLoading: isFavoritesLoading } = useFavorites();
  const { user, isLoading: isUserLoading, refetch } = useUser(userId);
  const uploadMutation = useUpdateUser();

  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => OrderAPI.getAllOrders(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const ordersCount = ordersResponse?.data?.length || 0;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refreshUserData(), refetchOrders()]);
    setRefreshing(false);
  }, [refetch, refreshUserData, refetchOrders]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      const formData = new FormData();
      formData.append("avatar", {
        uri: picked.uri,
        name: picked.fileName || `avatar_${Date.now()}.jpg`,
        type: picked.mimeType || "image/jpeg",
      } as any);

      uploadMutation.mutate({ id: userId, data: {}, file: formData } as any, {
        onSuccess: async () => {
          await refetch();
          Alert.alert("Success", "Avatar has been updated.");
        },
        onError: (error: any) => {
          Alert.alert("Update Error", error.message || "An error occurred");
        },
      });
    }
  };

  if ((isAuthLoading || isUserLoading) && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#704F38" />
      </View>
    );
  }

  const userData = user?.data || userInfo;

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Could not load user data. Please log in again.
        </Text>
      </SafeAreaView>
    );
  }

  const avatarSource = userData.img
    ? { uri: userData.img }
    : require("@/assets/images/default-avatar.png");

  const navigateToOrders = () => router.push("/orders");
  const navigateToChangeInfo = () => router.push("/edit-profile");
  const navigateToMyReviews = () => router.push("/reviews");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isOrdersLoading}
            onRefresh={onRefresh}
            colors={["#704F38"]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <TouchableOpacity
            onPress={navigateToChangeInfo}
            style={styles.editProfileButton}
          >
            <Feather name="edit" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image source={avatarSource} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.fullName}>
            {userData.lastName} {userData.firstName}
          </Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        <View style={styles.statsGridContainer}>
          <View style={styles.statsRow}>
            <StatsCard
              icon="shopping-bag"
              label="My Orders"
              value={isOrdersLoading ? "..." : ordersCount}
              onPress={navigateToOrders}
            />
            <StatsCard
              icon="heart"
              label="Wishlist"
              value={isFavoritesLoading ? "..." : favorites.length}
              onPress={() => navigateToTab("wishlist")}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              icon="star"
              label="My Reviews"
              value={userData.reviewCount ?? 0}
              onPress={navigateToMyReviews}
            />
            <StatsCard
              icon="credit-card"
              label="Total Spent"
              value={formatCurrency(userData.totalSpent)}
            />
          </View>
        </View>

        <View style={styles.menuContainer}>
          <SectionProfile
            icon="user"
            content="Account Info"
            route="/my-profile"
          />
          <SectionProfile
            icon="settings"
            content="Settings"
            route="/settings"
          />
          <SectionProfile
            icon="help-circle"
            content="Help Center"
            route="/help-center"
          />
          <SectionProfile
            icon="shield"
            content="Privacy Policy"
            route="/privacy-policy"
          />
          <View style={styles.separator} />
          <SectionProfile
            icon={"log-out"}
            content={"Log Out"}
            handlePress={() => setShowLogout(true)}
            route={""}
          />
        </View>
      </ScrollView>

      <LogoutSection visible={showLogout} onClose={() => setShowLogout(false)} />
    </SafeAreaView>
  );
}