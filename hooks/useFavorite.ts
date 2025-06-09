import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleFavorite, getUserDetail } from "@/api/services/UserService";
import { useAuth } from "@/hooks/useAuth";
import Toast from "react-native-toast-message";

export const useFavorites = () => {
  const { userInfo, updateUserInfo } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["userFavorites", userInfo?._id],
    queryFn: async () => {
      if (!userInfo?._id) return [];
      const response = await getUserDetail(userInfo._id);
      return response.data.favorite || [];
    },
    enabled: !!userInfo?._id,
    staleTime: 1000 * 60 * 5,
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ action, productId }: { action: "add" | "remove"; productId: string }) => {
      if (!userInfo) throw new Error("User not authenticated");
      
      return await handleFavorite({
        action,
        userId: userInfo._id,
        productId,
      });
    },
    onMutate: async ({ action, productId }) => {
      await queryClient.cancelQueries({ queryKey: ["userFavorites", userInfo?._id] });
      const previousFavorites = queryClient.getQueryData<string[]>(["userFavorites", userInfo?._id]) || [];

      const newFavorites = action === "add" 
        ? [...previousFavorites, productId]
        : previousFavorites.filter(id => id !== productId);

      queryClient.setQueryData(["userFavorites", userInfo?._id], newFavorites);

      return { previousFavorites };
    },
    onError: (err, { productId }, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["userFavorites", userInfo?._id], context.previousFavorites);
      }
      
      const errorMessage = (err as any)?.response?.data?.message || "Failed to update wishlist";
      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "top",
      });
    },
    onSuccess: (response, { action, productId }) => {
      if (response.status === "OK") {
        const currentFavorites = queryClient.getQueryData<string[]>(["userFavorites", userInfo?._id]) || [];
        if (userInfo) {
          updateUserInfo({
            ...userInfo,
            favorite: currentFavorites
          });
        }

        Toast.show({
          type: "success",
          text1: action === "add" ? "Added to Wishlist" : "Removed from Wishlist",
          position: "top",
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userFavorites", userInfo?._id] });
    },
  });

  const toggleFavorite = (productId: string) => {
    const isCurrentlyFavorite = favorites.includes(productId);
    const action = isCurrentlyFavorite ? "remove" : "add";
    
    favoriteMutation.mutate({ action, productId });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoading: favoriteMutation.isPending,
  };
};