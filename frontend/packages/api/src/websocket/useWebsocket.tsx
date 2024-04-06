/** @format */

import { useEffect, useRef, useState, useCallback } from "react";

export const DEFAULT_HEARTBEAT = {
  message: "ping",
  timeout: 60000, // Time to wait for a pong response
  interval: 25000, // Interval at which to send ping messages
};

//

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  timeStamp: string;
}

export const useWebsocket = (url: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<Product>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to send messages
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
        console.log("Message received:", event.data);
        setMessage(event.data);
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

  return { message, isConnected };
};
