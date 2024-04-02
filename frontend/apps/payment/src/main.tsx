/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { ProductCard } from "@repo/ui/productCard";
import { productsMock } from "@repo/ui/data/productsMock";
import "./index.css"; // Import your own css
import "@repo/ui/styles.css"; // import the ui css

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <div>
      <h1 className="text-red-500 text-9xl">Min payment service :)</h1>
      <Card />
      <Button variant="outline">Knaaaap</Button>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productsMock.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </React.StrictMode>
);

