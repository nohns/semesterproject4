/** @format */

import { Elements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import {
  ExpressCheckoutWalletsOption,
  StripeElementsOptions,
  StripeExpressCheckoutElementOptions,
  loadStripe,
} from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_4RxUQ9rE2xn8vIbplcQlCLQN");

interface StripeCheckoutProps {
  setNoWallet: (value: boolean) => void;
}

function StripeCheckout({ setNoWallet }: StripeCheckoutProps) {
  const options: StripeElementsOptions = {
    amount: 1,
    mode: "payment",
    currency: "dkk",
  };

  const wallet: ExpressCheckoutWalletsOption = {
    applePay: "always",
    googlePay: "always",
  };

  const option: StripeExpressCheckoutElementOptions = {
    wallets: wallet,
  };

  return (
    <>
      <Elements stripe={stripePromise}>
        <ExpressCheckoutElement
          onConfirm={() => {}}
          onLoadError={(error) => {
            console.log("Error loading express checkout", error);
            setNoWallet(true);
          }}
          options={option}
        />
      </Elements>
    </>
  );
}

export default StripeCheckout;
