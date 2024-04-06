import { Beverage } from "@/model/Beverage";

export const beverages: Beverage[] = [
  {
    id: "1",
    name: "Blå vand",
    delta: -4.93,
    deltaPct: -13.5,
    prices: [
      { date: new Date("2023-02-09 20:20:00"), price: 36.65 },
      { date: new Date("2023-02-09 20:25:00"), price: 34.5 },
      { date: new Date("2023-02-09 20:30:00"), price: 32.73 },
      { date: new Date("2023-02-09 20:35:00"), price: 30.93 },
      { date: new Date("2023-02-09 20:40:00"), price: 32.21 },
      { date: new Date("2023-02-09 20:45:00"), price: 33.97 },
      { date: new Date("2023-02-09 20:50:00"), price: 31.36 },
      { date: new Date("2023-02-09 20:55:00"), price: 29.79 },
      { date: new Date("2023-02-09 21:00:00"), price: 28.28 },
      { date: new Date("2023-02-09 21:05:00"), price: 29.99 },
      { date: new Date("2023-02-09 21:10:00"), price: 31.72 },
    ],
  },
  {
    id: "2",
    name: "Spejlæg",
    delta: 12.29,
    deltaPct: 15.7,
    prices: [
      { date: new Date("2023-02-09 20:20:00"), price: 65.43 },
      { date: new Date("2023-02-09 20:25:00"), price: 69.58 },
      { date: new Date("2023-02-09 20:30:00"), price: 72.73 },
      { date: new Date("2023-02-09 20:35:00"), price: 70.05 },
      { date: new Date("2023-02-09 20:40:00"), price: 73.21 },
      { date: new Date("2023-02-09 20:45:00"), price: 76.19 },
      { date: new Date("2023-02-09 20:50:00"), price: 74.36 },
      { date: new Date("2023-02-09 20:55:00"), price: 72.79 },
      { date: new Date("2023-02-09 21:00:00"), price: 76.28 },
      { date: new Date("2023-02-09 21:05:00"), price: 78.99 },
      { date: new Date("2023-02-09 21:10:00"), price: 77.72 },
    ],
  },
];
