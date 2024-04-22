/** @format */

import {
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  ConfirmationToken,
  StripeElementsOptions,
  StripeError,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementOptions,
} from "@stripe/stripe-js";
import { useState } from "react";

interface StripeCheckoutProps {
  setNoWallet: (value: boolean) => void;
}

//Todo: stripe is cursed
function StripeCheckout({ setNoWallet }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");

  const onConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe) {
      // Stripe.js hasn't loaded yet.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error: submitError } = await elements!.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      return;
    }

    // Create a ConfirmationToken using the details collected by the Express Checkout Element
    const { error, confirmationToken } = (await stripe.createPaymentMethod({
      elements,
      params: {
        payment_method_data: {
          billing_details: {
            name: "Jenny Rosen",
          },
        },
        return_url: "https://example.com/order/123/complete",
      },
    })) as { error: StripeError; confirmationToken: ConfirmationToken };

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the ConfirmationToken. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message!);
    }

    // Send the ConfirmationToken ID to your server for additional logic and attach the ConfirmationToken
    const res = await fetch("/create-intent", {
      method: "POST",
      body: confirmationToken.id,
    });
    const { client_secret: clientSecret } = await res.json();

    // Confirm the PaymentIntent
    const { error: confirmError } = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        confirmation_token: confirmationToken.id,
      },
    });

    if (confirmError) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(confirmError.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }
  };

  const options: StripeElementsOptions = {
    amount: 1,
    mode: "payment",
    currency: "dkk",
  };

  const option: StripeExpressCheckoutElementOptions = {
    wallets: {
      applePay: "always",
      googlePay: "always",
    },
  };

  return (
    <>
      <ExpressCheckoutElement
        onConfirm={onConfirm}
        onLoadError={(error) => {
          console.log("Error loading express checkout", error);
          setNoWallet(true);
        }}
        options={option}
      />
    </>
  );
}

export default StripeCheckout;
