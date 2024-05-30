/** @format */

import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { client } from "../axios/axios";
import { Beverage, Price } from "@/types/beverage";
import { Order } from "@/types/order";

export interface GetOrderResponse {
  orderId: number;
  beverageId: number;
  beverage: Beverage;
  priceId: number;
  price: Price;
  stripeIntentId: string | null;
  stripeClientSecret: string | null;
  quantity: number;
  time: string;
  expiry: string;
  status: 0 | 1 | 2;
}

export function orderResponseToDomain(respData: GetOrderResponse): Order {
  return {
    ...respData,
    expiry: forceUtc(respData.expiry),
    time: forceUtc(respData.time),
  };
}

export function forceUtc(dateStr: string) {
  if (dateStr.includes("Z")) {
    return new Date(dateStr);
  }
  return new Date(dateStr + "Z");
}

const getOrder = async (orderId: number): Promise<Order> => {
  const response: AxiosResponse<GetOrderResponse> =
    await client.get<GetOrderResponse>(`/Orders/${orderId}`);
  return orderResponseToDomain(response.data);
};

export const useGetOrder = (orderId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });

  return { data, isLoading, error };
};
