import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import link from "@/styles/link";
import text from "@/styles/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChangePassword } from "../customHooks/useChangePass";
import { useState, useEffect } from "react";

interface resetdata {
  currentPass: string;
  password: string;
  confirmPass: string;
}

export default function Resetpassword() {
  const { register, formState, getValues, handleSubmit, reset, control } =
    useForm<resetdata>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      console.log("Loaded userId:", id); // DEBUG
      setUserId(id);
    });
  }, []);
  const { errors } = formState;

  const { changePw, isPending } = useChangePassword();

  const onSubmit = async (data: resetdata) => {
    if (!userId) return;

    changePw(
      {
        id: userId,
        oldPassword: data.currentPass,
        newPassword: data.password,
      } as any,
      {
        onSettled: () => reset(),
      }
    );
  };

  return (
    <SafeAreaView>
      <PageHeader content="Change Pass" />
      <View style={{ marginHorizontal: 20 }}>
        <Controller
          control={control}
          name="currentPass"
          rules={{ required: "Current password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Current Password"
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

        <Text
          style={{
            fontSize: 20,
            fontFamily: "Inter",
            color: "#704F38",
            marginBottom: 20,
            marginTop: 30,
          }}
        >
          Enter your new password here
        </Text>

        <Controller
          control={control}
          name="password"
          rules={{ required: "New password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="New Password"
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
          name="confirmPass"
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value === getValues().password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm New Password"
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
        <TouchableOpacity
          style={[
            link.btn_link,
            link.btn_link_base,
            { marginTop: 20, marginBottom: 20 },
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={text.text_btn}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
