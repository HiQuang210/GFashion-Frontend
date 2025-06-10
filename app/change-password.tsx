import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { UserAPI } from "@/api/services/UserService";
import { useToast } from "@/hooks/useToast";
import Input from "@/components/Input";
import CustomButton from "@/components/CustomButton";
import SubPageHeader from "@/components/SubPageHeader";

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { showSuccessToast, showErrorToast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not found. Please log in again.");

      const apiPayload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      return UserAPI.changePassword(userId, apiPayload);
    },
    onSuccess: () => {
      showSuccessToast(
        "Password Changed!",
        "You can now use your new password."
      );
      router.back();
    },
    onError: (error: any) => {
      showErrorToast(
        "Error",
        error.response?.data?.message || "An error occurred."
      );
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SubPageHeader title="Change Password" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="oldPassword"
          rules={{ required: "Current password is required." }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Current Password"
              placeholder="Enter your current password"
              secureTextEntry
              keyboardType="default"
              inputMode="text"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.oldPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: "New password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="New Password"
              placeholder="Enter your new password"
              secureTextEntry
              keyboardType="default"
              inputMode="text"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.newPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Please confirm your new password.",
            validate: (value) =>
              value === getValues().newPassword ||
              "The passwords do not match.",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm New Password"
              placeholder="Confirm your new password"
              secureTextEntry
              keyboardType="default"
              inputMode="text"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <CustomButton
          content={mutation.isPending ? "Changing..." : "Change Password"}
          onPress={handleSubmit(onSubmit)}
          isPending={mutation.isPending}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { padding: 20 },
  saveButton: { marginTop: 32 },
});