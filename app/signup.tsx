import { Link } from "expo-router";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import text from "@/styles/text";
import link from "@/styles/link";
import layout from "@/styles/layout";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Input from "@/components/Input";

import { useForm, Controller } from "react-hook-form";
import { useSignUp } from "../customHooks/useSignUp";
import { useState } from "react";

interface SignupData {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export default function SignUp() {
  const { signup, isPending } = useSignUp();
  const { register, formState, getValues, handleSubmit, reset, control } =
    useForm<FormData>();
  const { errors } = formState;
  const [check, useCheck] = useState(true);

  function handleCheck() {
    useCheck(!check);
  }

  function onSubmit(data: SignupData) {
    signup(data, {
      onSettled: () => reset(),
    });
    console.log(data);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginTop: 50, marginHorizontal: 25 }}>
        <Text style={text.main_title}>Create Account</Text>
        <Text
          style={[
            text.sub_title,
            { marginBottom: 20, width: 230, marginHorizontal: "auto" },
          ]}
        >
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

        <View style={{ display: "flex", flexDirection: "row", gap: 15 }}>
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
                width={160}
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
                width={160}
              />
            )}
          />
        </View>

        {/* Phone */}
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

        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
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

        {/* Confirm Password */}
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
              styles.checkox,
              layout.flex_row_center,
              {
                backgroundColor: check ? "#704F38" : "#fff",
                borderColor: "#704F38",
              },
            ]}
            onPress={handleCheck}
          >
            {check ? <FontAwesome name="check" size={22} color="#fff" /> : null}
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
            { marginTop: 20, marginBottom: 20 },
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!check}
        >
          <Text style={text.text_btn}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.break_styled}>
          <View style={styles.break}></View>
          <Text style={text.gray_text}>Or sign up with</Text>
          <View style={styles.break}></View>
        </View>

        <View
          style={[layout.flex_row_center, layout.gap_s, layout.margin_top_m]}
        >
          <View style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="apple" size={28} color="#000" />
          </View>
          <View style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="google" size={28} color="#e94335" />
          </View>
          <View style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="facebook" size={28} color="#3266ce" />
          </View>
        </View>

        <View style={[layout.flex_row_center, layout.margin_top_m]}>
          <Text>Already have an account?</Text>
          <Link href="/" style={link.sub_link}>
            Sign in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  input: {
    marginTop: 10,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#bcbcbc",
  },

  break_styled: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  break: {
    width: 80,
    height: 0,
    borderColor: "#bcbcbc",
    borderWidth: 0.5,
  },

  checkox: {
    width: 30,
    height: 30,

    borderRadius: 10,
    borderWidth: 1,
  },
});
