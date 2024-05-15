import { useEffect, useRef, useState } from "react";
import { History, usePriceHistory } from "@repo/api";
import Overview from "./page/Overview";

const CYCLE_DURATION = 10000;

function App(/* { histories, isConnected }: SelectionProps */) {
  const { history: histories, startListening, connected } = usePriceHistory();
  const [displayedBeverageIndex, setDisplayedBeverageIndex] = useState<
    number | null
  >(null);
  const [displayedBeverage, setDisplayedBeverage] = useState<History | null>(
    null
  );

  const intervalHandle = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (intervalHandle.current) return;
    if (histories.length === 0) return;

    function cycle() {
      setDisplayedBeverageIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % histories.length;
      });
    }

    intervalHandle.current = setInterval(cycle, CYCLE_DURATION);
    cycle();
  }, [intervalHandle.current, histories, setDisplayedBeverageIndex]);

  useEffect(() => {
    startListening();
  }, [startListening]);

  useEffect(() => {
    if (displayedBeverageIndex === null) return;
    setDisplayedBeverage({ ...histories[displayedBeverageIndex] });
  }, [displayedBeverageIndex]);

  if (!connected) return <div>Connecting...</div>;

  if (histories.length === 0) {
    return <div>Loading...</div>;
  }
  if (displayedBeverage === null) {
    return <div>Loading...</div>;
  }

  return (
    <Overview histories={histories} displayedBeverage={displayedBeverage} />
  );
}

export default App;
