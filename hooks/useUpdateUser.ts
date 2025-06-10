import { useMutation } from "@tanstack/react-query";
import { UserAPI } from "@/api/services/UserService";

interface UpdateUserParams {
  id: string;
  data: any;
  file?: FormData;
}

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, data, file }: UpdateUserParams) =>
      UserAPI.updateUser(id, data, file),
  });
};