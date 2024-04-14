/** @format */

import BeverageCard from "@/components/BeverageCard";
import { Apple, Google, Money } from "@repo/ui";

import { useNavigate } from "react-router-dom";

import { Beverage, useWebsocket } from "@repo/api";
import MobileContainer from "@/components/MobileContainer";
import { motion } from "framer-motion";

function Selection() {
    const navigate = useNavigate();

    const handleBeverageClick = (beverage: Beverage) => {
        console.log("Clicked");
        navigate("/selected", { state: { beverage } });
    };

    const {isConnected, histories } = useWebsocket("ws://localhost:9090/ws");

    console.log("histories", histories);
    console.log("isConnected", isConnected);
    return (
        <>
            <MobileContainer>
                <div className="h-full flex flex-col items-center w-full gap-6">
                    {/*Loading screen*/}
                    {histories.length === 0 && (
                        <div className="flex flex-col justify-center items-center">
                            <div className="loader" />
                            <span className="font-mono text-xs mt-4">
                                Indlæser blå vand opskriften
                            </span>
                        </div>
                    )}

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
                                <BeverageCard
                                    beverage={history.beverage}
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
                        Supported methods for payment
                    </span>

                    <div className="flex flex-row justify-center  w-full gap-x-8 ">
                        <Apple />
                        <div className="transform scale-75"><Money /></div>  
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
