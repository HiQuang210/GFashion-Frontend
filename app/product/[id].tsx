import LikeButton from "@/components/LikeButton";
import PageHeader from "@/components/PageHeader";
import layout from "@/styles/layout";
import text from "@/styles/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams } from "expo-router";
import { translateColor } from "../../utils/helper";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useProductDetail } from "../../hooks/product/useProduct";
import { useState } from "react";
import Carousel from "react-native-reanimated-carousel";
export default function BestSeller() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError } = useProductDetail(id);
  const [active, setActive] = useState(0);
  const [sizeClo, setSize] = useState("S");
  const { width } = Dimensions.get("window");

  if (isLoading) return <Text>...Loading</Text>;
  console.log("Detail");
  console.log(data);

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <ScrollView style={{ position: "relative" }}>
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            top: 40,
            width: "100%",
          }}
        >
          <PageHeader content={""} />
          <LikeButton />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#ededed",
            height: 401,
          }}
        >
          <Carousel
            width={width * 1}
            height={400}
            autoPlay={false}
            data={data.data.images}
            scrollAnimationDuration={500}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item as any }}
                style={{ width: "100%", height: 400 }}
                resizeMode="contain"
              />
            )}
          />
        </View>
        <View style={{ marginTop: 20, marginHorizontal: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <View
              style={[layout.flex_row, { justifyContent: "space-between" }]}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "Inter",
                  fontWeight: 500,
                  color: "#704F38",
                }}
              >
                {data.data.price.toLocaleString?.("vi-VN")}đ
              </Text>
              <View
                style={[
                  styles.flex,
                  { alignItems: "flex-start" },
                  layout.gap_xs,
                ]}
              >
                <FontAwesome name="star" size={20} color={"#fcaf23"} />
                <Text style={text.gray_text}>0</Text>
              </View>
            </View>

            <Text style={{ marginTop: 5, fontSize: 19, fontFamily: "Inter" }}>
              {data.data.name}
            </Text>

            <View style={{ marginTop: 25 }}>
              <Text
                style={{ fontSize: 17, fontFamily: "Inter", marginBottom: 7 }}
              >
                Chi tiết sản phẩm
              </Text>
              <Text style={{ fontFamily: "Inter", color: "#797979" }}>
                Chất liệu: {data.data.material}
              </Text>
              <Text style={{ fontFamily: "Inter", color: "#797979" }}>
                {data.data.description}
              </Text>
            </View>
          </View>
          <View
            style={{ width: "100%", borderWidth: 0.75, borderColor: "#ededed" }}
          ></View>
          <View style={{ marginTop: 10 }}>
            <View>
              <Text
                style={{ fontSize: 17, fontFamily: "Inter", marginBottom: 7 }}
              >
                Select Size
              </Text>
              <View style={[layout.flex_row, layout.gap_s]}>
                {data.data.variants[active].sizes.map((size: any) => {
                  return (
                    <TouchableOpacity
                      style={
                        size.size === sizeClo ? styles.size_active : styles.size
                      }
                      key={size.size}
                      onPress={() => setSize(size.size)}
                    >
                      <Text
                        style={
                          size.size === sizeClo
                            ? styles.text_active
                            : styles.text
                        }
                      >
                        {size.size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text
                style={{ fontSize: 17, fontFamily: "Inter", marginBottom: 7 }}
              >
                Select Color:
              </Text>
              <View style={[layout.flex_row, layout.gap_s]}>
                {data?.data?.variants.map((color: any, index: any) => {
                  return (
                    <TouchableOpacity
                      style={[
                        { backgroundColor: translateColor(color.color) },
                        styles.round,
                      ]}
                      key={color.color}
                      onPress={() => setActive(index)}
                    >
                      {index === active ? (
                        <View style={styles.round_sm}></View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  round: {
    width: 35,
    height: 35,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  round_sm: {
    width: 20,
    height: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  size: {
    width: 40,

    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 10,
  },
  size_active: {
    width: 40,
    backgroundColor: "#704F38",
    borderWidth: 1,

    borderRadius: 10,
  },
  text: {
    textAlign: "center",
    paddingVertical: 7,
  },
  text_active: {
    textAlign: "center",
    paddingVertical: 7,
    color: "#FFF",
  },
});

BestSeller.options = {
  tabBarStyle: { display: "none" }, // ẩn thanh bar khi vào tab này
  tabBarButton: () => null, // không hiển thị icon trong tab
};
