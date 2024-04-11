/** @format */
import React from "react";
import { useWebsocket } from "@repo/api";
import { ProductCard, ProductProps, productsMock } from "@repo/ui";
import  NewDrinkCard from "@/components/ui/NewDrinkCard";

function ModifyBeverage() {
  const { isConnected } = useWebsocket("ws://localhost:9090/ws");

  return (
    <div>
      {isConnected ? <p>Connected</p> : <p>Not connected</p>}
      <h1>Bartender react app</h1>

      <NewDrinkCard />
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

export default ModifyBeverage;
