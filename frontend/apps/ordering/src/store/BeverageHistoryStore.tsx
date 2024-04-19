/** @format */
import { create } from "zustand";
import { History } from "@repo/api";

export interface BeverageHistoryStore {
  histories: History[];
  isConnected: boolean;
}

const useBeverageHistoryStore = create<BeverageHistoryStore>((set) => ({
  histories: [],
  isConnected: false,
}));
