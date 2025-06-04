import layout from "@/styles/layout";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function CartItem() {
  return (
    <View
      style={[
        layout.flex_row,
        layout.gap_m,
        {
          borderBottomWidth: 1,
          borderBottomColor: "#ededed",
          paddingLeft: 20,
          paddingTop: 10,
          paddingBottom: 15,
          paddingRight: 10,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/221124_maverik_0_25_9335d9a2d67d4f719f342f4a533d80f1_master.webp")}
        resizeMode="stretch"
        style={{ width: 100, height: 100, borderRadius: 10 }}
      />
      <View style={[{ flex: 2, gap: 8 }]}>
        <Text style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>
          Brow Jacket
        </Text>
        <Text style={{ fontSize: 12, color: "#797979" }}>Size: XL</Text>
        <Text style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 20 }}>
          $66
        </Text>
      </View>
      <View
        style={[
          layout.gap_s,
          {
            flex: 3,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexDirection: "row",
            height: 80,
          },
        ]}
      >
        <TouchableOpacity style={[styles.button, styles.button_minus]}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>-</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 19 }}>1</Text>
        <TouchableOpacity style={[styles.button, styles.button_plus]}>
          <Text style={{ textAlign: "center", color: "#fff", fontSize: 20 }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  button_plus: {
    backgroundColor: "#704F38",
  },
  button_minus: {
    backgroundColor: "#ededed",
    borderWidth: 1,
    borderColor: "#ededed",
  },
});
