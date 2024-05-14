import { useEffect, useState } from "react";
import { History, usePriceHistory } from "@repo/api";
import Overview from "./page/Overview";

function App(/* { histories, isConnected }: SelectionProps */) {
  const { history: histories, startListening, connected } = usePriceHistory();
  const [displayedBeverage, setDisplayedBeverage] = useState<History | null>(
    null
  );

  useEffect(() => {
    startListening();
  }, [startListening]);

  if (!connected) return <div>Connecting...</div>;

  if (histories.length === 0) {
    return <div>Loading...</div>;
  }
  if (displayedBeverage === null) {
    setDisplayedBeverage(histories[0]);
    return <div>Loading...</div>;
  }

  console.log("histories", histories);
  console.log("isConnected", connected);
  console.log("displayedBeverage", displayedBeverage);

  return (
    <Overview histories={histories} displayedBeverage={displayedBeverage!} />
  );
}

export default App;
