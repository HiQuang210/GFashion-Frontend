import { Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import text from "@/styles/text";
import link from "@/styles/link";
import layout from "@/styles/layout";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Title from "@/components/Title";
import Input from "@/components/Input";
import { Controller, useForm } from "react-hook-form";

import { useLogIn } from "../customHooks/useLogin";

interface LogInData {
  email: string;
  password: string;
}

export default function Login() {
  const { login, isPending } = useLogIn();
  const { control, handleSubmit, formState: { errors } } = useForm<LogInData>();

  const onSubmit = async (data: LogInData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled in the hook
      console.log("Login attempt failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Title
          mainTitle="Sign In"
          subTitle="Hi! Welcome back to GFashion!"
          margin_bot={30}
        />

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

        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              keyboardType="default"
              inputMode="text"
              secureTextEntry={true}
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Link
          href="/forgotpass"
          style={[link.sub_link, styles.forgotLink]}
        >
          Forgot Password?
        </Link>

        <TouchableOpacity
          style={[
            link.btn_link,
            link.btn_link_base,
            styles.signInButton,
            isPending && styles.disabledButton
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          <Text style={text.text_btn}>
            {isPending ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line}></View>
          <Text style={text.gray_text}>Or sign in with</Text>
          <View style={styles.line}></View>
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={28} color="#e94335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={28} color="#3266ce" />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpSection}>
          <Text>Don't have an account? </Text>
          <Link href="/signup" style={link.sub_link}>
            Sign up
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    marginTop: 150,
    marginHorizontal: 25,
  },
  forgotLink: {
    marginTop: 15,
    textAlign: "right",
  },
  signInButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#bcbcbc",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});