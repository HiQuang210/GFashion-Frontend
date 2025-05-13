import { Link, router } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import text from "@/styles/text";
import link from "@/styles/link";
import layout from "@/styles/layout";
import { signupStyles as styles } from "@/styles/signup";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Input from "@/components/Input";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { SignUpData } from "@/types/user";
import { AuthAPI } from "@/api/services/auth";
import Toast from "react-native-toast-message";

interface FormData extends SignUpData {
  confirmPassword: string;
}

export default function SignUp() {
  const { control, handleSubmit, formState: { errors }, getValues, reset } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!agreeToTerms) {
      Toast.show({
        type: "error",
        text1: "Agreement Required",
        text2: "Please agree to Terms & Conditions to continue",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = data;
      
      await AuthAPI.requestEmailVerification(signupData);
      
      Toast.show({
        type: "success",
        text1: "Registration Initiated",
        text2: "Please check your email for verification",
      });

      router.push("/emailverify");
      reset();
    } catch (error: any) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={text.main_title}>Create Account</Text>
        <Text style={[text.sub_title, styles.title]}>
          Fill your information below or register with your social account
        </Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="example@gmail.com"
              keyboardType="email-address"
              inputMode="email"
              secureTextEntry={false}
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <View style={styles.nameContainer}>
          <View style={styles.nameInput}>
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
                />
              )}
            />
          </View>

          <View style={styles.nameInput}>
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
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="phone"
          rules={{ required: "Phone is required" }}
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

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="*****************"
              keyboardType="default"
              inputMode="text"
              secureTextEntry={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirm Password is required",
            validate: (value) =>
              value === getValues().password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password"
              placeholder="*****************"
              keyboardType="default"
              inputMode="text"
              secureTextEntry={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <View style={[layout.flex_row, layout.gap_xs]}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              layout.flex_row_center,
              {
                backgroundColor: agreeToTerms ? "#704F38" : "#fff",
                borderColor: "#704F38",
              },
            ]}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            {agreeToTerms ? (
              <FontAwesome name="check" size={22} color="#fff" />
            ) : null}
          </TouchableOpacity>
          <Text>Agree with</Text>
          <Link href="/" style={[link.sub_link]}>
            Terms & Conditions
          </Link>
        </View>

        <TouchableOpacity
          style={[
            link.btn_link,
            link.btn_link_base,
            styles.signUpButton,
            (!agreeToTerms || isLoading) && { opacity: 0.6 },
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!agreeToTerms || isLoading}
        >
          <Text style={text.text_btn}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.breakStyled}>
          <View style={styles.break}></View>
          <Text style={text.gray_text}>Or sign up with</Text>
          <View style={styles.break}></View>
        </View>

        <View style={[layout.flex_row_center, layout.gap_s, layout.margin_top_m]}>
          <TouchableOpacity style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="apple" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="google" size={28} color="#e94335" />
          </TouchableOpacity>
          <TouchableOpacity style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="facebook" size={28} color="#3266ce" />
          </TouchableOpacity>
        </View>

        <View style={[layout.flex_row_center, layout.margin_top_m]}>
          <Text>Already have an account? </Text>
          <Link href="/login" style={link.sub_link}>
            Sign in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}