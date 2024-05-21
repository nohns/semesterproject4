/** @format */

interface Price {
  id: number;
  amount: number;
  timestamp: Date;
  beverageId: number;
}

interface Beverage {
  beverageId: number;
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

interface BeverageDTO {
  name: string;
  description: string;
  //imageSrc: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
}

export type { Beverage, Price, BeverageDTO };
