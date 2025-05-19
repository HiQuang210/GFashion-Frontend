import { View, SafeAreaView, Text } from "react-native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { router, useLocalSearchParams } from "expo-router";

import Input from "@/components/Input";
import Title from "@/components/Title";
import AccessButton from "@/components/AccessButton";
import BackButton from "@/components/BackButton";
import { AuthAPI } from "@/api/services/auth";
import { styles } from "@/styles/resetpass";
import { useToast } from "@/hooks/useToast"; 
interface FormData {
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export default function VerifyResetCode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast(); 
  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    getValues 
  } = useForm<FormData>({
    defaultValues: {
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const validatePasswords = (confirmPassword: string): string | true => {
    const newPassword = getValues().newPassword;
    return confirmPassword === newPassword || "Passwords do not match";
  };

  const prepareVerifyData = (resetCode: string) => ({
    email: email?.trim() || "",
    code: resetCode?.trim(),
  });

  const prepareResetData = (resetCode: string, newPassword: string) => ({
    email: email?.trim() || "",
    code: resetCode?.trim(),
    newPassword: newPassword?.trim(),
  });

  const validateRequiredData = (email: string, code: string): boolean => {
    if (!email || !code) {
      showErrorToast(
        "Missing Information",
        "Email and verification code are required"
      );
      return false;
    }
    return true;
  };

  const handleVerifyCode = async (verifyData: any) => {
    console.log("Sending verify request with:", verifyData);
    
    const verifyResponse = await AuthAPI.verifyResetCode(verifyData);

    if (verifyResponse.status !== "OK") {
      showErrorToast(
        "Invalid Code",
        verifyResponse.message || "The verification code is invalid or expired"
      );
      return false;
    }
    
    return true;
  };

  const handlePasswordReset = async (resetData: any) => {
    console.log("Sending reset password request");
    
    const resetResponse = await AuthAPI.resetPassword(resetData);
    
    if (resetResponse.status === "OK") {
      showSuccessToast(
        "Password Reset Successfully",
        "Please login with your new password"
      );
      
      router.replace("/login");
      return true;
    } else {
      showErrorToast(
        "Reset Failed",
        resetResponse.message || "Something went wrong"
      );
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    console.log("Form data being submitted:", {
      email: email,
      resetCode: data.resetCode,
      newPassword: data.newPassword ? "***" : "empty"
    });

    try {
      const verifyData = prepareVerifyData(data.resetCode);
      
      if (!validateRequiredData(verifyData.email, verifyData.code)) {
        return;
      }

      // First verify the reset code
      const isVerified = await handleVerifyCode(verifyData);
      if (!isVerified) return;

      // If verification successful, reset the password
      const resetData = prepareResetData(data.resetCode, data.newPassword);
      await handlePasswordReset(resetData);

    } catch (error: any) {
      console.error("Password reset error:", error);
      
      if (error.response?.data) {
        console.error("API Error Response:", error.response.data);
      }
      
      showErrorToast(
        "Reset Failed",
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <>
      <BackButton />
      <Title
        mainTitle="Enter Reset Code"
        subTitle="Enter the 6-digit verification code sent to your email and create a new password"
        margin_bot={30}
      />
      <Text style={styles.emailText}>
        Reset code sent to: {email}
      </Text>
    </>
  );

  const renderVerificationCodeInput = () => (
    <Controller
      control={control}
      name="resetCode"
      rules={{
        required: "Verification code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "Please enter a valid 6-digit code",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Verification Code"
          placeholder="Enter 6-digit code"
          keyboardType="numeric"
          inputMode="numeric"
          secureTextEntry={false}
          onChangeText={onChange}
          value={value || ""}
          onBlur={onBlur}
          error={errors.resetCode?.message}
        />
      )}
    />
  );

  const renderPasswordInputs = () => (
    <>
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: "New password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="New Password"
            placeholder="*****************"
            keyboardType="default"
            inputMode="text"
            secureTextEntry={true}
            onChangeText={onChange}
            value={value || ""}
            onBlur={onBlur}
            error={errors.newPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirm password is required",
          validate: validatePasswords,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirm New Password"
            placeholder="*****************"
            keyboardType="default"
            inputMode="text"
            secureTextEntry={true}
            onChangeText={onChange}
            value={value || ""}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
          />
        )}
      />
    </>
  );

  const renderSubmitButton = () => (
    <AccessButton 
      content={isLoading ? "Resetting Password..." : "Reset Password"}
      onPress={handleSubmit(onSubmit)}
      disabled={isLoading}
      style={[
        styles.resetButton,
        isLoading && styles.disabledButton
      ]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {renderHeader()}
        {renderVerificationCodeInput()}
        {renderPasswordInputs()}
        {renderSubmitButton()}
      </View>
    </SafeAreaView>
  );
}