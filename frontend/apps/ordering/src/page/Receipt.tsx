/** @format */

import MobileContainer from "@/components/MobileContainer";

import { ArrowLeftIcon, IdCardIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { CircleCheck, CalendarDays, Clock9 } from "Lucide-react";
import { useEffect, useState } from "react";

//Receipt page
function Receipt() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleOrientation = (event) => {
      // Extract rotation from device compass data
      const alpha = event.alpha || 0;
      setRotation(alpha);
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  return (
    <>
      <MobileContainer>
        <div
          className="flex flex-row items-center gap-2 cursor-pointer z-10 w-10/12 mx-auto"
          /* onClick={handleReturnClick} */
        >
          <ArrowLeftIcon className="w-8 h-8" />
          <span className="">Tilbage</span>
        </div>
        <motion.div
          className="h-full flex flex-col w-10/12 gap-4 mx-auto max-w-[600px] font-mono z-0"
          /* key={state?.beverage?.beverageId} */
          key={"beverageId"}
          initial={{ y: -200, z: 0 }} // start with 0 opacity and slightly lower position
          animate={{ y: 0 }} // animate to full opacity and original position
          exit={{ opacity: 0, y: 500 }} // animate out on exit
          transition={{ delay: 0.4, duration: 1 }} // delay each item's animation by its index to create a staggered effect
        >
          {/*Receipt itself*/}
          <div className="flex flex-col bg-muted h-[75dvh] rounded-lg px-4">
            <div className="mx-auto mt-6">
              <CircleCheck className="w-16 h-16 text-background bg-green-600 rounded-full mx-auto" />
              <h3 className="mt-4 font-bold text-xl">Betaling gennemført!</h3>
            </div>

            <div className="relative w-full mb-10">
              <div className="absolute top-0 -left-8  w-8 h-8 bg-background rounded-r-full" />
              <div className="absolute top-4 left-2 right-2 border-t-4 border-dotted border-background" />
              <div className="absolute top-0 -right-8  w-8 h-8 bg-background rounded-l-full" />
            </div>

            <div className="text-2xl text-center mb-8">100 kr.</div>

            <div className="flex flex-row mb-4">
              <CalendarDays className="w-6 h-6 text-primary" />
              <span className="my-auto ml-2 text-sm ">Dato: 25/10/2021</span>
            </div>

            <div className="flex flex-row mb-4">
              <Clock9 className="w-6 h-6 text-primary" />
              <span className="my-auto ml-2  text-sm">tidspunkt: 18:41</span>
            </div>

            <div className="flex flex-row mb-8">
              <IdCardIcon className="w-6 h-6 text-primary" />
              <span className="my-auto ml-2  text-sm">Id: we-12345</span>
            </div>

            <div className="flex flex-row place-items-end">
              <img
                alt="Beverage Image"
                className="aspect-square object-cover w-1/3"
                height={200}
                src={
                  "https://emojiisland.com/cdn/shop/products/Very_Angry_Emoji_7f7bb8df-d9dc-4cda-b79f-5453e764d4ea_large.png?v=1571606036"
                }
                width={200}
                style={{ transform: `rotate(${rotation}deg)` }}
              />

              <div className="flex flex-col w-2/3  ">
                <h1 className="text-2xl">Blå vand</h1>
                <h1 className="text-4xl">4 styk</h1>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 2,
                duration: 2,
              }}
              className="flex justify-center items-center mb-4 mt-auto"
            >
              <img
                src="https://c.tenor.com/ZAMoMuQgf9UAAAAC/tenor.gifv"
                className="rounded-full h-20 w-20 mx-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </MobileContainer>
    </>
  );
}

export default Receipt;
