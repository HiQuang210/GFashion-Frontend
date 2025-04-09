import { Link } from "expo-router";
import { Text, TextInput, View, StyleSheet, SafeAreaView } from "react-native";
import text from "@/styles/text";
import link from "@/styles/link";
import layout from "@/styles/layout";

import VerifyInput from "@/components/VerifyInput";
import BackButton from "@/components/BackButton";
import AccessButton from "@/components/AccessButton";
import Title from "@/components/Title";

export default function VerifyPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 20, marginHorizontal: 25 }}>
        <BackButton />
        <Title
          mainTitle="Verify Code"
          subTitle="Please enter the code we just sent to email"
          margin_bot={0}
        />
        <Text style={[text.sub_title, text.brown_text, { marginBottom: 30 }]}>
          example@gmail.com
        </Text>

        <View style={[layout.flex_row_center, layout.gap_m]}>
          <VerifyInput />
          <VerifyInput />
          <VerifyInput />
          <VerifyInput />
        </View>

        <View style={[layout.flex_col_center, layout.margin_top_m]}>
          <Text style={text.gray_text}>Did you receive OTP?</Text>
          <Link href="/" style={link.sub_link}>
            Resend code
          </Link>
        </View>

        <AccessButton route="completeprofile" content="Verify" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  verify_input: {
    width: 60,
    height: 50,
    borderColor: "#bcbcbc",
    borderWidth: 1,
    borderRadius: 20,
  },

  back_button: {},
});
