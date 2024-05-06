/** @format */

import { useQuery } from "@tanstack/react-query";

import { client } from "../axios/axios";

//GET
export interface GetBeverageRequest {}

export interface GetBeverageResponse {
  beverages: Beverage[];
}

const getBeverages = async () => {
  return await client.get<GetBeverageResponse>("/beverages");
};

export const useGetBeverages = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["beverages"],
    queryFn: () => getBeverages(),
  });

  return { data, isLoading, error };
};
