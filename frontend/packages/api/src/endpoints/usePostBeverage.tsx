import { useMutation } from "@tanstack/react-query";
import { client } from "../axios/axios";
import { BeverageDTO } from "../types/beverage";

export interface PostBeverageRequest {
  file: File;
  beverage: Omit<Beverage, "beverageId" | "imageSrc" | "totalSales" | "prices">;
}

export interface PostBeverageResponse {
  beverage: BeverageDTO;
}

const postBeverage = async (data: PostBeverageRequest) => {
  const formData = new FormData();
  formData.append("File", data.file);
  formData.append("Name", data.beverage.name);
  formData.append("Description", data.beverage.description);
  formData.append("BasePrice", data.beverage.basePrice.toString());
  formData.append("MinPrice", data.beverage.minPrice.toString());
  formData.append("MaxPrice", data.beverage.maxPrice.toString());
  formData.append("Active", data.beverage.isActive.toString());

  return await client.post<PostBeverageResponse>(
    "/beverages/withImage",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const usePostBeverage = () => {
  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: PostBeverageRequest) => postBeverage(data),
  });
};
