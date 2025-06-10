import BackButton from "@/components/BackButton";
import SectionProfile from "@/components/SectionProfile";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView>
      <BackButton />
      <SectionProfile
        icon={"key"}
        content={"Password Manager"}
        route={"/resetpassword"}
      />
    </SafeAreaView>
  );
}
