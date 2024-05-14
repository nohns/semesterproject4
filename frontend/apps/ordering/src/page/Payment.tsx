/** @format */

import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51PDTdFKZetYTOPv9c33nH1XHOD3aCvfEvnMjVHoHjS75xhoHdXbsNAO7V4V6sP4EnYk2JQlZzDE8SSZemUML72tS00JXrXClGv",
);

interface PaymentProps {
  price: number;
}

function Payment({ price }: PaymentProps) {
  const [noWallet, setNoWallet] = useState(false);

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: Number((price * 100).toFixed(0)),
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
