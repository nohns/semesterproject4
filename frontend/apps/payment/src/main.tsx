/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
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
      <div className="mt-8 grid grid-cols-1 gap-4">
        {productsMock.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </React.StrictMode>
);

