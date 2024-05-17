/** @format */

import { Card, Chart } from "@repo/ui";
import { BeveragePrice } from "../../../../packages/ui/src/model/Beverage";
import { History } from "@repo/api";
import { cn } from "../../../../packages/ui/src/lib/utils";
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";

interface BeverageCardProps {
  history: History;
}

export default function SlidingBeverageItemCardLigmaNamingIsHard({
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
    <Card className="grid grid-cols-3 grid-rows-3 max-w-2xl h-32 p-2 w-52">
      <p className="col-start-1 col-span-3 row-start-1 row-span-1 flex justify-between ">
        <span className="text-xl font-semibold">{history.beverage.name}</span>
        <div className="flex flex-col items-end">
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
            {isRising && <ArrowTopRightIcon className="w-5 h-5" />}
            {!isRising && <ArrowBottomRightIcon className="w-5 h-5" />}
            {percentage.toFixed(2).replace("-", "")} %
          </span>
        </div>
      </p>

      <div className="flex flex-col col-start-1 col-end-4 gap-2 p-2 row-start-2 row-end-4 relative">
        <Chart prices={displayedBeveragePrices} minimal />
      </div>
    </Card>
  );
}
