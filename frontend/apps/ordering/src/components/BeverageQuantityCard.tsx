/** @format */

import { Beverage } from "@repo/api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BeverageCardProps {
  beverage: Beverage;
}

function BeverageQuantityCard({ beverage }: BeverageCardProps): JSX.Element {
  return (
    <Card className="full">
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
          {/* <h3 className="font-thin mb-2">{beverage.description}</h3> */}
          <div className="flex flex-row justify-center items-center">
            <Button className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center mr-2">
              <span className="text-xl">-</span>
            </Button>
            <span className="font-mono text-4xl">1</span>
            <Button className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center ml-2">
              <span className="text-xl">+</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BeverageQuantityCard;
