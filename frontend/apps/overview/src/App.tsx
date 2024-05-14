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
    if (histories.length > 0) {
      setDisplayedBeverage(histories[0]);
    }
  }, [startListening]);

  if (!connected) {
    return <div>Connecting...</div>;
  }

  while (histories.length == 0) {
    return <div>Getting beverages</div>;
  }
  if (!displayedBeverage) {
    return <div>No beverages</div>;
  }

  return (
    <Overview histories={histories} displayedBeverage={displayedBeverage} />
  );
}

export default App;
