import Marquee from "react-fast-marquee";
import { Chart, FooBar } from "@repo/ui";
import SlidingBeverageItemCardLigmaNamingIsHard from "../components/SlidingBeverageItemCardLigmaNamingIsHard";

const mockItems = [
  { name: "Blå Thor", imageSrc: "/images/graf.png", price: 20 },
  { name: "Blå Vand", imageSrc: "/images/graf.png", price: 25 },
  { name: "Kinderæg", imageSrc: "/images/graf.png", price: 30 },
  { name: "Rom & Cola", imageSrc: "/images/graf.png", price: 35 },
  { name: "Gin & Tonic", imageSrc: "/images/graf.png", price: 40 },
  { name: "Øl", imageSrc: "/images/graf.png", price: 45 },
];

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
      <Marquee speed={50} pauseOnHover={true}>
        {mockItems.map((item, index) => (
          <SlidingBeverageItemCardLigmaNamingIsHard key={index} item={item} />
        ))}
      </Marquee>
    </div>
  );
}

export default Overview;
