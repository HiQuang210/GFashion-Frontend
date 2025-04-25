import { View, StyleSheet, SafeAreaView } from "react-native";

import Input from "@/components/Input";
import Title from "@/components/Title";
import AccessButton from "@/components/AccessButton";
import BackButton from "@/components/BackButton";

export default function ForgotPass() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 10, marginHorizontal: 25 }}>
        <BackButton />
        <Title
          mainTitle="New Password"
          subTitle="Your new password must be different from previously used passwords"
          margin_bot={30}
        />

        <Input
          label="Password"
          placeholder="*****************"
          keyboardType="default"
          inputMode="text"
          secureTextEntry={true}
        />

        <Input
          label="Confirm Password"
          placeholder="*****************"
          keyboardType="default"
          inputMode="text"
          secureTextEntry={true}
        />

        <AccessButton route="login" content="Create New Password" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
