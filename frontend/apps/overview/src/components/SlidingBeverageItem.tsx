/** @format */

import { Card, Chart } from "@repo/ui";
import { BeveragePrice } from "../../../../packages/ui/src/model/Beverage";
import { History } from "@repo/api";
import { cn } from "../../../../packages/ui/src/lib/utils";
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";

interface BeverageCardProps {
  history: History;
}

export default function SlidingBeverageItem({
  history,
}: BeverageCardProps): JSX.Element {
  const displayedBeveragePrices: BeveragePrice[] = history.prices
    .slice(Math.max(history.prices.length - 20, 0))
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
    <Card className="flex flex-col justify-between max-w-2xl h-32 p-2 w-52 overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-md font-semibold truncate max-w-[65%]">
          {history.beverage.name}
        </span>
        <div className="flex flex-col items-end text-sm">
          <span
            className={cn("font-semibold", {
              "text-green-500": isRising,
              "text-red-500": !isRising,
            })}
          >
            {lastPrice && lastPrice.price.toFixed(2) + " DKK"}
          </span>
          <span
            className={cn("font-normal flex items-center", {
              "text-green-500": isRising,
              "text-red-500": !isRising,
            })}
          >
            {isRising && <ArrowTopRightIcon className="w-4 h-4" />}
            {!isRising && <ArrowBottomRightIcon className="w-4 h-4" />}
            {percentage.toFixed(2).replace("-", "")} %
          </span>
        </div>
      </div>

      <div className="flex-grow p-2 relative overflow-hidden">
        <Chart prices={displayedBeveragePrices} minimal />
      </div>
    </Card>
  );
}
