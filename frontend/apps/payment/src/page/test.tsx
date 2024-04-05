import React from "react";
import { Button } from "@/components/ui/button";
import { useWebsocket } from "@repo/api";
import { ProductCard, ProductProps, productsMock, FooBar } from "@repo/ui";

function Test() {
  const { isConnected } = useWebsocket("ws://localhost:9090/ws");

  return (
    <div>
      <header className="flex justify-between items-center p-4">
        <FooBar />
      {/*{isConnected ? <p>Connected</p> : <p>Not connected</p>}*/}
      </header>
      <main>
        {/*<h1>Payment UI</h1>*/}
        {/*<Button>Test</Button>*/}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* This makes the images stack vertically on smaller screens */}
          {productsMock.map((product: ProductProps) => (
            <React.Fragment key={product.id}>
              <ProductCard product={product} />
            </React.Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Test;
