import { StyleSheet } from "react-native";

const layout = StyleSheet.create({
  flex_row: {
    display: "flex",

    flexDirection: "row",
    alignItems: "center",
  },
  flex_col: {
    display: "flex",
    justifyContent: "center",
  },
  flex_row_center: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  flex_col_center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  gap_xs: {
    gap: 4,
  },

  gap_s: {
    gap: 12,
  },

  gap_m: {
    gap: 16,
  },

  gap_l: {
    gap: 24,
  },

  container_rounded_big: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: "#eaeaea",
  },

  container_rounded: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: "#bcbcbc",
  },

  container_rounded_small: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: "#797979",
  },

  margin_top_s: {
    marginTop: 20,
  },

  margin_top_m: {
    marginTop: 30,
  },

  margin_bottom_xs: {
    marginBottom: 10,
  },

  margin_bottom_s: {
    marginBottom: 20,
  },
});

export default layout;
