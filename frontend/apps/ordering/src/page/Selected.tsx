/** @format */

import {
  useLocation,
  useNavigate,
  Location,
  useParams,
} from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeftIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Chart } from "@repo/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Beverage, HistoryEntry } from "@repo/api/index";
import { BeveragePrice } from "@repo/ui/model/Beverage";
import axios from "axios";

import {
  ArrowBottomRightIcon,
  ArrowTopRightIcon,
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Payment from "./Payment";
import { addSeconds, formatDistanceStrict } from "date-fns";
import { da } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui";
import { Price } from "@repo/api/types/beverage";

interface LocationState {
  beverage: Beverage | undefined;
  priceHistory: HistoryEntry[] | undefined;
}

// Wait function returning promise
function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

interface Order {
  orderId: number;
  beverageId: number;
  priceId: number;
  stripeIntentId: string | null;
  stripeClientSecret: string | null;
  quantity: number;
  time: string;
  expiry: string;
  status: number;
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

  const [countdown, setCountdown] = useState(0);
  const expiryHandle = useRef<NodeJS.Timeout | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentPrices, setCurrentPrices] = useState<Price[] | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(-1);

  const location = useLocation();
  const { orderId } = useParams();
  const memoizedLocation = useMemo(() => location, [location]);
  const { state }: Location<LocationState> = memoizedLocation;

  // Creates a new order. This is done when the current order has expired after the countdown.
  const createOrder = useCallback(
    async (first: boolean) => {
      if (!first) {
        setLoadingOrder(1);
        await wait(2000);
        setLoadingOrder(2);
        await wait(300);
        setLoadingOrder(3);
        await wait(2000);
      }
      setLoadingOrder(4);

      let order: Order | null = null;
      if (orderId && (!currentOrder || countdown > 0)) {
        const resp = await axios.get<Order>(
          `${import.meta.env.VITE_APP_API_URL}/orders/${orderId}`,
        );
        order = resp.data;
      } else {
        const resp = await axios.post<Order>(
          `${import.meta.env.VITE_APP_API_URL}/orders`,
          {
            quantity: 1,
            beverageId: state?.beverage?.beverageId ?? currentOrder?.beverageId,
          },
        );
        order = resp.data;
      }
      if (!order) return;
      setCurrentOrder(order);
      history.replaceState(state, "", `/selected/${order.orderId}`);

      const resp2 = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/orders/${order.orderId}/prices`,
      );
      setCurrentPrices(resp2.data);
      console.log(order);
      setCountdown(200);

      setLoadingOrder(5);
      await wait(300);
      setLoadingOrder(0);
    },
    [setCurrentOrder, setCurrentPrices, countdown],
  );

  // Initially start the countdown interval
  useEffect(() => {
    if (expiryHandle.current) return;

    expiryHandle.current = setInterval(() => {
      setCountdown((old) => {
        if (old < 0) return old;
        return old - 1;
      });
    }, 1000);
  }, [expiryHandle.current]);

  // Reset expiry interval, when it reaches zero
  useEffect(() => {
    if (countdown > 0) return;
    createOrder(!currentOrder).then(() => {});
  }, [countdown, setCountdown, createOrder]);

  // Use date-fns to format a locale correct time interval until next reserved price, shown in seconds.
  const formattedCountdown = useMemo(() => {
    console.log("countdown", countdown);
    if (isNaN(countdown)) {
      return "-";
    }
    const futureDate = addSeconds(new Date(), countdown);
    return formatDistanceStrict(futureDate, new Date(), {
      unit: "second",
      locale: da,
    });
  }, [countdown]);

  //const { state }: Location<LocationState> = useLocation();
  //const { beverage, priceHistory } = locationState;

  const beveragePrices: BeveragePrice[] | undefined = useMemo(() => {
    return currentPrices
      ?.slice(Math.max((currentPrices?.length ?? 0) - 20, 0))
      .map((price) => {
        return {
          date: new Date(price.timestamp),
          price: parseFloat(price.amount.toFixed(2)),
        };
      });
  }, [currentPrices]);

  if (!currentOrder || !currentPrices) {
    return <div>Maybe screen or perhabs we jsut force navigate user back</div>;
  }

  const firstPrice = beveragePrices?.at(0);
  const lastPrice = beveragePrices?.at(-1);
  const isRising =
    firstPrice && lastPrice && firstPrice!.price < lastPrice!.price;
  const percentage =
    firstPrice && lastPrice
      ? ((lastPrice!.price - firstPrice!.price) / firstPrice!.price) * 100
      : 0;

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
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <AlertTitle>Din pris er låst</AlertTitle>
                <AlertDescription> {formattedCountdown}</AlertDescription>
              </Alert>
              <div>
                <div
                  className="inline-flex w-auto items-center gap-2 cursor-pointer transition active:text-gray-100 duration-75 active:scale-105 origin-center"
                  onClick={handleReturnClick}
                >
                  <ArrowLeftIcon className="w-8 h-8" />
                  <span className="">Tilbage</span>
                </div>
              </div>

              <div className="relative">
                <AnimatePresence>
                  {loadingOrder < 5 && (
                    <motion.main
                      key={currentOrder?.orderId}
                      className="absolute w-full min-h-52"
                      transition={{
                        duration: 0.3,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <AnimatePresence>
                        {loadingOrder && loadingOrder < 4 && (
                          <motion.div
                            className="absolute inset-0 bg-opacity-90 bg-white flex flex-col justify-center items-center gap-4 z-50 text-xl"
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                          >
                            <AnimatePresence>
                              {loadingOrder === 1 && (
                                <motion.span
                                  className="relative top-0"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                >
                                  Tilbud udløbet 🥲
                                </motion.span>
                              )}
                              {loadingOrder === 3 && (
                                <motion.span
                                  className="relative top-0"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                >
                                  Henter {currentOrder ? "nyt" : ""} tilbud...
                                  ⌛️
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {currentOrder && currentPrices && (
                        <>
                          <header className="flex flex-col gap-2">
                            <div>
                              <h2 className="text-5xl font-semibold mt-2">
                                {currentOrder.beverage.name}
                              </h2>
                            </div>

                            <div
                              className={cn("flex flex-col", {
                                "text-green-500": isRising,
                                "text-red-500": !isRising,
                              })}
                            >
                              <p className="text-2xl font-semibold">
                                {lastPrice &&
                                  lastPrice.price.toFixed(2) + " DKK"}
                              </p>
                              <p className="text-lg flex gap-2 items-center">
                                {isRising && (
                                  <ArrowTopRightIcon className="w-6 h-6" />
                                )}
                                {!isRising && (
                                  <ArrowBottomRightIcon className="w-6 h-6" />
                                )}
                                <span>
                                  {isRising ? "+" : ""}
                                  {percentage.toFixed(2)} %
                                </span>
                              </p>
                            </div>
                          </header>

                          <div className="grow h-60">
                            <Chart prices={beveragePrices!} />
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
                                  <div className="text-lg font-medium">
                                    {counter}
                                  </div>
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
                                    currentPrices[currentPrices.length - 1]
                                      .amount
                                  ).toFixed(2)}{" "}
                                  DKK
                                </motion.span>
                              </div>
                              <Payment
                                total={
                                  counter *
                                  currentPrices[currentPrices.length - 1].amount
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </motion.main>
                  )}
                </AnimatePresence>
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
