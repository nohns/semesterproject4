/** @format */

import { useEffect, useRef, useState, useCallback } from "react";

export const DEFAULT_HEARTBEAT = {
  message: "ping",
  timeout: 60000, // Time to wait for a pong response
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

export const useWebsocket = (url: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [histories, setHistories] = useState<History[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  // Function to start the heartbeat
  const startHeartbeat = useCallback(() => {
    const { interval, message } = DEFAULT_HEARTBEAT;

    const heartbeatInterval = setInterval(() => {
      sendMessage(message);
      // Reset the heartbeat timeout every time a ping message is sent
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
      heartbeatTimeoutRef.current = setTimeout(() => {
        console.error("Heartbeat failed: closing socket");
        wsRef.current?.close();
      }, DEFAULT_HEARTBEAT.timeout);
    }, interval);

    return () => clearInterval(heartbeatInterval);
  }, [sendMessage]);

  useEffect(() => {
    const socket = new WebSocket(url);

    // Handle incoming messages received from backend
    const onStructuredMsg = (msg: Message) => {
      switch (msg.kind) {
        case "priceHistories":
          //console.log("Price Histories");
          setHistories(msg.data);
          break;
        case "priceUpdate":
          //console.log(msg.data);
          setHistories((prevHistories) => {
            //console.log(prevHistories.length); // should print the updated length

            const updatedHistories = prevHistories.map((history) => {
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

            return updatedHistories;
          });
          break;
      }
    };

    socket.onopen = () => {
      console.log("Connection established");
      setIsConnected(true);
      startHeartbeat();
    };

    socket.onmessage = (event) => {
      // Reset the heartbeat timeout if a pong message is received
      if (event.data === "pong" && heartbeatTimeoutRef.current) {
        console.log("Pong received");
        clearTimeout(heartbeatTimeoutRef.current);
      } else {
        //console.log("Message received:", event.data);
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
      setIsConnected(false);
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    wsRef.current = socket;

    // Close connection when component unmounts
    return () => {
      socket.close();
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
    };
  }, [url, startHeartbeat]);

  return { histories, isConnected };
};
