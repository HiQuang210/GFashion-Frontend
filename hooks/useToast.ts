import Toast from "react-native-toast-message";

export function useToast() {
  const showSuccessToast = (text1: string, text2?: string) => {
    Toast.show({
      type: "success",
      text1,
      text2,
    });
  };

  const showErrorToast = (text1: string, text2?: string) => {
    Toast.show({
      type: "error",
      text1,
      text2,
    });
  };

  const showInfoToast = (text1: string, text2?: string) => {
    Toast.show({
      type: "info",
      text1,
      text2,
    });
  };

  const hideToast = () => {
    Toast.hide();
  };

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    hideToast
  };
}