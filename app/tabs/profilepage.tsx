import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
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
import { useUser } from "@/hooks/useUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useTabNavigation } from "@/contexts/TabNavigation";
import SectionProfile from "@/components/SectionProfile";
import LogoutSection from "@/components/SectionLogout";
import StatsCard from "@/components/StatsCard";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorite";

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refreshUserData()]);
    setRefreshing(false);
  }, [refetch, refreshUserData]);

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
        type: "image/jpeg",
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
  const navigateToChangeInfo = () => router.push("/changeInfo");
  const navigateToMyReviews = () => router.push("/myreviews");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
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
              value={userData.orderCount ?? 0}
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
              icon="money"
              label="Total Spent"
              value={formatCurrency(userData.totalSpent).replace("₫", "")}
            />
          </View>
        </View>

        <View style={styles.menuContainer}>
          <SectionProfile
            icon="user"
            content="Account Info"
            route="/changeInfo"
          />
          <SectionProfile icon="gear" content="Settings" route="/settings" />
          <SectionProfile
            icon="map-marker"
            content="Shipping Addresses"
            route=""
          />
          <SectionProfile
            icon="exclamation-circle"
            content="Help Center"
            route=""
          />
          <SectionProfile icon="lock" content="Privacy Policy" route="" />
          <View style={styles.separator} />
          <SectionProfile
            icon={"sign-out"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1ED",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F1ED",
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    color: "#704F38",
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
  },
  editProfileButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: "#F4F1ED",
    borderRadius: 20,
  },
  avatarContainer: {
    borderWidth: 4,
    borderColor: "#704F38",
    borderRadius: 74,
    padding: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  fullName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2029",
  },
  email: {
    marginTop: 4,
    fontSize: 16,
    color: "#797979",
  },
  statsGridContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
  },
  statsCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  menuContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 8,
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#F4F1ED",
    marginVertical: 8,
    marginHorizontal: 20,
  },
});