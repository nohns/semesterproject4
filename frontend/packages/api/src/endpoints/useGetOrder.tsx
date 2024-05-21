/** @format */

import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { client } from "../axios/axios";
import { Beverage, Price } from "@/types/beverage";

//Pending = 0
//Processing = 1
// Fulfilled = 2
interface OrderStatus {
  Pending: 0;
  Processing: 1;
  Fulfilled: 2;
}

export interface GetOrderResponse {
  orderId: number;
  beverageId: number;
  beverage: Beverage;
  priceId: number;
  price: Price;
  stripeIntentId: string;
  stripeClientSecret: string;
  quantity: number;
  time: string;
  expiry: string;
  status: OrderStatus;
}

const getOrder = async (orderId: number): Promise<GetOrderResponse> => {
  const response: AxiosResponse<GetOrderResponse> =
    await client.get<GetOrderResponse>(`/Orders/${orderId}`);
  return response.data;
};

export const useGetOrder = (orderId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });

  return { data, isLoading, error };
};
