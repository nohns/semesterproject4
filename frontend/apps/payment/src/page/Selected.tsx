/** @format */

import React from "react";
import { FooBar } from "@repo/ui";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import MobileContainer from "@/components/MobileContainer";
import { Button } from "@/components/ui/button";
import { Undo } from "Lucide-react";

function Selected() {
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
  };

  const location = useLocation();

  //Magi det ved jeg ikke hvordan virker mads
  const {} = location.state;

  return (
    <>
      <MobileContainer shouldAnimate={true}>
        <div className="flex flex-col items-center w-full gap-6">
          <Undo onClick={handleReturnClick} />
        </div>
        <div>
          <div>Tilbage knap så man kan komme tilbage</div>

          <div>
            Der skal nok være en timer som tæller ned hvor lang tid tilbudet er
            validt
          </div>

          <div>
            Magisk graf som der nok kræver at endnu mere data bliver passed ind
          </div>
          <div>Kortet som vælger antal af drinks</div>

          <Button>Bestil</Button>
        </div>
      </MobileContainer>
    </>
  );
}

export default Selected;
