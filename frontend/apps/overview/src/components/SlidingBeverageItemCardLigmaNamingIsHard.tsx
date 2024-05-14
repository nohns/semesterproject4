import { Card, CardTitle, CardDescription, Chart } from "@repo/ui";
import { BeveragePrice } from "../../../../packages/ui/src/model/Beverage";
import { History } from "@repo/api";

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

  return (
    <Card className="grid grid-cols-3 items-center max-w-2xl h-20">
      <CardTitle className="pl-4">{history.beverage.name}</CardTitle>
      <div className="flex justify-center">
        <Chart prices={displayedBeveragePrices} minimal />
      </div>
      <CardDescription className="pr-4 text-right">
        Price: {displayedBeveragePrices.at(0)?.price} kr
      </CardDescription>
    </Card>
  );
}
