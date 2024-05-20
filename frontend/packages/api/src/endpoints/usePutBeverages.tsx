import { useMutation } from "@tanstack/react-query";
import { client } from "../axios/axios";
import { Beverage } from "../types/beverage";

export interface PutBeverageRequest {
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
    basePrice: beverage.basePrice,
    maxPrice: beverage.maxPrice,
    minPrice: beverage.minPrice,
    buyMultiplier: beverage.buyMultiplier,
    halfTime: beverage.halfTime,
    isActive: beverage.isActive,
  };

  console.log("Data being sent:", beverageDto);

  try {
    return await client.put<PutBeverageResponse>(
      `beverages/${beverage.beverageId}`,
      beverageDto
    );
  } catch (error) {
    console.error("Error updating beverage:", error);
    throw error;
  }
};

export const usePutBeverage = () => {
  return useMutation({
    mutationKey: ["beverages"],
    mutationFn: (data: PutBeverageRequest) => putBeverage(data),
  });
};
