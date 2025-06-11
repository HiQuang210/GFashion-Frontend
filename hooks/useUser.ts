import { useQuery } from "@tanstack/react-query";
import { getUserDetail } from "@/api/services/UserService";
import { UserDetailResponse } from "@/types/user";

export function useUser(id: string | undefined) {
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
    meta: {
      errorMessage: "Failed to load user data",
    },
  });

  return { 
    isLoading: isLoading || isFetching, 
    user, 
    error,
    isError,
    refetch,
    isFetching,
  };
}