/** @format */
import React from "react";
import { Button } from "@/components/ui/button";
import { useWebsocket } from "@repo/api";
import { ProductCard, ProductProps, productsMock } from "@repo/ui";

function Test() {
  const { isConnected } = useWebsocket("ws://localhost:9090/ws");

  return (
    <div>
      {isConnected ? <p>Connected</p> : <p>Not connected</p>}
      <h1>Pricing overview react app</h1>

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
