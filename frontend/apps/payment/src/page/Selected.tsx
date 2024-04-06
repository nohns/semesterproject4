/** @format */

import { useLocation, useNavigate } from "react-router-dom";
import MobileContainer from "@/components/MobileContainer";
import { Undo } from "Lucide-react";
import { motion } from "framer-motion";

import { useState } from "react";
import NoWallet from "@/components/NoWallet";
import StripeCheckout from "@/components/StripeCheckout";

function Selected() {
  const [noWallet, setNoWallet] = useState(false);

  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
  };

  const location = useLocation();

  //Magi det ved jeg ikke hvordan virker mads
  //const {} = location.state;

  return (
    <>
      <MobileContainer>
        <motion.div
          className="flex flex-col items-center w-10/12 gap-6 my-4"
          key={location.key}
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
          <div className="flex flex-col items-center">
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
              <div>Kortet som vælger antal af drinks</div>
            </div>

            <div id="checkout-page">
              <StripeCheckout setNoWallet={setNoWallet} />
              {noWallet && <NoWallet />}
            </div>
          </div>
        </motion.div>
      </MobileContainer>
    </>
  );
}

export default Selected;
