/** @format */

import { FooBar } from "@repo/ui";
import { Chart } from "@repo/ui";

function Overview() {
  const mockPrices = [
    { date: new Date("2023-01-01T00:00:00"), price: 100 },
    { date: new Date("2023-01-02T00:00:00"), price: 105 },
  ];

  return (
    <div>
      <div className="flex justify-center items-center">
        <FooBar />
        <h1>Overview</h1>
      </div>
      <div className="flex justify-center items-center">
        <Chart prices={mockPrices} />
      </div>
    </div>
  );
}

export default Overview;
