import { cn } from "@/lib/utils";
import { Order } from "@/model/order";
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Price } from "@repo/api";
import { Chart } from "@repo/ui";
import { BeveragePrice } from "@repo/ui/model/Beverage";
import { useMemo } from "react";
import TotalAndPayment from "./TotalAndPayment";

interface OrderOverviewProps {
  order: Order;
  prices: Price[];
}

export default function OrderOverview({ order, prices }: OrderOverviewProps) {
  const beveragePrices: BeveragePrice[] | undefined = useMemo(() => {
    return prices.slice(Math.max((prices.length ?? 0) - 20, 0)).map((price) => {
      return {
        date: new Date(price.timestamp),
        price: parseFloat(price.amount.toFixed(2)),
      };
    });
  }, [prices]);

  const firstPrice = prices?.at(0);
  const lastPrice = prices?.at(-1);
  const isRising =
    firstPrice && lastPrice && firstPrice!.amount < lastPrice!.amount;
  const percentage =
    firstPrice && lastPrice
      ? ((lastPrice!.amount - firstPrice!.amount) / firstPrice!.amount) * 100
      : 0;

  return (
    <div>
      <header className="flex flex-col gap-2">
        <div>
          <h2 className="text-5xl font-semibold mt-2">{order.beverage.name}</h2>
        </div>

        <div
          className={cn("flex flex-col", {
            "text-green-500": isRising,
            "text-red-500": !isRising,
          })}
        >
          <p className="text-2xl font-semibold">
            {lastPrice && lastPrice.amount.toFixed(2) + " DKK"}
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

      <div className="grow h-60">
        <Chart prices={beveragePrices!} />
      </div>

      {lastPrice && <TotalAndPayment price={lastPrice.amount} order={order} />}
    </div>
  );
}
