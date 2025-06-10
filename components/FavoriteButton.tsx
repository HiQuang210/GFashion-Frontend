import { StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import layout from "@/styles/layout";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorite";

interface FavoriteButtonProps {
  productId: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ 
  productId, 
  onFavoriteChange 
}: FavoriteButtonProps) {
  const { userInfo } = useAuth();
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();

  const currentIsFavorite = isFavorite(productId);

  async function handleTouch() {
    if (!userInfo) {
      Toast.show({
        type: "error",
        text1: "Please login to add favorites",
        position: "top",
      });
      return;
    }

    if (isLoading) return;

    toggleFavorite(productId);
    onFavoriteChange?.(!currentIsFavorite);
  }

  return (
    <TouchableOpacity
      style={[styles.container, layout.flex_col_center]}
      onPress={handleTouch}
      disabled={isLoading}
    >
      <AntDesign
        name={currentIsFavorite ? "heart" : "hearto"}
        color={"#704F38"}
        size={20}
        style={{ marginTop: 2 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: "#ededed",
    borderRadius: 50,
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 2,
  },
});