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
  { name: "Vodka", imageSrc: "/images/graf.png", price: 50 },
  { name: "Fadøl", imageSrc: "/images/graf.png", price: 55 },
  { name: "Cider", imageSrc: "/images/graf.png", price: 60 },
  { name: "Sodavand", imageSrc: "/images/graf.png", price: 65 },
];

function Overview() {
  const mockPrices = [
    { date: new Date("2023-01-01T01:00:00"), price: 100 },
    { date: new Date("2023-01-01T02:00:00"), price: 105 },
    { date: new Date("2023-01-01T03:00:00"), price: 110 },
    { date: new Date("2023-01-01T04:00:00"), price: 120 },
    { date: new Date("2023-01-01T05:00:00"), price: 130 },
    { date: new Date("2023-01-01T06:00:00"), price: 50 },
    { date: new Date("2023-01-01T13:00:00"), price: 75 },
    { date: new Date("2023-01-01T17:00:00"), price: 101 },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-none justify-center" style={{ height: "20%" }}>
        <FooBar />
      </div>
      <div className="flex flex-grow" style={{ height: "60%" }}>
        <Chart prices={mockPrices} />
      </div>
      <div className="flex flex-none" style={{ height: "20%" }}>
        <Marquee speed={50} pauseOnHover={true}>
          {mockItems.map((item, index) => (
            <SlidingBeverageItemCardLigmaNamingIsHard key={index} item={item} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default Overview;
