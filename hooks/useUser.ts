import { useQuery } from "@tanstack/react-query";
import { getUserDetail } from "@/api/services/UserService";
import { UserDetailResponse } from "@/types/user";

export function useUser(id: string | undefined) {
  console.log("useUser - id:", id);
  
  const {
    isLoading,
    data: user,
    error,
    refetch,
    isError,
  } = useQuery<UserDetailResponse>({
    queryKey: ["user", id],
    queryFn: () => {
      console.log("Calling getUserDetail with id:", id);
      return getUserDetail(id!); // Using non-null assertion since enabled ensures id exists
    },
    enabled: !!id, // Only run query if id exists
    retry: 2, // Retry failed requests 2 times
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (renamed from cacheTime)
  });

  console.log("useUser - user data:", user);
  console.log("useUser - isLoading:", isLoading);
  console.log("useUser - error:", error);

  return { 
    isLoading, 
    user, 
    error,
    isError,
    refetch 
  };
}