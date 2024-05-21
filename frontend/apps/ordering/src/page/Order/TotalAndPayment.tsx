import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import Payment from "../Payment";
import { Order } from "@/model/order";

interface TotalAndPaymentProps {
  price: number;
  order: Order;
}

export default function TotalAndPayment({
  price,
  order,
}: TotalAndPaymentProps) {
  const [quantity, setQuantity] = useState(1);
  const total = quantity * price;

  return (
    <div className="py-4">
      <div className="flex flex-col gap-2">
        <div className=" flex justify-between ">
          <span className="text-md font-bold">Antal</span>
          <span className="text-md font-bold">Total</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium">{quantity}</div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity((qty) => Math.min(8, qty + 1))}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <motion.span
            className="text-xl"
            key={quantity}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {total.toFixed(2)} DKK
          </motion.span>
        </div>
        <Payment total={total} quantity={quantity} order={order} />
      </div>
    </div>
  );
}
