/** @format */

import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe("pk_test_4RxUQ9rE2xn8vIbplcQlCLQN");

interface PaymentProps {
  price: number;
}

function Payment({ price }: PaymentProps) {
  const [noWallet, setNoWallet] = useState(false);

  //convert price to 0 digit number
  const newPrice = Number(price.toFixed(0));
  //convert price to number

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: newPrice,
    currency: "dkk",
  };

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <StripeCheckout setNoWallet={setNoWallet} />
      </Elements>
      {noWallet && <NoWallet />}
    </>
  );
}

export default Payment;
