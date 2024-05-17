/** @format */

import { Beverage, HistoryEntry } from "@repo/api";
import { Button, Card } from "@repo/ui";

interface BeverageCardProps {
  beverage: Beverage;
  history: HistoryEntry[];
  handleBeverageClick: (
    beverage: Beverage,
    priceHistory: HistoryEntry[]
  ) => void;
}

function BeverageCard({
  beverage,
  history,
  handleBeverageClick,
}: BeverageCardProps): JSX.Element {
  return (
    <Card className="w-10/12 max-w-[600px]">
      <div className="flex flex-row justify-center items-center p-4">
        <img
          alt="Beverage Image"
          className="aspect-square object-cover w-1/3"
          height={200}
          //src={beverage.imageSrc}
          src={beverage.imageSrc}
          width={200}
          onError={(e) => {
            e.currentTarget.src =
              "https://c.tenor.com/ZAMoMuQgf9UAAAAC/tenor.gifv";
            e.currentTarget.style.borderRadius = "50%";
          }} // Replace with your fallback URL
        />

        <div className="flex flex-col w-2/3  ">
          <h1 className="font-mono text-4xl">{beverage.name}</h1>
          <h3 className="font-thin mb-2">{beverage.description}</h3>
          <Button
            className="font-mono"
            onClick={() => handleBeverageClick(beverage, history)}
          >
            {history[history.length - 1].price.toFixed(2)} kr
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default BeverageCard;
