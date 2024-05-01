/** @format */

import { useMutation } from "@tanstack/react-query";

import { client } from "../axios/axios";

export interface PostBeverageRequest {
  beverage: Beverage;
}

export interface PostBeverageResponse {
  beverage: Beverage;
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
