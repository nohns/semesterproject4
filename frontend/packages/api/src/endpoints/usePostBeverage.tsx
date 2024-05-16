/** @format */

import { useMutation } from "@tanstack/react-query";

import { client } from "../axios/axios";
import { Beverage } from "../types/beverage";

export interface PostBeverageRequest {
  file: File;
  beverage: Beverage;
}

export interface PostBeverageResponse {
  beverage: Beverage;
}

const postBeverage = async (data: PostBeverageRequest) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("beverage", JSON.stringify(data.beverage));

  return await client.post<PostBeverageResponse>("/beverages", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  //return await client.post<PostBeverageResponse>("/beverages", data.beverage);
};

export const usePostBeverage = () => {
  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: PostBeverageRequest) => postBeverage(data),
  });
};
