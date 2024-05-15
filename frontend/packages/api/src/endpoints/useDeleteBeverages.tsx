/** @format */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../axios/axios";

// Delete ID in the path
export interface DeleteBeverageRequest {
  id: string;
}

export interface DeleteBeverageResponse {}

const deleteBeverage = async (data: DeleteBeverageRequest) => {
  return await client.delete<DeleteBeverageResponse>(`/beverages/${data.id}`);
};

export const useDeleteBeverage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: DeleteBeverageRequest) => deleteBeverage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
};
