/** @format */

import { processOrder } from "@/api/order";
import { Order } from "@/model/order";
import {
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  ConfirmationToken,
  ExpressCheckoutWalletsOption,
  StripeElementsOptions,
  StripeError,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementOptions,
} from "@stripe/stripe-js";
import { useState } from "react";

interface StripeCheckoutProps {
  setNoWallet: (value: boolean) => void;
  order: Order;
  quantity: number;
}

//Todo: stripe is cursed
function StripeCheckout({ setNoWallet, order, quantity }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<StripeError | undefined>();

  /*   const option: StripeExpressCheckoutElementOptions = {
    wallets: {
      applePay: "always",
      googlePay: "always",
    },
  }; */

  const onConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) {
      // If stripe or elements is null, exit the function to avoid further errors.
      console.log("Stripe or elements is null");
      return;
    }

    const { error: submitError } = await elements?.submit()!;
    if (submitError) {
      setErrorMessage(submitError);
      return;
    }

    // Process order inorder to get Stripe client secret for final price
    const processedOrder = await processOrder(order.orderId, quantity);

    console.log({
      processedOrder,
    });

    // Confirm the PaymentIntent using the details collected by the Express Checkout Element
    const { error } = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret: processedOrder.stripeClientSecret!,
      confirmParams: {
        return_url: `${window.location.origin}/receipt/${processedOrder.orderId}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }
  };

  return (
    <>
      <div id="checkout-page">
        <ExpressCheckoutElement
          onConfirm={onConfirm}
          onLoadError={(error) => {
            console.log("Error loading express checkout", error);
            setNoWallet(true);
          }}
          onReady={() => {
            console.log("Express checkout ready");
          }}
          options={{
            wallets: {
              applePay: "always",
              googlePay: "always",
            },
          }}
        />
        {errorMessage && <div>{errorMessage.message}</div>}
      </div>
    </>
  );
}

export default StripeCheckout;

//"No valid payment method types for this configuration. Please ensure that you have activated payment methods compatible with your chosen currency in your dashboard (https://dashboard.stripe.com/settings/payment_methods) and that the `amount` (15) is not lower than the `currency` (usd) minimum: https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts."
//"No valid payment method types for this configuration. Please ensure that you have activated payment methods compatible with your chosen currency in your dashboard (https://dashboard.stripe.com/settings/payment_methods) and that the `amount` (15) is not lower than the `currency` (dkk) minimum: https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts."
