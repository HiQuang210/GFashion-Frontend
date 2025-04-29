import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CheckoutSection() {
  return (
    <View>
      <View>
        <TextInput />
        <TouchableOpacity>Apply</TouchableOpacity>
      </View>
      <View>
        <View>
          <Text>Sub-Total</Text>
          <Text>$400</Text>
        </View>
        <View>
          <Text>Delivery Fee</Text>
          <Text>$400</Text>
        </View>
        <View>
          <Text>Discount</Text>
          <Text>$400</Text>
        </View>
      </View>
    </View>
  );
}
