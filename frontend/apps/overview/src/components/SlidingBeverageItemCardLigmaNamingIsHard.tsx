import { Card, CardTitle, CardDescription, Chart } from "@repo/ui";

interface Beverage {
  name: string;
  imageSrc: string;
  price: number;
}

interface BeverageCardProps {
  item: Beverage;
}

export default function SlidingBeverageItemCardLigmaNamingIsHard({
  item,
}: BeverageCardProps): JSX.Element {
  return (
    <Card className="grid grid-cols-3 items-center max-w-2xl h-20">
      <CardTitle className="pl-4">{item.name}</CardTitle>
      <div className="flex justify-center">
        <Chart
          prices={[
            { date: new Date("2023-01-01T01:00:00"), price: 100 },
            { date: new Date("2023-01-01T03:00:00"), price: 105 },
            { date: new Date("2023-01-01T05:00:00"), price: 150 },
            { date: new Date("2023-01-01T07:00:00"), price: 200 },
            { date: new Date("2023-01-01T09:00:00"), price: 100 },
            { date: new Date("2023-01-01T11:00:00"), price: 100 },
            { date: new Date("2023-01-01T13:00:00"), price: 200 },
            { date: new Date("2023-01-01T17:00:00"), price: 150 },
            { date: new Date("2023-01-01T18:00:00"), price: 101 },
          ]}
          minimal
        />
      </div>
      <CardDescription className="pr-4 text-right">
        Price: {item.price} kr
      </CardDescription>
    </Card>
  );
}
