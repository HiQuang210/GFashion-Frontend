import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/hooks/useUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useToast } from "@/hooks/useToast";
import Input from "@/components/Input";
import CustomButton from "@/components/CustomButton";
import SubPageHeader from "@/components/SubPageHeader";

interface FormData {
  phone: string;
  firstName: string;
  lastName: string;
}

export default function ChangeInfo() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => setUserId(id ?? undefined))
      .catch((err) => console.error("AsyncStorage error:", err));
  }, []);

  const { user, isLoading: isUserLoading } = useUser(userId);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  useEffect(() => {
    if (user?.data) {
      reset({
        phone: user.data.phone || "",
        firstName: user.data.firstName || "",
        lastName: user.data.lastName || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    if (!userId) return;

    updateUser({ id: userId, data } as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", userId] });
        showSuccessToast(
          "Information Updated!",
          "Your profile has been saved."
        );
      },
      onError: (error: any) => {
        showErrorToast("Update Failed", error.message || "An error occurred.");
      },
    });
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
      <SubPageHeader title="Edit Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          inputMode="email"
          secureTextEntry={false}
          value={user?.data?.email || ""}
          onChangeText={() => {}}
          editable={false}
        />

        <View style={styles.nameContainer}>
          {/* Name */}
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="First Name"
                placeholder="Enter first name"
                keyboardType="default"
                inputMode="text"
                secureTextEntry={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.firstName?.message}
                containerStyle={styles.inputFlex}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Last Name"
                placeholder="Enter last name"
                keyboardType="default"
                inputMode="text"
                secureTextEntry={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.lastName?.message}
                containerStyle={styles.inputFlex}
              />
            )}
          />
        </View>

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          rules={{
            required: "Phone is required",
            pattern: {
              value: /^[0-9+\-\s()]{10,}$/,
              message: "Please provide a valid phone number",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Phone Number"
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              inputMode="tel"
              secureTextEntry={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.phone?.message}
            />
          )}
        />

        <CustomButton
          content={isUpdating ? "Saving..." : "Save Changes"}
          onPress={handleSubmit(onSubmit)}
          isPending={isUpdating}
          style={styles.saveButton}
        />
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
  scrollContent: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 16,
  },
  inputFlex: {
    flex: 1,
  },
  saveButton: {
    marginTop: 32,
  },
});