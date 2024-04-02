/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import "./index.css"; //Import our own css
import "@repo/ui/styles.css"; //import the ui css

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <h1 className="text-red-500 text-9xl">Min payment service :)</h1>
    <Card />
    <Button variant="outline">Knaaaap</Button>
  </React.StrictMode>
);
