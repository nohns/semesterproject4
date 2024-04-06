/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  timeStamp: string;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard() {
  return (
    <Card className="w-10/12 ">
      <div className="flex flex-row justify-center items-center p-4">
        <img
          alt="Product Image"
          className="aspect-square object-cover w-1/3"
          height={200}
          src="/images/vand.jpg"
          width={200}
        />
        <div className="flex flex-col w-2/3  ">
          <h1 className="font-mono text-4xl">Blå vand</h1>
          <h3 className="font-thin mb-2">Smagen af blå og vand</h3>
          {/* <span className="text-slate-700">Består af vand og blå</span> */}

          <span className="line-through text-gray-600 text-center font-mono">
            30 kr
          </span>
          <Button className="font-mono">15 kr</Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
