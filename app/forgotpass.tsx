import { View, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { router } from "expo-router";

import Input from "@/components/Input";
import Title from "@/components/Title";
import AccessButton from "@/components/AccessButton";
import BackButton from "@/components/BackButton";
import { AuthAPI } from "@/api/services/auth";
import { RequestPasswordResetData } from "@/types/user";
import { useToast } from "@/hooks/useToast"; 

export default function ForgotPass() {
  const { control, handleSubmit, formState: { errors } } = useForm<RequestPasswordResetData>();
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast(); 

  const onSubmit = async (data: RequestPasswordResetData) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.requestPasswordReset(data);
      
      if (response.status === "OK") {
        showSuccessToast(
          "Reset Code Sent",
          "Please check your email for the verification code"
        );

        router.push({
          pathname: "/resetpassword",
          params: { email: data.email }
        });
      } else {
        showErrorToast(
          "Reset Failed",
          response.message || "Something went wrong"
        );
      }
    } catch (error: any) {
      console.error("Password reset request error:", error);
      showErrorToast(
        "Reset Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <BackButton />
        <Title
          mainTitle="Reset Password"
          subTitle="Enter your email address and we'll send you a verification code to reset your password"
          margin_bot={30}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              keyboardType="email-address"
              inputMode="email"
              secureTextEntry={false}
              onChangeText={onChange}
              value={value || ""}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <AccessButton 
          content={isLoading ? "Sending Code..." : "Send Reset Code"} 
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          style={[
            styles.resetButton,
            isLoading && styles.disabledButton
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    marginTop: 10,
    marginHorizontal: 25,
  },
  resetButton: {
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
});