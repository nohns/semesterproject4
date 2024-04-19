/** @format */

import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";

import { useWebsocket } from "@repo/api";
import { AnimatePresence } from "framer-motion";
import Selection from "./page/Selection";
import Selected from "./page/Selected";

const Routes = () => {
  const { isConnected, histories } = useWebsocket("ws://localhost:9090/ws");

  return (
    <AnimatePresence mode="wait">
      <RouterRoutes>
        <Route
          path="/"
          element={
            <Selection isConnected={isConnected} histories={histories} />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/selected" element={<Selected />} />
      </RouterRoutes>
    </AnimatePresence>
  );
};

export default Routes;
