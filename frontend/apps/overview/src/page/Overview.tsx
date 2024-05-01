import React from "react";
import { motion } from "framer-motion";
import { Chart, FooBar } from "@repo/ui";

const boxCount = 6;
const boxWidth = 100;

function Overview() {
  const mockPrices = [
    { date: new Date("2023-01-01T00:00:00"), price: 100 },
    { date: new Date("2023-01-02T00:00:00"), price: 105 },
  ];

  const animateBox = (index: number) => {
    const totalDistance =
      window.innerWidth +
      boxWidth +
      (window.innerWidth / (boxCount + 1)) * (index + 1);
    const baseSpeed = 0.03;

    return {
      hidden: {
        x: -boxWidth - (window.innerWidth / (boxCount + 1)) * (index + 1),
      },
      visible: {
        x: window.innerWidth,
        transition: {
          duration: baseSpeed * (totalDistance / 10), // Dynamic duration based on distance
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    };
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <FooBar />
        <h1>Overview</h1>
      </div>
      <div className="flex justify-center items-center">
        <Chart prices={mockPrices} />
      </div>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "100px" }}
      >
        {Array.from({ length: boxCount }).map((_, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={animateBox(index)} // Ved ikke hvad dens problem er
            style={{
              width: `${boxWidth}px`,
              height: "100px",
              backgroundColor: "#0f62fe",
              position: "absolute",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Overview;
