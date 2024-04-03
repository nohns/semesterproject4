/** @format */
import React from "react";
import { Button } from "@/components/ui/button";
import { useWebsocket } from "@repo/api";
import { ProductCard, ProductProps, productsMock } from "@repo/ui";

function Test() {
  useWebsocket();

  return (
    <div>
      <h1>Test</h1>
      <Button>Test</Button>

      <div className="flex flex-row">
        {productsMock.map((product: ProductProps) => (
          <React.Fragment key={product.id}>
            <ProductCard product={product} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Test;
