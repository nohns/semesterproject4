/** @format */

import { useLocation, useNavigate, Location } from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeftIcon } from "Lucide-react";
import { motion } from "framer-motion";
import { Chart } from "@repo/ui";

import { useState } from "react";
import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BeverageQuantityCard from "@/components/BeverageQuantityCard";
import { Beverage, HistoryEntry } from "@repo/api/index";
import { BeveragePrice } from "@repo/ui/model/Beverage";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

const stripePromise = loadStripe("pk_test_4RxUQ9rE2xn8vIbplcQlCLQN");

interface LocationState {
  beverage: Beverage | undefined;
  priceHistory: HistoryEntry[] | undefined;
}

function Selected() {
  const [noWallet, setNoWallet] = useState(false);

  const [counter, setCounter] = useState(1);

  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
  };

  const { state }: Location<LocationState> = useLocation();
  //const { beverage, priceHistory } = locationState;

  if (!state?.beverage || !state?.priceHistory) {
    return <div>Maybe screen or perhabs we jsut force navigate user back</div>;
  }

  //We must take the priceHistory array and reduce it to only prices within the last hour
  const lastHourPrices = state?.priceHistory?.filter((price) => {
    //Check if price.at is within the last hour and only return the price not the whole object
    return new Date(price.at) > new Date(Date.now() - 3600 * 1000);
  });
  const beveragePrices: BeveragePrice[] = lastHourPrices?.map((price) => {
    return {
      date: new Date(price.at),
      price: parseFloat(price.price.toFixed(1)),
    };
  });

  //conver tstring to number

  return (
    <>
      <MobileContainer>
        <motion.div
          className="h-full flex flex-col w-10/12 gap-4 mx-auto max-w-[600px] font-mono"
          key={state?.beverage?.beverageId}
          initial="initialState"
          animate="animateState"
          exit="exitState"
          transition={{
            type: "tween",
            ease: "easeOut", // use the "ease out" easing function
            duration: 0.3, // increase the duration slightly
            delay: 0.1, // add a slight delay
          }}
          variants={{
            initialState: {
              x: "100vw",
            },
            animateState: {
              x: 0,
            },
            exitState: {
              x: "-100vw",
            },
          }}
        >
          <div
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={handleReturnClick}
          >
            <ArrowLeftIcon className="w-8 h-8" />
            <span className="">Tilbage</span>
          </div>
          <h2 className="text-5xl font-semibold">{state.beverage.name}</h2>
          <span className="text-muted-foreground font-semibold uppercase text-xs">
            prisudvikling seneste time
          </span>
          <div className="grow h-60">
            <Chart prices={beveragePrices} />
          </div>

          {/* <BeverageQuantityCard beverage={state?.beverage} /> */}
          <div className="flex align-middle items-center gap-4 ml-auto">
            <Button
              size="icon"
              variant="outline"
              className="bg-red-500"
              onClick={() =>
                setCounter((prevCounter) => Math.max(1, prevCounter - 1))
              }
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium">{counter}</div>
            <Button
              size="icon"
              variant="outline"
              className="bg-green-500"
              onClick={() =>
                setCounter((prevCounter) => Math.min(8, prevCounter + 1))
              }
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between ">
            <span className=" text-xl">Total</span>
            <motion.span
              className="text-xl"
              key={counter}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {(
                counter *
                state.priceHistory[state.priceHistory.length - 1].price
              ).toFixed(1)}
              kr.
            </motion.span>
          </div>
          <div id="checkout-page">
            <Elements stripe={stripePromise}>
              <StripeCheckout setNoWallet={setNoWallet} />
            </Elements>
            {!noWallet && <NoWallet />}
          </div>
        </motion.div>
      </MobileContainer>
    </>
  );
}

export default Selected;
