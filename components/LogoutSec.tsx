import layout from "@/styles/layout";
import link from "@/styles/link";
import text from "@/styles/text";
import { View, Text, TouchableOpacity } from "react-native";
import { useLogout } from "../hooks/useLogout";
import { Dispatch, SetStateAction } from "react";

interface props {
  handleHide?: Dispatch<SetStateAction<boolean>>;
}

export default function LogoutSec({ handleHide }: props) {
  const logout = useLogout();
  function handeButton() {
    if (handleHide) handleHide(false);
  }
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
        display: "flex",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <View style={{ height: "90%" }}></View>
      <View
        style={{
          paddingTop: 10,
          height: 150,
          borderWidth: 1,
          borderColor: "#797979",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ textAlign: "center", color: "#797979" }}>
          Are you sure you want to log out?
        </Text>
        <View style={[layout.flex_row_center, { gap: 10 }]}>
          <TouchableOpacity
            style={[
              link.btn_link,
              {
                marginTop: 20,
                marginBottom: 20,
                width: 180,
                height: 60,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#704F38",
              },
            ]}
            onPress={handeButton}
          >
            <Text
              style={[
                text.text_btn,
                { color: "#704F38", marginHorizontal: "auto" },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              link.btn_link,
              {
                marginTop: 20,
                marginBottom: 20,
                width: 180,
                height: 60,
              },
            ]}
            onPress={logout}
          >
            <Text style={[text.text_btn, { marginVertical: "auto" }]}>
              Yes, Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
