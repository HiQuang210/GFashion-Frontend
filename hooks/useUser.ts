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
  } = useQuery<UserDetailResponse>({
    queryKey: ["user", id],
    queryFn: () => {
      console.log("Calling getUserDetail with id:", id);
      return getUserDetail(id!); 
    },
    enabled: !!id, 
    retry: 2, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });

  return { 
    isLoading, 
    user, 
    error,
    isError,
    refetch 
  };
}