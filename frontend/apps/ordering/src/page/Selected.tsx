/** @format */

import { useLocation, useNavigate, Location } from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeftIcon } from "Lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Chart } from "@repo/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { Beverage, HistoryEntry } from "@repo/api/index";
import { BeveragePrice } from "@repo/ui/model/Beverage";
import { Button } from "@/components/ui/button";
import {
  ArrowBottomRightIcon,
  ArrowTopRightIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Countdown from "@/components/Countdown";
import Payment from "./Payment";
import { formatDistanceStrict, formatDistanceToNowStrict } from "date-fns";
import { da } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { dsvFormat } from "d3";

interface LocationState {
  beverage: Beverage | undefined;
  priceHistory: HistoryEntry[] | undefined;
}

function Selected() {
  const [counter, setCounter] = useState(1);
  const navigate = useNavigate();
  const [showPage, setShowPage] = useState(true);

  const handleReturnClick = () => {
    setShowPage(false);
    setTimeout(() => {
      navigate("/");
    }, 500);
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
    .slice(Math.max(state.priceHistory.length - 20, 0))
    .map((price) => {
      return {
        date: new Date(price.at),
        price: parseFloat(price.price.toFixed(2)),
      };
    });
  console.log(state);

  const firstPrice = beveragePrices.at(0);
  const lastPrice = beveragePrices.at(-1);
  const isRising = firstPrice!.price < lastPrice!.price;
  const percentage =
    ((lastPrice!.price - firstPrice!.price) / firstPrice!.price) * 100;

  return (
    <>
      <MobileContainer>
        <AnimatePresence>
          {showPage && (
            <motion.div
              className="h-full flex flex-col w-full px-4 gap-4 mx-auto max-w-[600px] font-mono"
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
                  x: "100vw",
                },
              }}
            >
              <div className="border p-1.5 text-sm bg-green-500 rounded-sm text-center">
                Tilbudet er tilgængeligt indtil c# backenden giver os et
                endpoint 🤬 <Countdown />
              </div>
              <div>
                <div
                  className="inline-flex w-auto items-center gap-2 cursor-pointer transition active:text-gray-100 duration-75 active:scale-105 origin-center"
                  onClick={handleReturnClick}
                >
                  <ArrowLeftIcon className="w-8 h-8" />
                  <span className="">Tilbage</span>
                </div>
              </div>

              <header className="flex flex-col gap-2">
                <div>
                  <h2 className="text-5xl font-semibold">
                    {state.beverage.name}
                  </h2>
                  {/*<span className="text-muted-foreground font-semibold uppercase text-xs">
                prisudvikling seneste{" "}
                {firstPrice && lastPrice
                  ? formatDistanceStrict(firstPrice.date, lastPrice.date, {
                      locale: da,
                    })
                  : "tid"}
              </span>*/}
                </div>

                <div
                  className={cn("flex flex-col", {
                    "text-green-500": isRising,
                    "text-red-500": !isRising,
                  })}
                >
                  <p className="text-2xl font-semibold">
                    {lastPrice && lastPrice.price.toFixed(2) + " DKK"}
                  </p>
                  <p className="text-lg flex gap-2 items-center">
                    {isRising && <ArrowTopRightIcon className="w-6 h-6" />}
                    {!isRising && <ArrowBottomRightIcon className="w-6 h-6" />}
                    <span>
                      {isRising ? "+" : ""}
                      {percentage.toFixed(2)} %
                    </span>
                  </p>
                </div>
              </header>

              <div className="grow h-60">
                <Chart prices={beveragePrices} />
              </div>

              {/* <BeverageQuantityCard beverage={state?.beverage} /> */}

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
                        onClick={() =>
                          setCounter((prevCounter) =>
                            Math.max(1, prevCounter - 1),
                          )
                        }
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <div className="text-lg font-medium">{counter}</div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setCounter((prevCounter) =>
                            Math.min(8, prevCounter + 1),
                          )
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
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
                      ).toFixed(2)}{" "}
                      DKK
                    </motion.span>
                  </div>
                  <Payment
                    price={
                      counter *
                      state.priceHistory[state.priceHistory.length - 1].price
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobileContainer>
    </>
  );
}

//export default React.memo(Selected);
export default Selected;
