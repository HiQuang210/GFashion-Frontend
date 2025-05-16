import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/services/auth";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, data, file }) => updateUser({ id, data, file }),
  });
};
