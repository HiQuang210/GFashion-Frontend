import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import text from "@/styles/text";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";

export default function EnterLocation() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            gap: 60,
          }}
        >
          <BackButton />
          <Text style={{ fontSize: 20, fontWeight: 500 }}>
            Enter your location
          </Text>
        </View>

        <Input
          label=""
          placeholder="Enter place you want"
          keyboardType="default"
          inputMode="text"
          secureTextEntry={false}
        />
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
