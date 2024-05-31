/** @format */

import Marquee from "react-fast-marquee";
import { Chart, FooBar } from "@repo/ui";

import { History } from "@repo/api";
import { BeveragePrice } from "../../../../packages/ui/src/model/Beverage";
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { cn } from "../../../../packages/ui/src/lib/utils";
import SlidingBeverageItem from "@/components/SlidingBeverageItem";

type OverviewProps = {
  histories: History[];
  displayedBeverage: History;
};

function Overview({ displayedBeverage, histories }: OverviewProps) {
  const displayedBeveragePrices: BeveragePrice[] = displayedBeverage.prices
    .slice(Math.max(displayedBeverage.prices.length - 20, 0))
    .map((price) => {
      return {
        date: new Date(price.at),
        price: parseFloat(price.price.toFixed(2)),
      };
    });
  const firstPrice = displayedBeveragePrices.at(0);
  const lastPrice = displayedBeveragePrices.at(-1);
  const isRising = firstPrice!.price < lastPrice!.price;
  const percentage =
    ((lastPrice!.price - firstPrice!.price) / firstPrice!.price) * 100;

  return (
    <div className="h-screen flex flex-col font-mono">
      <div className="flex flex-none justify-center" style={{ height: "15%" }}>
        <FooBar />
      </div>
      <header className="flex flex-col gap-2 px-8">
        <div>
          <h2 className="text-5xl font-semibold">
            {displayedBeverage.beverage.name}
          </h2>
        </div>
        <div
          className={cn("flex flex-col", {
            "text-green-500": isRising,
            "text-red-500": !isRising,
          })}
        >
          <p className="text-2xl font-semibold">
            {lastPrice && lastPrice.price.toFixed(2) + " DKK"}
          </p>
          <p className="text-lg flex gap-2 items-center">
            {isRising && <ArrowTopRightIcon className="w-6 h-6" />}
            {!isRising && <ArrowBottomRightIcon className="w-6 h-6" />}
            <span>
              {isRising ? "+" : ""}
              {percentage.toFixed(2)} %
            </span>
          </p>
        </div>
      </header>

      <div className="flex flex-grow px-8" style={{ height: "60%" }}>
        <Chart
          key={displayedBeverage.beverage.beverageId}
          prices={displayedBeveragePrices}
        />
      </div>
      <div className="flex flex-none" style={{ height: "20%" }}>
        <Marquee speed={50} pauseOnHover={true}>
          {histories?.map((item, index) => (
            <SlidingBeverageItem key={index} history={item} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default Overview;
