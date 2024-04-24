/** @format */

import { Beverage } from "@repo/api";
import { create } from "zustand";

interface HistoryStore {
  history: Beverage[];
  setHistory: (history: Beverage[]) => void;
}

const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
}));

export default useHistoryStore;
