import { useQuery } from "@tanstack/react-query";
import { detailUser } from "@/api/services/auth";

export function useUser(id) {
  console.log("id: " + id);
  const {
    isLoading,
    data: user,
    refetch,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => {
      console.log("Calling detailUser with id:", id);
      return detailUser(id);
    },
    enabled: !!id,
  });

  console.log("use user");

  console.log(user);
  return { isLoading, user, refetch };
}
