import { Beverage } from "@repo/api";

export interface Order {
  orderId: number;
  beverageId: number;
  beverage: Beverage;
  priceId: number;
  stripeIntentId: string | null;
  stripeClientSecret: string | null;
  quantity: number;
  time: Date;
  expiry: Date;
  status: number;
}
