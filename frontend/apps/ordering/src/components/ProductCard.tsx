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
  handleProductClick: (product: Product) => void;
}

function ProductCard({
  product,
  handleProductClick,
}: ProductCardProps): JSX.Element {
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
          <h1 className="font-mono text-4xl">{product.name}</h1>
          <h3 className="font-thin mb-2">{product.description}</h3>

          <span className="line-through text-gray-600 text-center font-mono">
            {product.originalPrice.toFixed(0)} kr
          </span>
          <Button
            className="font-mono"
            onClick={() => handleProductClick(product)}
          >
            {product.currentPrice.toFixed(0)} kr
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
