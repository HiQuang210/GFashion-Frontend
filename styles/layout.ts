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

  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 25,
    marginHorizontal: 20,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#C4A484", 
    overflow: "hidden",
    left: 0,
    right: 0,
  },

  tabItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    position: "relative",
  },

  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#704F38",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default layout;
