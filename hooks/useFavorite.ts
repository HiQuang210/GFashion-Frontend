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
      await queryClient.cancelQueries({ queryKey: ["favoriteProducts", userInfo?._id] });

      const previousFavorites = queryClient.getQueryData<string[]>(["userFavorites", userInfo?._id]) || [];
      const previousFavoriteProducts = queryClient.getQueryData(["favoriteProducts", userInfo?._id]) || [];

      const newFavorites = action === "add" 
        ? [...previousFavorites, productId]
        : previousFavorites.filter(id => id !== productId);

      queryClient.setQueryData(["userFavorites", userInfo?._id], newFavorites);

      if (action === "remove") {
        const updatedFavoriteProducts = Array.isArray(previousFavoriteProducts) 
          ? previousFavoriteProducts.filter((product: any) => product._id !== productId)
          : [];
        queryClient.setQueryData(["favoriteProducts", userInfo?._id], updatedFavoriteProducts);
      }

      return { previousFavorites, previousFavoriteProducts };
    },
    onError: (err, { productId }, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["userFavorites", userInfo?._id], context.previousFavorites);
      }
      if (context?.previousFavoriteProducts) {
        queryClient.setQueryData(["favoriteProducts", userInfo?._id], context.previousFavoriteProducts);
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

        if (action === "add") {
          queryClient.invalidateQueries({ queryKey: ["favoriteProducts", userInfo?._id] });
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userFavorites", userInfo?._id] });
      queryClient.invalidateQueries({ queryKey: ["favoriteProducts", userInfo?._id] });
    },
  });

  const toggleFavorite = (productId: string) => {
    const isCurrentlyFavorite = favorites.includes(productId);
    const action = isCurrentlyFavorite ? "remove" : "add";
    
    favoriteMutation.mutate({ action, productId });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const addToFavorites = (productId: string) => {
    if (!favorites.includes(productId)) {
      favoriteMutation.mutate({ action: "add", productId });
    }
  };

  const removeFromFavorites = (productId: string) => {
    if (favorites.includes(productId)) {
      favoriteMutation.mutate({ action: "remove", productId });
    }
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    isLoading: favoriteMutation.isPending,
  };
};