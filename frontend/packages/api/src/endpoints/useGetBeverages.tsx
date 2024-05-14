/** @format */

import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { client } from "../axios/axios";
import { Beverage } from "../types/beverage";

const getBeverages = async (): Promise<Beverage[]> => {
  const response: AxiosResponse<Beverage[]> =
    await client.get<Beverage[]>("/beverages");
  return response.data;
};

export const useGetBeverages = () => {
  const { data, isLoading, error } = useQuery<Beverage[]>({
    queryKey: ["beverages"],
    queryFn: getBeverages,
  });

  return { data, isLoading, error };
};
