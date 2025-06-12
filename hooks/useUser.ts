import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserDetail } from "@/api/services/UserService";
import { UserDetailResponse } from "@/types/user";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function useUser(id: string | undefined) {
  const { userInfo } = useAuthContext();
  const queryClient = useQueryClient();
  
  const {
    isLoading,
    data: user,
    error,
    refetch,
    isError,
    isFetching,
  } = useQuery<UserDetailResponse>({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) throw new Error("User ID is required");
      console.log("Fetching user detail for ID:", id);
      return getUserDetail(id);
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      const status = (error as any)?.response?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false, 
    refetchOnMount: true,
    refetchOnReconnect: true,
    networkMode: 'online',
    meta: {
      errorMessage: "Failed to load user data",
    },
  });

  useEffect(() => {
    if (userInfo?._id && id && userInfo._id !== id) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [userInfo?._id, id, queryClient]);

  const isCurrentUser = userInfo?._id === id;
  const shouldUseData = !user || user.data?._id === id;

  return { 
    isLoading: isLoading || isFetching, 
    user: shouldUseData ? user : null, 
    error,
    isError,
    refetch,
    isFetching,
    isCurrentUser,
  };
}