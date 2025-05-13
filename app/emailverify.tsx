import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { verifyPageStyles as styles } from "@/styles/emailverify";

export default function VerifyPage() {
  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="envelope-o" size={40} color="#fff" />
        </View>
        
        <Text style={styles.title}>Check Your Email</Text>
        
        <Text style={styles.message}>
          Registration successful! We have sent a verification email that contains the verify link to your email address. 
          {"\n\n"}
          If you don't see our email, please check your spam folder.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}