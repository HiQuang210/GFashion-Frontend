import { StyleSheet } from "react-native";

const text = StyleSheet.create({
  base_text: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    color: "#1F2029",
    marginHorizontal: 10,
  },
  brown_text: {
    color: "#704F38",
  },
  gray_text: {
    color: "#797979",
  },
  sub_text: {
    marginTop: 12,
    fontFamily: "Inter",
    fontSize: 13,
    textAlign: "center",
    color: "#bcbcbc",
  },
  main_title: {
    fontSize: 32,
    fontWeight: "ultralight",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 12,
  },
  sub_title: {
    fontSize: 12,
    textAlign: "center",
    color: "#797979",
  },
  page_header: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: 500,
  },
  text_btn: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    lineHeight: 50,
  },
});

export default text;
