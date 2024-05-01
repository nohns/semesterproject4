/** @format */

import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";

import { History, useWebsocket } from "@repo/api";
import { AnimatePresence } from "framer-motion";
//import Selection from "./page/Selection";
import Selected from "./page/Selected";
import Selection from "./page/Selection";
import { ReactNode, createContext, useContext } from "react";
import Receipt from "./page/Receipt";

interface WebSocketContextType {
  isConnected: boolean;
  histories: History[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// Component to provide WebSocket context to children
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, histories } = useWebsocket("ws://localhost:9090/ws"); // Customize this with your WebSocket URL

  return (
    <WebSocketContext.Provider value={{ isConnected, histories }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const Routes = () => {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <RouterRoutes>
            <Route path="/" element={<Selection />} />
            <Route path="/selected" element={<Selected />} />;
            <Route path="/Receipt" element={<Receipt />} />;
          </RouterRoutes>
        </AnimatePresence>
      </BrowserRouter>
    </WebSocketProvider>
  );
};

export default Routes;
