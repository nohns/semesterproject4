/** @format */

import { useLocation, useNavigate } from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { Undo } from "Lucide-react";
import { motion } from "framer-motion";

import { useState } from "react";
import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProductQuantityCard from "@/components/ProductQuantityCard";

const stripePromise = loadStripe("pk_test_4RxUQ9rE2xn8vIbplcQlCLQN");

function Selected() {
  const [noWallet, setNoWallet] = useState(false);

  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
  };

  const { product } = useLocation().state;

  //Magi det ved jeg ikke hvordan virker mads
  //const {} = location.state;

  return (
    <>
      <MobileContainer>
        <motion.div
          className="flex flex-col items-center w-10/12 gap-6 my-4"
          key={product.id}
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
          <div className="flex flex-row items-center w-full gap-6">
            <Undo className="w-12 h-12" onClick={handleReturnClick} />
            Tilbage
          </div>
          <div className="flex flex-col items-center justify-center">
            <div>
              <div>Tilbage knap så man kan komme tilbage</div>

              <div>
                Der skal nok være en timer som tæller ned hvor lang tid tilbudet
                er validt
              </div>

              <div>
                Magisk graf som der nok kræver at endnu mere data bliver passed
                ind
              </div>
              <ProductQuantityCard product={product} />
            </div>

            <div id="checkout-page">
              <Elements stripe={stripePromise}>
                <StripeCheckout setNoWallet={setNoWallet} />
              </Elements>
              {noWallet && <NoWallet />}
            </div>
          </div>
        </motion.div>
      </MobileContainer>
    </>
  );
}

export default Selected;
