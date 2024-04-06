/** @format */

import ProductCard from "@/components/ProductCard";
import { FooBar, Apple, Google } from "@repo/ui";
import React from "react";

import { Ampersands } from "Lucide-react";

function Selection() {
  const test = [1, 2, 3, 4, 5];

  return (
    <>
      <div className="flex flex-col items-center max-w-full overflow-hidden">
        <FooBar />

        <div className="flex flex-col items-center w-full gap-6">
          {test.map((item) => (
            <React.Fragment key={item}>
              <ProductCard />
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col mt-4  border-t w-full items-center ">
          <span className="font-mono font-light mt-4 text-xs my-auto">
            Supported methods for payment
          </span>
          {/*      <span className="font-mono font-extralight text-xs">
            Supported methods for payment
          </span> */}
          <div className="flex flex-row justify-center  w-full gap-x-8">
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
