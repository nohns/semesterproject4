/** @format */

import { useMutation } from "@tanstack/react-query";

import { client } from "../axios/axios";
import { Beverage } from "../types/beverage";

//Put ID in the path
export interface PutBeverageRequest {
  //Beverage in the body
  beverage: Beverage;
}

export interface PutBeverageResponse {
  beverage: Beverage;
}

const putBeverage = async (data: PutBeverageRequest) => {
  return await client.put<PutBeverageResponse>(
    `/beverages/${data.beverage.beverageId}`,
    data.beverage
  );
};

export const usePutBeverage = () => {
  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: PutBeverageRequest) => putBeverage(data),
  });
};
