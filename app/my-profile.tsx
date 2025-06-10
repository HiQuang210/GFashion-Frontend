import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/hooks/useUser";
import Input from "@/components/Input";
import SubPageHeader from "@/components/SubPageHeader";
import BackButton from "@/components/BackButton";
import { Feather } from "@expo/vector-icons";

export default function MyProfile() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => setUserId(id ?? undefined))
      .catch((err) => console.error("AsyncStorage error:", err));
  }, []);

  const { user, isLoading: isUserLoading } = useUser(userId);

  const formatMemberSinceDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  if (isUserLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#704F38" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Feather name="edit" size={24} color="#704F38" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email:</Text>
          <Text style={styles.fieldValue}>{user?.data?.email || "N/A"}</Text>
        </View>

        {/* First Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>First Name:</Text>
          <Text style={styles.fieldValue}>{user?.data?.firstName || "N/A"}</Text>
        </View>

        {/* Last Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Last Name:</Text>
          <Text style={styles.fieldValue}>{user?.data?.lastName || "N/A"}</Text>
        </View>

        {/* Phone */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone Number:</Text>
          <Text style={styles.fieldValue}>{user?.data?.phone || "N/A"}</Text>
        </View>

        {/* Member Since */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Member Since:</Text>
          <Text style={styles.fieldValue}>
            {user?.data?.createdAt ? formatMemberSinceDate(user.data.createdAt) : "N/A"}
          </Text>
        </View>

        {/* Account Status */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Account Status:</Text>
          <Text style={[
            styles.fieldValue, 
            user?.data?.isActive && styles.activeStatus
          ]}>
            {user?.data?.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  activeStatus: {
    color: "#22c55e",
    fontWeight: "600",
  },
});