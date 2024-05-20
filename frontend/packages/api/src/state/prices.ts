import { create } from "zustand";

export const DEFAULT_HEARTBEAT = {
  message: "ping",
  timeout: 5000, // Time to wait for a pong response
  interval: 25000, // Interval at which to send ping messages
};

export interface Beverage {
  beverageId: string;
  name: string;
  description: string;
  imageSrc: string;
}

export interface History {
  beverage: Beverage;
  prices: HistoryEntry[];
}

export interface HistoryEntry {
  price: number;
  at: string; // ISO 8601 timestamp
}

export interface PriceUpdate {
  beverageId: string;
  price: number;
  at: string; // ISO 8601 timestamp
}

type MessageKind = "priceHistories" | "priceUpdate";
type GenericMessage<K extends MessageKind, D> = {
  kind: K;
  data: D;
};

export type PriceHistoriesMessage = GenericMessage<"priceHistories", History[]>;
export type PriceUpdateMessage = GenericMessage<"priceUpdate", PriceUpdate>;
type Message = PriceHistoriesMessage | PriceUpdateMessage;

function isPriceHistoriesMessage(message: any): message is Message {
  return message?.kind === "priceHistories" || message?.kind === "priceUpdate";
}

interface HistoryStore {
  history: History[];
  connected: boolean;
  listening: boolean;
  startListening: () => void;
}

const WS_URL = import.meta.env.VITE_APP_ENGINE_WS_URL;
//const WS_URL = "ws://localhost:9090/ws";

export const usePriceHistory = create<HistoryStore>((set, get) => ({
  history: [],
  connected: false,
  listening: false,
  startListening: () => {
    if (get().listening) return;
    set(() => ({ listening: true }));

    const socket = new WebSocket(WS_URL);
    let heartbeatIntervalHandle: NodeJS.Timeout | undefined; // For keep sending heartbeats continously, keeping conneciton alive
    let heartbeatTimeoutHandle: NodeJS.Timeout | undefined; // For connection to close after timeout (connection dead?)

    const sendMessage = (message: string) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    };

    const closeSocket = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (heartbeatIntervalHandle) {
        clearInterval(heartbeatIntervalHandle);
        heartbeatIntervalHandle = undefined;
      }
      set(() => ({ connected: false }));
    };

    // Start heartbeat send on a specific interval to keep connection alive
    // and timeout if we have not received a heartbeat in time.
    const startHeartbeat = () => {
      const { interval, timeout, message } = DEFAULT_HEARTBEAT;

      heartbeatIntervalHandle = setInterval(() => {
        sendMessage(message);
        // Reset the heartbeat timeout every time a ping message is sent
        if (heartbeatTimeoutHandle) {
          clearTimeout(heartbeatTimeoutHandle);
          heartbeatTimeoutHandle = undefined;
        }
        heartbeatTimeoutHandle = setTimeout(() => {
          //      console.error("Heartbeat failed: closing socket");
          //       closeSocket();
        }, timeout);
      }, interval);
    };

    // Handle incoming messages received from backend
    const onStructuredMsg = (msg: Message) => {
      switch (msg.kind) {
        case "priceHistories":
          console.log("Price Histories");
          set(() => ({ history: msg.data }));
          break;
        case "priceUpdate":
          console.log(msg.data);
          set((old) => {
            console.log(old.history.length); // should print the updated length

            const updatedHistories = old.history.map((history) => {
              if (history.beverage.beverageId === msg.data.beverageId) {
                return {
                  ...history,
                  prices: [
                    ...history.prices,
                    { price: msg.data.price, at: msg.data.at },
                  ],
                };
              }
              return history;
            });

            return {
              history: updatedHistories,
            };
          });
          break;
      }
    };

    socket.onopen = () => {
      console.log("Connection established");
      set(() => ({ connected: true }));
      startHeartbeat();
    };

    socket.onmessage = (event) => {
      // Reset the heartbeat timeout if a pong message is received
      if (event.data === "pong" && heartbeatTimeoutHandle) {
        console.log("Pong received");
        clearTimeout(heartbeatTimeoutHandle);
        heartbeatTimeoutHandle = undefined;
      } else {
        console.log("Message received:", event.data);
        try {
          const data = JSON.parse(event.data);
          if (!isPriceHistoriesMessage(data)) {
            console.error("Invalid message:", data);
            return;
          }
          onStructuredMsg(data);
        } catch (error) {
          console.error("Failed to parse event data:", error);
        }
      }
    };

    socket.onclose = () => {
      console.log("Connection closed");
      set(() => ({ connected: false }));
      if (heartbeatTimeoutHandle) {
        clearTimeout(heartbeatTimeoutHandle);
        heartbeatTimeoutHandle = undefined;
      }
      if (heartbeatIntervalHandle) {
        clearInterval(heartbeatIntervalHandle);
        heartbeatIntervalHandle = undefined;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      closeSocket();
    };
  },
}));
