import { Link } from "expo-router";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
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
  const { register, formState, getValues, handleSubmit, reset, control } =
    useForm<LogInData>();
  const { errors } = formState;

  function onSubmit(data: LogInData) {
    login(data, {
      onSettled: () => reset(),
    });
    console.log(data);
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 150, marginHorizontal: 25 }}>
        <Title
          mainTitle="Sign In"
          subTitle="Hi! Welcome back, you've been missed"
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

        <Link
          href="/forgotpass"
          style={[link.sub_link, { marginTop: 15, textAlign: "right" }]}
        >
          Forgot Password?
        </Link>
        <TouchableOpacity
          style={[
            link.btn_link,
            link.btn_link_base,
            { marginTop: 20, marginBottom: 20 },
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={text.text_btn}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.break_styled}>
          <View style={styles.break}></View>
          <Text style={text.gray_text}>Or sign in with</Text>
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
          <Text>Don't have an account?</Text>
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
});
