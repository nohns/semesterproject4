/** @format */

interface Price {
  amount: number;
  timestamp: Date;
}

interface Beverage {
  beverageId: string;
  name: string;
  description: string;
  imageSrc: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  isActive: boolean;
  buyMultiplier: number;
  halfTime: number;
  totalSales: number;
  prices: Price[];
}

export type { Beverage, Price };
