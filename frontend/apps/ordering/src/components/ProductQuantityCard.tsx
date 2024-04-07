/** @format */

import { Product } from "@repo/api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

interface ProductCardProps {
  product: Product;
}

function ProductQuantityCard({ product }: ProductCardProps): JSX.Element {
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
          {/* <h3 className="font-thin mb-2">{product.description}</h3> */}
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

export default ProductQuantityCard;
