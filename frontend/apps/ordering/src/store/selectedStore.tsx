/** @format */

import { Beverage } from "@repo/api/index";
import { create } from "zustand";

//Create interface for the selected store
interface SelectedStore {
  beverage: Beverage | null;
  priceHistory: any[];
  setBeverage: (beverage: any) => void;
  setPriceHistory: (priceHistory: any[]) => void;
}

const useSelectedStore = create<SelectedStore>((set) => ({
  beverage: null,
  priceHistory: [],
  setBeverage: (beverage) => set({ beverage }),
  setPriceHistory: (priceHistory) => set({ priceHistory }),
}));

export default useSelectedStore;
