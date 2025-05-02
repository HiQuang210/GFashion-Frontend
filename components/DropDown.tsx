import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function DropDown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);
  return (
    <View style={{ zIndex: 1000, marginBottom: 30 }}>
      <Text style={{ marginBottom: 10 }}>Gender</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select"
        style={styles.dropdown}
        textStyle={styles.text}
        dropDownContainerStyle={styles.dropdownBox}
        arrowIconStyle={{ borderColor: "#999" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  dropdown: {
    borderRadius: 25,
    borderColor: "#ddd",
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 16,
  },
  dropdownBox: {
    borderRadius: 25,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
    color: "#888",
  },
  arrowIcon: {
    tintColor: "#999",
  },
});
