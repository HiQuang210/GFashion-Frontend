import PageHeader from "@/components/PageHeader";
import SectionProfile from "@/components/SectionProfile";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView>
      <PageHeader content="Settings" />
      <SectionProfile
        icon={"key"}
        content={"Password Manager"}
        route={"/resetpassword"}
      />
    </SafeAreaView>
  );
}
