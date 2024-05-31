/** @format */

import BeverageCard from "@/components/BeverageCard";
import { Apple, Google } from "@repo/ui";

import { useNavigate } from "react-router-dom";

import { Beverage } from "@repo/api";
import MobileContainer from "@/components/MobileContainer";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { usePriceHistory } from "@repo/api";
import { createOrder } from "@/api/order";
import { cn } from "@/lib/utils";

function Selection() {
  const navigate = useNavigate();
  const {
    history: histories,
    startListening,
    connected,
    listening,
  } = usePriceHistory();

  // Restart WS connection if its dropped
  useEffect(() => {
    if (connected || listening) return;
    startListening();
  }, [connected, listening, startListening]);

  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleBeverageClick = useCallback(
    async (beverage: Beverage) => {
      setLoadingOrder(true);
      const order = await createOrder(beverage.beverageId);
      setLoadingOrder(false);
      navigate(`/order/${order.orderId}`);
    },
    [navigate]
  );

  return (
    <>
      <MobileContainer>
        <div
          className={cn("h-full flex flex-col items-center w-full gap-6", {
            "overflow-hidden": loadingOrder,
          })}
        >
          {/*Loading screen*/}
          {histories.length === 0 && (
            <div className="flex flex-col justify-center items-center">
              <div className="loader" />
              <span className="font-mono text-xs mt-4">
                Indlæser blå vand opskriften...
              </span>
            </div>
          )}
          <AnimatePresence>
            {loadingOrder && (
              <motion.div
                className="fixed top-0 left-0 right-0 z-50 bg-white/75 flex flex-col justify-center items-center overscroll-contain h-screen"
                initial={{ opacity: 0, visibility: "hidden" }}
                animate={{ opacity: 1, visibility: "visible" }}
              >
                <div className="loader" />
                <span className="font-mono text-xs mt-4">
                  Indlæser dit tilbud... 🍹
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/*All drinks spawned*/}
          {histories?.length > 0 &&
            histories?.map((history, index) => (
              <motion.div
                className="flex justify-center"
                key={history.beverage.beverageId}
                initial={{ opacity: 0, y: 50 }} // start with 0 opacity and slightly lower position
                animate={{ opacity: 1, y: 0 }} // animate to full opacity and original position
                exit={{ opacity: 0, y: 50 }} // animate out on exit
                transition={{ delay: index * 0.1 }} // delay each item's animation by its index to create a staggered effect
              >
                {/*Make deep copy so state isn't updated :)*/}
                <BeverageCard
                  beverage={JSON.parse(JSON.stringify(history.beverage))}
                  history={JSON.parse(JSON.stringify(history.prices))}
                  handleBeverageClick={handleBeverageClick}
                />
              </motion.div>
            ))}
        </div>

        <motion.div
          className="flex flex-col mt-4  border-t w-full items-center "
          initial={{ y: 50, opacity: 0 }} // start from a slightly lower position and with 0 opacity
          animate={{ y: 0, opacity: 1 }} // animate to the original position and full opacity
          transition={{ duration: 0.5 }} // control the speed of the animation
        >
          <span className="font-mono font-light mt-4 text-xs my-auto">
            Understøttede betalingsmuligheder
          </span>

          <div className="flex flex-row justify-center  w-full gap-x-8 ">
            <Apple />
            <Google />
          </div>

          <span className="font-mono font-extralight text-xs border-t w-10/12 text-center py-2">
            @Copyright FooBar.dk
          </span>
        </motion.div>
      </MobileContainer>
    </>
  );
}

export default Selection;
