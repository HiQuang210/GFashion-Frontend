import { Link } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import text from "@/styles/text";
import link from "@/styles/link";
import { loginStyles as styles } from "@/styles/login";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Title from "@/components/Title";
import Input from "@/components/Input";
import { Controller, useForm } from "react-hook-form";
import { useLogIn } from "@/hooks/useLogin";
import { LoginData } from "@/types/user";
import CustomButton from "@/components/CustomButton";

export default function Login() {
  const { login, isPending, isError, reset } = useLogIn();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginData) => {
    try {
      if (isError) {
        reset();
      }
      
      await login(data);
    } catch (error) {
      console.log("Login attempt failed:", error);
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
          rules={{ 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          }}
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

        <CustomButton
          content="Sign In"
          onPress={handleSubmit(onSubmit)}
          isPending={isPending}
          style={{ marginTop: 20 }}  
        />

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