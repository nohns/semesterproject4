/** @format */

import { TrendingUp, TrendingDown } from "lucide-react";

export function FooBar() {
  return (
    <>
      <h1 className="flex flex-row justify-center items-center font-mono  bg-white w-10/12 border-b mb-8 pb-2  text-5xl  md:text-6xl lg:text-7xl font-semibold ">
        <TrendingUp className="inline-block text-green-500 h-12 w-12 " />
        <span className="text-green-500 ">FOO</span>
        <span className="text-red-500">BAR</span>
        <TrendingDown className="inline-block text-red-500 h-12 w-12 " />
      </h1>
    </>
  );
}
