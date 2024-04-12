/** @format */

import { BeverageCard } from "@repo/ui";
import { BigScreenWrapper } from "@repo/ui";
import { Beverage } from "@repo/api";
import { motion } from "framer-motion";
import Dashboard from "@/components/Dashboard";

function Admin() {
  /* const mock: Beverage[] = [
    {
      beverageId: "1",
      name: "Øl",
      description: "A refreshing drink",
      imageSrc: "/images/bajselademad.jpg",
    },
    {
      beverageId: "2",
      name: "Snaps",
      description: "A really refreshing drink",
      imageSrc: "/images/snaps.jpg",
    },
    {
      beverageId: "3",
      name: "Vand",
      description: "An incredibly refreshing drink",
      imageSrc: "/images/vand.jpg",
    },
  ]; */

  return (
    <>
      <BigScreenWrapper>
        <div className="h-full flex flex-col items-center w-full gap-6">
          {/*All drinks spawned*/}

          <Dashboard />

          {/*   {mock.length > 0 &&
            mock.map((history, index) => (
              <motion.div
                className="flex justify-center w-3/12"
                key={history.beverageId}
                initial={{ opacity: 0, y: 50 }} // start with 0 opacity and slightly lower position
                animate={{ opacity: 1, y: 0 }} // animate to full opacity and original position
                exit={{ opacity: 0, y: 50 }} // animate out on exit
                transition={{ delay: index * 0.1 }} // delay each item's animation by its index to create a staggered effect
              >
                <BeverageCard
                  beverage={history}
                  handleBeverageClick={() => {}}
                />
              </motion.div>
            ))} */}
        </div>
      </BigScreenWrapper>
    </>
  );
}

export default Admin;
