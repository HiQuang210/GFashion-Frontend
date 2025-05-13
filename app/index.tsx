import { View, StyleSheet, Text, Image } from "react-native";
import { Link } from "expo-router";

import Svg, { Circle } from "react-native-svg";
import text from "@/styles/text";
import link from "@/styles/link";

import Toast from "react-native-toast-message";

export default function Index() {
  return (
    <View style={styles.container}>
      <Svg height="50%" width="50%" viewBox="0 0 100 100" style={styles.circle}>
        <Circle
          cx="25"
          cy="-15"
          r="50"
          stroke="#e4e4e4"
          strokeWidth="0.5"
          fill="#fff"
        />
      </Svg>

      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        style={styles.circle}
      >
        <Circle
          cx="100"
          cy="35"
          r="20"
          stroke="#e4e4e4"
          strokeWidth="0.5"
          fill="#fff"
        />
      </Svg>

      <View style={styles.container_images}>
        <View style={styles.column}>
          <Image
            source={require("../assets/images/Miguel-Label-mens-fashion-blogger-819x1024.jpg")}
            style={{
              width: "100%",
              height: 450,
              borderRadius: 70,
            }}
          />
        </View>

        <View style={styles.column}>
          <Image
            source={require("../assets/images/Men_s-Summer-Fashion-613288.webp")}
            style={{
              width: "100%",
              height: 300,
              borderRadius: 70,
            }}
          />
          <Image
            source={require("../assets/images/shutterstock_1199713018-819x1024.jpg")}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 50,
            }}
          />
        </View>
      </View>

      <Text style={text.base_text}>
        The <Text style={text.brown_text}>Fashion App</Text> That Make You Look
        Your Best
      </Text>

      <Text style={text.sub_text}>
        Fashion advice that fits your taste and lifestyle perfectly
      </Text>

      <Link href="/onboarding" style={[link.btn_link, link.btn_link_welcome]}>
        Let's Get Started
      </Link>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
        }}
      >
        <Text style={styles.text_link}>Already have an account?</Text>
        <Link href="/login" style={styles.link}>
          Sign In
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  container_images: {
    flexDirection: "row",
    width: "80%",
    height: 480,
    marginHorizontal: "auto",
    gap: 15,
    marginTop: 100,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  circle: {
    position: "absolute",
  },

  round: {
    width: 170,
    height: 170,
    borderColor: "#797979",
    borderWidth: 1,
    clip: "circle(53.4% at 22% 28%)",
    backgroundColor: "#000",
  },

  text_link: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "300",
  },
  link: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "500",
    color: "#704F38",
    textDecorationLine: "underline",
    textDecorationColor: "#704F38",
  },
});
