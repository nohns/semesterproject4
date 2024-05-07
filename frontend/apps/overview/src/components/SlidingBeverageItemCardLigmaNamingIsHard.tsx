import { Card, CardTitle, CardDescription } from "@repo/ui";

interface Beverage {
  name: string;
  imageSrc: string;
  price: number;
}

interface BeverageCardProps {
  item: Beverage;
}

export default function BeverageCard({ item }: BeverageCardProps): JSX.Element {
  return (
    <Card className="flex max-w-2xl h-20 items-center justify-between">
      <CardTitle className="w-1/4 pl-4">{item.name}</CardTitle>
      <div className="flex flex-grow justify-center">
        <img
          src={item.imageSrc}
          alt={item.name}
          className="w-32 h-full object-cover"
        />
      </div>
      <CardDescription className="w-1/4 pr-4 text-right">
        Price: {item.price} kr
      </CardDescription>
    </Card>
  );
}
