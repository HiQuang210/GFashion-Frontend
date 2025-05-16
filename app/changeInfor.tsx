import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import { useUser } from "@/hooks/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import link from "@/styles/link";
import text from "@/styles/text";
import { useQueryClient } from "@tanstack/react-query";

interface FormData {
  phone: string;
  firstName: string;
  lastName: string;
}

export default function ChangeInfo() {
  const { formState, getValues, handleSubmit, reset, control } =
    useForm<FormData>();
  const { errors } = formState;
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((id) => {
        console.log("User ID:", id);
        setUserId(id);
      })
      .catch((err) => console.error("AsyncStorage error:", err));
  }, []);

  const { user, isLoading } = useUser(userId);
  const { mutate: updateUser, isPending } = useUpdateUser();

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
    updateUser({ id: userId, data } as any, {
      onSuccess: () => {
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ["user", userId] });
        }
        alert("Cập nhật thành công!");
      },
      onError: (error: any) => {
        alert("Lỗi khi cập nhật: " + error.message);
      },
    });
  };

  if (!userId || isLoading) {
    return <Text>loading...</Text>;
  }
  return (
    <SafeAreaView style={{ marginHorizontal: 20 }}>
      <PageHeader content="Information" />
      <View>
        <Input
          label="Email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          inputMode="email"
          secureTextEntry={false}
          value={user.data.email}
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
