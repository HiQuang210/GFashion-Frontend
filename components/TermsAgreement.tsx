import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import link from "@/styles/link";
import layout from "@/styles/layout";

interface TermsAgreementProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

const TermsAgreement = ({ value, onChange }: TermsAgreementProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAgree = () => {
    onChange(true);        
    setModalVisible(false); 
  };

  return (
    <>
      {/* Agreement row */}
      <View style={[layout.flex_row, layout.gap_xs, styles.row]}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            layout.flex_row_center,
            {
              backgroundColor: value ? "#704F38" : "#fff",
              borderColor: "#704F38",
            },
          ]}
          onPress={() => onChange(!value)}
        >
          {value ? <FontAwesome name="check" size={22} color="#fff" /> : null}
        </TouchableOpacity>
        <Text>Agree with</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={[link.sub_link]}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Terms & Conditions</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.content}>
              <Text style={styles.text}>
                Welcome to GFashion. By signing up, you agree to the following:
                {"\n\n"}1. You agree not to misuse the service.
                {"\n\n"}2. Your data may be used to personalize your shopping
                experience.
                {"\n\n"}3. You must be at least 13 years old.
                {"\n\n"}4. All purchases are subject to our refund policy.
                {"\n\n"}5. We reserve the right to suspend accounts that violate
                these terms.
              </Text>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleAgree}>
              <Text style={styles.buttonText}>I Agree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 20,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  close: {
    fontSize: 22,
    color: "#999",
  },
  content: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#704F38",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default TermsAgreement;
