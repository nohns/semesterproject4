/** @format */

import { useLocation, useNavigate, Location } from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeftIcon } from "Lucide-react";
import { motion } from "framer-motion";
import { Chart } from "@repo/ui";

import { useMemo, useState } from "react";
import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Beverage, HistoryEntry } from "@repo/api/index";
import { BeveragePrice } from "@repo/ui/model/Beverage";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import Countdown from "@/components/Countdown";

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

  console.log("RERENDERING");

  const location = useLocation();
  const memoizedLocation = useMemo(() => location, [location]);

  const { state }: Location<LocationState> = memoizedLocation;

  //const { state }: Location<LocationState> = useLocation();
  //const { beverage, priceHistory } = locationState;

  if (!state?.beverage || !state?.priceHistory) {
    return <div>Maybe screen or perhabs we jsut force navigate user back</div>;
  }

  const beveragePrices: BeveragePrice[] = state?.priceHistory
    .slice(state.priceHistory.length - 20)
    .map((price) => {
      return {
        date: new Date(price.at),
        price: parseFloat(price.price.toFixed(2)),
      };
    });
  console.log(state);

  return (
    <>
      <MobileContainer>
        <motion.div
          className="h-full flex flex-col w-10/12 gap-4 mx-auto max-w-[600px] font-mono"
          /* key={state?.beverage?.beverageId} */
          key={"beverageId"}
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
          <div className="border p-1.5 text-sm bg-green-500 rounded-sm text-center">
            Tilbudet er tilgængeligt indtil c# backenden giver os et endpoint 🤬{" "}
            <Countdown />
          </div>
          <div
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={handleReturnClick}
          >
            <ArrowLeftIcon className="w-8 h-8" />
            <span className="">Tilbage</span>
          </div>

          <h2 className="text-5xl font-semibold">{state.beverage.name}</h2>
          <span className="text-muted-foreground font-semibold uppercase text-xs">
            prisudvikling seneste 10 min
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

//export default React.memo(Selected);
export default Selected;
