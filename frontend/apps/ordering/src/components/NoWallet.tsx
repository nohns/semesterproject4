/** @format */

import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "Lucide-react";
import { motion } from "framer-motion";

function NoWallet() {
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
  };

  return (
    <motion.div
      className="border rounded-sm bg-muted p-2"
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
        Google Pay eller Apple Pay er ikke tilgængelige på denne enhed.
        Konfigurer en betalingsmetode og prøv igen.
      </motion.div>
      <motion.button
        onClick={handleReturnClick}
        className="w-full mt-2 bg-primary text-primary-foreground  shadow hover:bg-primary/90 rounded-md h-9 px-4 py-2 font-mono"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Vend tilbage
      </motion.button>
    </motion.div>
  );
}

export default NoWallet;
