import { useNavigate, useParams } from "react-router-dom";
import OrderOverview from "./Order/OrderOverview";
import { useCallback, useEffect, useRef, useState } from "react";
import { Order as OrderModel } from "@/model/order";
import { Price } from "@repo/api";
import { AnimatePresence, motion } from "framer-motion";
import { createOrder, fetchOrder, fetchOrderPrices } from "@/api/order";
import { differenceInMilliseconds } from "date-fns";
import MobileContainer from "@/components/MobileContainer";
import ExpirationAlert from "./Order/ExpirationAlert";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const ANIMATE_BACK_PRESS_DURATION = 500;

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [prices, setPrices] = useState<Price[] | null>(null);
  const [loadingState, setLoadingState] = useState<
    | "idle"
    | "initialFetch"
    | "loaded"
    | "renewing_notice"
    | "renewing_fetch"
    | "renewing_unmountmount"
    | "renewing_chart"
  >("idle");
  const [showPage, setShowPage] = useState(true);

  const navigate = useNavigate();
  function onBackPressed() {
    setShowPage(false);
    setTimeout(() => {
      navigate("/");
    }, ANIMATE_BACK_PRESS_DURATION);
  }

  // Fetch order on mount
  const initialFetchStartedOrDone = useRef(false);
  useEffect(() => {
    if (!orderId) return;
    if (order) return;
    if (initialFetchStartedOrDone.current) return;
    initialFetchStartedOrDone.current = true;
    setLoadingState("initialFetch");

    const numId = parseInt(orderId);
    if (!numId || isNaN(numId)) return;

    async function initialFetch(id: number) {
      const fetchedOrder = await fetchOrder(id);
      const fetchedPrices = await fetchOrderPrices(fetchedOrder.orderId);
      setOrder(fetchedOrder);
      setPrices(fetchedPrices);
      setLoadingState("loaded");
    }
    initialFetch(numId);
  }, [orderId, setOrder, setPrices]);

  // Creates a new order for the same beverageId as the expired order
  const renewOrder = useCallback(async () => {
    if (!order) {
      console.error(
        "could not renew order. order is null so getting bev id is not possible.",
      );
      return;
    }
    const newOrder = await createOrder(order.beverageId);
    const newPrices = await fetchOrderPrices(newOrder.orderId);
    setOrder(newOrder);
    setPrices(newPrices);
    history.replaceState({}, "", `/order/${newOrder.orderId}`);
  }, [order]);

  // Renew order when order expires
  useEffect(() => {
    if (!order) return;
    if (loadingState === "idle" || loadingState === "initialFetch") return;
    if (loadingState.startsWith("renewing")) return;

    const expiry = differenceInMilliseconds(order.expiry, new Date());
    const handle = setTimeout(async () => {
      setLoadingState("renewing_notice");
      await wait(2000);
      setLoadingState("renewing_unmountmount");
      await wait(300);
      setLoadingState("renewing_fetch");
      await wait(1500);
      await renewOrder();
      setLoadingState("renewing_chart");
      await wait(300);
      setLoadingState("loaded");
    }, expiry);
    return () => clearTimeout(handle);
  }, [renewOrder, loadingState]);

  if (!orderId) {
    return <div>Error! no order id in url!</div>;
  }
  console.log({
    order,
    prices,
    loadingState,
  });

  const showChart =
    loadingState === "loaded" || loadingState === "renewing_notice";

  return (
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
            <ExpirationAlert expiry={order?.expiry} />

            <div>
              <div
                className="inline-flex w-auto items-center gap-2 cursor-pointer transition active:text-gray-100 duration-75 active:scale-105 origin-center"
                onClick={onBackPressed}
              >
                <ArrowLeftIcon className="w-8 h-8" />
                <span className="">Tilbage</span>
              </div>
            </div>
            <motion.main
              className="relative w-full min-h-[30rem]"
              transition={{
                duration: 0.3,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <AnimatePresence>
                {showChart && order && prices && (
                  <motion.div
                    className="absolute top-0 left-0 right-0"
                    transition={{
                      duration: 0.3,
                    }}
                    key={order.orderId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <OrderOverview order={order} prices={prices} />
                  </motion.div>
                )}{" "}
              </AnimatePresence>

              <AnimatePresence>
                {loadingState.startsWith("renewing") && (
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
                      {loadingState === "renewing_notice" && (
                        <motion.span
                          className="relative top-0"
                          key="notice"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          Pris udløbet 🥲
                        </motion.span>
                      )}
                      {loadingState === "renewing_fetch" && (
                        <motion.span
                          className="relative top-0"
                          key="fetch"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          Henter seneste pris... ⌛️
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
}
