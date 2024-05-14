/** @format */

import { useQuery } from "@tanstack/react-query";

import { client } from "../axios/axios";

//GET
export interface GetBeverageRequest {}

export interface GetBeverageResponse {
  beverages: Beverage[];
}

const getBeverages = async () => {
  const response = await client.get<GetBeverageResponse>("/beverages");
  console.log(response.data);
  return response;
};

export const useGetBeverages = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["beverages"],
    queryFn: () => getBeverages(),
    select: (data) => data.data, 
  });

  return { data, isLoading, error };
};
