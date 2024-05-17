/** @format */

import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import Selected from "./page/Selected";
import Selection from "./page/Selection";
import Receipt from "./page/Receipt";

export const Routes = () => {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <RouterRoutes>
          <Route path="/" element={<Selection />} />
          <Route path="/selected" element={<Selected />} />;
          <Route path="/receipt" element={<Receipt />} />;
          <Route path="*" element={<Selection />} />
        </RouterRoutes>
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default Routes;
