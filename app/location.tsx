import AccessButton from "@/components/AccessButton";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";
import layout from "@/styles/layout";
import text from "@/styles/text";

export default function Location() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 100, marginHorizontal: 25 }}>
        <View
          style={[
            layout.container_rounded_big,
            layout.flex_col_center,
            {
              backgroundColor: "#ededed",
              marginHorizontal: "auto",
              marginBottom: 50,
            },
          ]}
        >
          <FontAwesome6 name="location-dot" size={80} color={"#704F38"} />
        </View>
        <View>
          <Text style={[text.main_title, { fontWeight: 500 }]}>
            What is your location?
          </Text>
          <Text style={[text.sub_title, { marginBottom: 40 }]}>
            We need to know your location in order to suggest nearby services
          </Text>
        </View>
        <AccessButton
          route="login"
          content="Allow Location Access"
          background="#704F38"
          color="#fff"
        />
        <AccessButton
          route="enterlocation"
          content="Enter location manually"
          background="#fff"
          color="#704F38"
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
