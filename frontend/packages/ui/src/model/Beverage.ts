export interface Beverage {
  id: string;
  name: string;
  delta: number;
  deltaPct: number;
  prices: BeveragePrice[];
}

export interface BeveragePrice {
  date: Date;
  price: number;
}
