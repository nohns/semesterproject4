import { TrendingUp, TrendingDown } from "Lucide-react";

export default function MiniFoobar() {
  return (
    <div>
      <h1 className="flex flex-row justify-center items-center font-mono   text-5xl md:text-2xl lg:text-3xl font-semibold ">
        <TrendingUp className="inline-block text-green-500 h-7 " />
        <span className="text-green-500 ">FOO</span>
        <span className="text-red-500">BAR</span>
        {<TrendingDown className="inline-block text-red-500 h-7" />}
      </h1>
    </div>
  );
}