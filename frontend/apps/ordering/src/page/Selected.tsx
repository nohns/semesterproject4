/** @format */

import { useLocation, useNavigate } from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeftIcon } from "Lucide-react";
import { motion } from "framer-motion";
import { Chart, beverages } from "@repo/ui";

import { useState } from "react";
import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BeverageQuantityCard from "@/components/BeverageQuantityCard";

const stripePromise = loadStripe("pk_test_4RxUQ9rE2xn8vIbplcQlCLQN");

function Selected() {
  const [noWallet, setNoWallet] = useState(false);

  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
  };

  const { beverage } = useLocation().state;

  //Magi det ved jeg ikke hvordan virker mads
  //const {} = location.state;

  return (
    <>
      <MobileContainer>
        <motion.div
          className="h-full flex flex-col w-10/12 mx-auto gap-4 max-w-[600px]"
          key={beverage.id}
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
            <span>Tilbage</span>
          </div>
          <h2 className="text-5xl font-semibold">{beverage.name}</h2>
          <div className="flex flex-col items-center justify-center">
            <div>
              <div>
                <h3 className="text-gray-400 font-semibold uppercase">
                  prisudvikling seneste time
                </h3>
                <div className="h-60">
                  {/* <Chart prices={beverages[1].prices} /> */}
                </div>
              </div>

              <BeverageQuantityCard beverage={beverage} />
            </div>

            <div id="checkout-page">
              <Elements stripe={stripePromise}>
                <StripeCheckout setNoWallet={setNoWallet} />
              </Elements>
              {!noWallet && <NoWallet />}
            </div>
          </div>
        </motion.div>
      </MobileContainer>
    </>
  );
}

export default Selected;
