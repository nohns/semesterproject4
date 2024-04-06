/** @format */

import ProductCard from "@/components/ProductCard";
import { FooBar, Apple, Google } from "@repo/ui";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Ampersands } from "Lucide-react";
import { useWebsocket } from "@repo/api";

function Selection() {
  const navigate = useNavigate();

  const handleProductClick = (itemId: number) => {
    navigate("/selected", { state: { itemId: itemId.toString() } });
  };

  const { isConnected, products } = useWebsocket("ws://localhost:9090/ws");

  console.log("isConnected", isConnected);
  //console.log(message[0].name);
  return (
    <>
      <div className="flex flex-col items-center max-w-full overflow-hidden min-h-[100dvh] justify-between">
        <FooBar />

        <div className="flex flex-col items-center w-full gap-6">
          {isConnected &&
            products !== null &&
            products?.map((product) => (
              <React.Fragment key={product.id}>
                {/* <div onClick={() => handleProductClick(item)}> */}{" "}
                {/*Det går ikke med en div det breaker layout du kan pass onClick functionen ind som en prop i stedet*/}
                <ProductCard product={product} />
                {/* </div> */}
              </React.Fragment>
            ))}
        </div>

        <div className="flex flex-col mt-4  border-t w-full items-center ">
          <span className="font-mono font-light mt-4 text-xs my-auto">
            Supported methods for payment
          </span>

          <div className="flex flex-row justify-center  w-full gap-x-8 ">
            <Apple />
            <Ampersands strokeWidth={"0.6"} className="my-auto w-12 h-12 " />
            <Google />
          </div>

          <span className="font-mono font-extralight text-xs border-t w-10/12 text-center py-2">
            @Copyright FooBar.dk
          </span>
        </div>
      </div>
    </>
  );
}

export default Selection;
