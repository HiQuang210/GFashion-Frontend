import { useState } from "react";
import { useToast } from "./useToast";

export function useAgreement() {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { showErrorToast } = useToast();

  const toggleAgreement = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  const validateAgreement = () => {
    if (!agreeToTerms) {
      showErrorToast(
        "Agreement Required",
        "Please agree to Terms & Conditions to continue"
      );
      return false;
    }
    return true;
  };

  return {
    agreeToTerms,
    toggleAgreement,
    validateAgreement
  };
}