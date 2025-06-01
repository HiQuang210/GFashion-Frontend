import { Link, router } from "expo-router";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import text from "@/styles/text";
import { useState } from "react";
import link from "@/styles/link";
import CustomButton from "@/components/CustomButton";

export default function Onboarding() {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const images = [
    require("../assets/images/pic1.png"),
    require("../assets/images/pic2.png"),
    require("../assets/images/pic3.png"),
  ];
  const title = [
    [
      "Seamless ",
      "Shopping Experience",
      "Enjoy a smooth and effortless journey from browsing to checkout.",
    ],
    [
      "Wishlist: ",
      "Where Fashion Dreams Begin",
      "Save your favorite styles and turn your fashion wishes into reality.",
    ],
    [
      "Swift ",
      "and Reliable Delivery",
      "Count on us to deliver your orders quickly and securely, every time.",
    ],
  ];

  function handleNextImg(): void {
    if (imgIndex >= 2) return;
    setImgIndex(imgIndex + 1);
  }

  function handlePreImg(): void {
    if (imgIndex <= 0) return;
    setImgIndex(imgIndex - 1);
  }

  function handleSignUp() {
    router.push("/signup");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Link href="/login" style={styles.skip_link}>
          Skip
        </Link>

        <Image
          source={images[imgIndex]}
          style={{
            width: "100%",
            height: 400,
            marginTop: 80,
          }}
          resizeMode="contain"
        />

        <View style={styles.instruct_con}>
          <Text
            style={[
              text.base_text,
              {
                marginBottom: 12,
                width: 350,
                marginHorizontal: "auto",
              },
            ]}
          >
            <Text style={text.brown_text}>{title[imgIndex][0]}</Text>
            {title[imgIndex][1]}
          </Text>

          <Text style={[text.sub_text, { marginHorizontal: 40 }]}>
            {title[imgIndex][2]}
          </Text>

          <View style={styles.arrow_container}>
            <TouchableOpacity onPress={handlePreImg}>
              <View
                style={[
                  styles.round_bac,
                  { borderColor: "#704F38", borderWidth: 1 },
                  imgIndex <= 0 ? { opacity: 0 } : null,
                ]}
              >
                <FontAwesome5 name="arrow-left" size={24} color="#704F38" />
              </View>
            </TouchableOpacity>

            <View style={styles.dot_container}>
              <View
                style={imgIndex === 0 ? styles.dot_active : styles.dot_unactive}
              />
              <View
                style={imgIndex === 1 ? styles.dot_active : styles.dot_unactive}
              />
              <View
                style={imgIndex === 2 ? styles.dot_active : styles.dot_unactive}
              />
            </View>

            {imgIndex === 2 ? (
              <CustomButton
                content="Sign Up"
                onPress={handleSignUp}
                style={[link.btn_link, link.btn_link_nav]}
              />
            ) : (
              <TouchableOpacity onPress={handleNextImg}>
                <View
                  style={[styles.round_bac, { backgroundColor: "#704F38" }]}
                >
                  <FontAwesome5 name="arrow-right" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  instruct_con: {
    borderRadius: 40,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingBottom: 60,
    marginTop: 20,
  },
  arrow_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 64,
  },
  dot_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dot_unactive: {
    width: 10,
    height: 10,
    backgroundColor: "#bcbcbc",
    borderRadius: 50,
  },
  dot_active: {
    width: 16,
    height: 16,
    backgroundColor: "#704F38",
    borderRadius: 50,
  },
  round_bac: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  skip_link: {
    position: "absolute",
    top: 50,
    right: 20,
    color: "#704F38",
    zIndex: 10,
  },
});
