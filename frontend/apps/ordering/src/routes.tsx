/** @format */

import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import Selection from "./page/Selection";
import Receipt from "./page/Receipt";
import Order from "./page/Order";

export const Routes = () => {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <RouterRoutes>
          <Route path="/" element={<Selection />} />
          <Route path="/order/:orderId" element={<Order />} />;
          <Route path="/receipt/:orderId" element={<Receipt />} />;
        </RouterRoutes>
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default Routes;
