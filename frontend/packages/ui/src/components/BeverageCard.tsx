/** @format */

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Beverage } from "@repo/api";

export interface BeverageCardProps {
  beverage: Beverage;
  handleBeverageClick: (beverage: Beverage) => void;
}

export function BeverageCard({
  beverage,
  handleBeverageClick,
}: BeverageCardProps): JSX.Element {
  return (
    <Card className="w-10/12 ">
      <div className="flex flex-row justify-center items-center p-4">
        <img
          alt="Beverage Image"
          className="aspect-square object-cover w-1/3"
          height={200}
          src={beverage.imageSrc}
          width={200}
        />
        <div className="flex flex-col w-2/3  ">
          <h1 className="font-mono text-4xl">{beverage.name}</h1>
          <h3 className="font-thin mb-2">{beverage.description}</h3>

          <span className="line-through text-gray-600 text-center font-mono">
            {0} kr
          </span>
          <Button
            className="font-mono"
            onClick={() => handleBeverageClick(beverage)}
          >
            {0} kr
          </Button>
        </div>
      </div>
    </Card>
  );
}
