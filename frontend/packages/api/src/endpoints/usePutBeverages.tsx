/** @format */

import { useMutation } from "@tanstack/react-query";
import { client } from "../axios/axios";
import { Beverage } from "../types/beverage";

// Put ID in the path
export interface PutBeverageRequest {
  // Beverage in the body
  beverage: Beverage;
}

export interface PutBeverageResponse {
  beverage: Beverage;
}

const putBeverage = async (data: PutBeverageRequest) => {
  const { beverage } = data;

  const beverageDto = {
    name: beverage.name,
    description: beverage.description,
    imageSrc: beverage.imageSrc,
    basePrice: beverage.basePrice,
    maxPrice: beverage.maxPrice,
    minPrice: beverage.minPrice,
    isActive: beverage.isActive,
  };

  console.log("Data being sent:", beverageDto);

  return await client.put<PutBeverageResponse>(
    `beverages/${beverage.beverageId}`,
    beverageDto
  );
};

export const usePutBeverage = () => {
  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: PutBeverageRequest) => putBeverage(data),
  });
};
