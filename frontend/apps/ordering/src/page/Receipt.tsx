/** @format */

import MobileContainer from "@/components/MobileContainer";

import { ArrowLeftIcon, IdCardIcon } from "@radix-ui/react-icons";
import { useGetOrder } from "@repo/api";
import { motion } from "framer-motion";
import { CircleCheck, CalendarDays, Clock9, TriangleAlert } from "Lucide-react";
import { useNavigate, useParams } from "react-router-dom";

//Receipt page
function Receipt() {
  const { orderId } = useParams();

  const navigate = useNavigate();
  function onBackPressed() {
    navigate("/");
  }

  const { data, isLoading, error } = useGetOrder(Number(orderId));

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="flex flex-col justify-center items-center h-[70dvh]">
          <div className="loader" />
          <span className="font-mono text-xs mt-4">
            Indlæser din kvittering...
          </span>
        </div>
      </MobileContainer>
    );
  }

  if (error || data?.status !== 2) {
    return (
      <>
        <MobileContainer>
          <motion.div
            className="  rounded-sm  p-2  h-[80dvh] flex flex-col justify-end items-center "
            initial={{ opacity: 0, y: 50 }} // changed from -50 to 50
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }} // changed from 50 to -50
          >
            <motion.div
              className=""
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TriangleAlert className="h-14 w-14 mx-auto text-destructive" />
            </motion.div>
            <motion.div
              className="font-mono text-xs mb-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Ikke et gyldigt ordrenummer
            </motion.div>
            <motion.button
              onClick={onBackPressed}
              className="w-full mt-2 bg-primary text-primary-foreground  shadow hover:bg-primary/90 rounded-md h-9 px-4 py-2 font-mono"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Vend tilbage
            </motion.button>
          </motion.div>
        </MobileContainer>
      </>
    );
  }

  const formattedTime = new Date(data?.time!).toLocaleTimeString();
  const formattedDate = new Date(data?.time!).toLocaleDateString();

  //handle case of we recieve data but

  return (
    <>
      <MobileContainer>
        <div
          className="flex flex-row items-center gap-2 cursor-pointer z-10 w-10/12 mx-auto"
          onClick={onBackPressed}
        >
          <ArrowLeftIcon className="w-8 h-8" />
          <span className="">Tilbage</span>
        </div>
        <motion.div
          className="h-full flex flex-col w-10/12 gap-4 mx-auto max-w-[600px] font-mono z-0"
          /* key={state?.beverage?.beverageId} */
          key={"beverageId"}
          initial={{ y: 100, opacity: 0 }} // initial state
          animate={{ y: 0, opacity: 1 }} // animate to full opacity and original position
          exit={{ y: 100, opacity: 0 }} // exit state
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

            <div className="text-2xl text-center mb-8">
              {data?.price.amount * data?.quantity} kr.
            </div>

            <div className="flex flex-row mb-4">
              <CalendarDays className="w-6 h-6 text-primary" />
              <span className="my-auto ml-2 text-sm ">
                Dato: {formattedDate}
              </span>
            </div>

            <div className="flex flex-row mb-4">
              <Clock9 className="w-6 h-6 text-primary" />
              <span className="my-auto ml-2  text-sm">
                Tidspunkt: {formattedTime}
              </span>
            </div>

            <div className="flex flex-row mb-8">
              <IdCardIcon className="w-6 h-6 text-primary" />
              <span className="my-auto ml-2  text-sm">Id: {data?.orderId}</span>
            </div>

            <div className="flex flex-row place-items-end gap-x-4 ">
              <img
                alt="Beverage Image"
                className="aspect-square object-cover w-1/3 border-2 border-primary rounded-lg"
                height={200}
                src={data?.beverage.imageSrc}
                width={200}
              />

              <div className="flex flex-col w-2/3  ">
                <h1 className="text-2xl ">{data?.beverage.name}</h1>
                <h1 className="text-4xl ">{data?.quantity} stk</h1>
              </div>
            </div>

            <div className="relative w-full mb-10">
              <div className="absolute top-4 left-2 right-2 border-t-4 border-dotted border-background" />
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
              className="flex justify-center items-center mb-14 w-full h-20   rounded-lg mt-auto"
            >
              <img
                src="https://c.tenor.com/ZAMoMuQgf9UAAAAC/tenor.gifv"
                className="rounded-full h-20 w-20 mx-auto"
              />
              <img
                src="https://c.tenor.com/ZAMoMuQgf9UAAAAC/tenor.gifv"
                className="rounded-full h-20 w-20 mx-auto"
              />
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
