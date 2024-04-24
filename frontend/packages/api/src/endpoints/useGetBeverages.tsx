/** @format */

import { useQuery } from "@tanstack/react-query";

import { client } from "../axios/axios";

export interface GetBeverageResponse {
  beverages: Beverage[];
}

//Import this from somewhere else probaly
interface Beverage {}

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
