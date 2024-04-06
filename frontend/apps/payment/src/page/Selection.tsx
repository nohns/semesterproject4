/** @format */

import ProductCard from "@/components/ProductCard";
import { FooBar, Apple, Google } from "@repo/ui";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Ampersands } from "Lucide-react";
import { Product, useWebsocket } from "@repo/api";
import MobileContainer from "@/components/MobileContainer";

function Selection() {
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    console.log("Clicked");
    navigate("/selected", { state: { product } });
  };

  const { isConnected, products } = useWebsocket("ws://localhost:9090/ws");

  console.log("isConnected", isConnected);
  //console.log(message[0].name);
  return (
    <>
      <MobileContainer>
        <div className="flex flex-col items-center w-full gap-6">
          {/*Loading screen*/}
          {!isConnected ||
            (products.length === 0 && (
              <div className="flex flex-col justify-center items-center">
                <div className="loader" />
                <span className="font-mono text-xs">
                  Indlæser blå vand opskriften
                </span>
              </div>
            ))}

          {/*All drinks spawned*/}
          {isConnected &&
            products !== null &&
            products?.map((product) => (
              <React.Fragment key={product.id}>
                <ProductCard
                  product={product}
                  handleProductClick={handleProductClick}
                />
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
      </MobileContainer>
    </>
  );
}

export default Selection;
