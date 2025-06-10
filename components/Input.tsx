import {
  Text,
  TextInput,
  StyleSheet,
  InputModeOptions,
  KeyboardTypeOptions,
  View,
  DimensionValue,
  TouchableOpacity,
} from "react-native";

import layout from "@/styles/layout";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";

type InputProps = {
  label: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  inputMode: InputModeOptions;
  secureTextEntry: boolean;
  value: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  width?: DimensionValue;
  editable?: boolean;
  containerStyle?: any;
};

export default function Input({
  label,
  placeholder,
  keyboardType,
  inputMode,
  secureTextEntry,
  value,
  onChangeText,
  onBlur,
  error,
  width = "100%",
  editable = true,
  containerStyle,
}: InputProps) {
  function containsPass(password: string) {
    return password.toLowerCase().includes("pass");
  }

  if (containsPass(label)) {
    const [hide, useHide] = useState(true);
    function handleHide() {
      useHide(!hide);
    }
    return (
      <View style={layout.margin_bottom_s}>
        <Text>{label}</Text>
        <View
          style={[
            layout.flex_row,
            {
              width: width,
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            },
            styles.containter,
          ]}
        >
          <TextInput
            placeholder={`${placeholder}`}
            inputMode={`${inputMode}`}
            keyboardType={`${keyboardType}`}
            style={[styles.pass_input]}
            placeholderTextColor={"#bcbcbc"}
            secureTextEntry={hide}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
          />
          <TouchableOpacity onPress={handleHide}>
            {hide ? (
              <Feather name="eye-off" size={20} />
            ) : (
              <Feather name="eye" size={20} />
            )}
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.text_err}>{error}</Text> : null}
      </View>
    );
  }
  return (
    <View style={[layout.margin_bottom_s, containerStyle]}>
      <Text>{label}</Text>
      <TextInput
        placeholder={`${placeholder}`}
        inputMode={`${inputMode}`}
        keyboardType={`${keyboardType}`}
        editable={editable}
        style={[
          styles.input,
          { width: "100%", backgroundColor: !editable ? "#f0f0f0" : "#fff" },
        ]}
        placeholderTextColor={"#bcbcbc"}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
      {error ? <Text style={styles.text_err}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  input: {
    marginTop: 8,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#bcbcbc",
  },
  pass_input: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#797979",
    width: 300,
  },
  containter: {
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#bcbcbc",
  },

  break_styled: {
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
  text_err: {
    color: "#ff2c2c",
    marginTop: 5,
    marginLeft: 5,
    fontSize: 12,
  },
});