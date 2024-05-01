/** @format */

import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, TooltipProvider } from "@repo/ui";
import { ReactQueryClientProvider } from "@repo/api";
import {
  Navigate,
  BrowserRouter,
  Route,
  Routes as RouterRoutes,
} from "react-router-dom";

import "@repo/ui/styles";
import "./index.css"; // Import your own css

import Admin from "./page/Admin";
import Login from "./page/Login";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={100}>
        <ReactQueryClientProvider>
          <BrowserRouter>
            <RouterRoutes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </RouterRoutes>
          </BrowserRouter>
        </ReactQueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
);
