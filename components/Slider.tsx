import layout from "@/styles/layout";
import { useEffect, useState } from "react";
import { Image, View, StyleSheet, ImageBackground } from "react-native";

export default function Slider() {
  const [index, setIndex] = useState(0);
  const images = [
    require("../assets/images/Fashion-Bug_Sliders_Jul_2024-1_compressed.jpg"),
    require("../assets/images/flat-design-fashion-collection-facebook-template_23-2149921756.avif"),
    require("../assets/images/shop.jpg"),
    require("../assets/images/FormalWear_Slider.jpg"),
    require("../assets/images/cb81571c9324e9da8f6f5e704cba27c8.jpg"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % images.length;
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View style={{ marginBottom: 30 }}>
      <Image source={images[index]} resizeMode="stretch" style={styles.img} />
      <View style={[layout.flex_row_center, layout.gap_xs]}>
        <View
          style={index === 0 ? styles.dot_active : styles.dot_unactive}
        ></View>
        <View
          style={index === 1 ? styles.dot_active : styles.dot_unactive}
        ></View>
        <View
          style={index === 2 ? styles.dot_active : styles.dot_unactive}
        ></View>
        <View
          style={index === 3 ? styles.dot_active : styles.dot_unactive}
        ></View>
        <View
          style={index === 4 ? styles.dot_active : styles.dot_unactive}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 345,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  dot_active: {
    width: 10,
    height: 10,
    backgroundColor: "#704F38",
    borderRadius: 30,
  },
  dot_unactive: {
    width: 10,
    height: 10,
    backgroundColor: "#ededed",
    borderRadius: 30,
  },
});
