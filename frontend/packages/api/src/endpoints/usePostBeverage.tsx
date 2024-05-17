/** @format */

import { useMutation } from "@tanstack/react-query";

import { client } from "../axios/axios";
import { BeverageDTO } from "../types/beverage";

export interface PostBeverageRequest {
  beverage: BeverageDTO;
}

export interface PostBeverageResponse {
  beverage: BeverageDTO;
}

const postBeverage = async (data: PostBeverageRequest) => {
  return await client.post<PostBeverageResponse>("/beverages", data.beverage);
};

export const usePostBeverage = () => {
  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: PostBeverageRequest) => postBeverage(data),
  });
};
