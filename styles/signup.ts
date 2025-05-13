import { StyleSheet } from "react-native";

export const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    marginTop: 50,
    marginHorizontal: 25,
  },
  title: {
    marginBottom: 20,
    width: 230,
    marginHorizontal: "auto",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  nameInput: {
    flex: 1,
  },
  breakStyled: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  break: {
    width: 80,
    height: 0,
    borderColor: "#bcbcbc",
    borderWidth: 0.5,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
  },
  signUpButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});