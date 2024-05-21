import { Order } from "@/model/order";
import { Beverage } from "@repo/api";
import { Price } from "@repo/api";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL;

interface OrderResponse {
  orderId: number;
  beverageId: number;
  beverage: Beverage;
  priceId: number;
  stripeIntentId: string | null;
  stripeClientSecret: string | null;
  quantity: number;
  time: string;
  expiry: string;
  status: number;
}

export async function fetchOrder(id: number): Promise<Order> {
  const resp = await axios.get<OrderResponse>(`${BASE_URL}/orders/${id}`);
  return orderResponseToDomain(resp.data);
}

export async function createOrder(beverageId: number): Promise<Order> {
  const resp = await axios.post<OrderResponse>(`${BASE_URL}/orders`, {
    beverageId,
  });
  return orderResponseToDomain(resp.data);
}

type PricesResponse = {
  id: number;
  amount: number;
  timestamp: string;
  beverageId: number;
}[];

export async function fetchOrderPrices(orderId: number): Promise<Price[]> {
  const resp = await axios.get<PricesResponse>(
    `${BASE_URL}/orders/${orderId}/prices`,
  );
  return resp.data.map<Price>(({ timestamp, ...price }) => ({
    ...price,
    timestamp: forceUtc(timestamp),
  }));
}

export async function processOrder(
  orderId: number,
  quantity: number,
): Promise<Order> {
  const resp = await axios.post<OrderResponse>(
    `${BASE_URL}/orders/${orderId}/process`,
    {
      quantity,
    },
  );
  return orderResponseToDomain(resp.data);
}

function orderResponseToDomain(respData: OrderResponse): Order {
  return {
    ...respData,
    expiry: forceUtc(respData.expiry),
    time: forceUtc(respData.time),
  };
}

function forceUtc(dateStr: string) {
  if (dateStr.includes("Z")) {
    return new Date(dateStr);
  }
  return new Date(dateStr + "Z");
}