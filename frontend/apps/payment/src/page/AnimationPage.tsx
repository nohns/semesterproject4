/** @format */

import { LazyMotion, m, domAnimation, motion } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";

function AnimationPage({ children }: any): JSX.Element {
  //
  const location = useLocation();

  return (
    <motion.div
      key={location.key}
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        type: "tween",
        duration: 0.4,
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
      className="" // Feel free to add your classes here
    >
      {children}
    </motion.div>
  );
}

export default AnimationPage;
