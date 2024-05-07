import * as d3 from "d3";
import {
  eachMinuteOfInterval,
  endOfMinute,
  format,
  isSameMinute,
  startOfMinute,
} from "date-fns";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { BeveragePrice } from "../model/Beverage";
import { useMemo } from "react";

const FADE_IN_DELAY = 0.3;

interface ChartProps {
  prices: BeveragePrice[];
}

// Sourced from: https://gist.github.com/samselikoff/4aff333f7c8538bb44f1806931c39be5
export function Chart({ prices }: ChartProps) {
  const [ref, bounds] = useMeasure();

  return (
    <div ref={ref} className="h-full w-full relative">
      <ChartInner prices={prices} width={bounds.width} height={bounds.height} />
    </div>
  );
}
interface ChartInnerProps {
  prices: BeveragePrice[];
  width: number;
  height: number;
}

function ChartInner({ prices, width, height }: ChartInnerProps) {
  const margin = {
    top: 10,
    right: 5,
    bottom: 50,
    left: 30,
  };

  const pricesToRender = useMemo(() => {
    const compareEvenOdd = prices.length % 2 === 0 ? 1 : 0;
    if (width < 350) {
      return prices.filter((_, i) => i % 2 === compareEvenOdd);
    }
    return prices;
  }, [width, prices]);

  console.log("prices to render", pricesToRender.length);

  const isRising =
    pricesToRender[0].price < pricesToRender[pricesToRender.length - 1].price;

  const startMinute = pricesToRender.at(0)!.date;
  const endMinute = pricesToRender.at(-1)!.date;
  const minutes = eachMinuteOfInterval({ start: startMinute, end: endMinute });
  const xScale = d3
    .scaleTime()
    .domain([startMinute, endMinute])
    .range([margin.left, width - margin.right]);

  console.log([margin.left, width - margin.right]);

  const minMaxPrices = d3.extent(pricesToRender.map((p) => p.price));
  if (minMaxPrices[0] === undefined || minMaxPrices[1] === undefined) {
    return <div>Error - min max could not be found from price data</div>;
  }
  // Make more room in top and bottom of chart for showing price tips
  const yDiff = minMaxPrices[1] - minMaxPrices[0];
  const yPadding = yDiff * 0.3;
  minMaxPrices[0] -= yPadding;
  minMaxPrices[1] += yPadding;

  const yScale = d3
    .scaleLinear()
    .domain(minMaxPrices)
    .range([height - margin.bottom, margin.top]);

  const coords = pricesToRender.map<[number, number]>((p) => [
    xScale(p.date),
    yScale(p.price),
  ]);

  const lineDataPoints = d3.line()(coords);
  const clipLine = d3.line()([
    ...coords,
    [xScale(pricesToRender.at(-1)!.date), height - 25],
    [xScale(pricesToRender.at(0)!.date), height - 25],
  ]);

  function renderPriceTip(index: number) {
    if (index === 0) return null;
    if (index === pricesToRender.length - 1) return null;

    const p = pricesToRender[index];
    const prev = pricesToRender[index - 1];
    const next = pricesToRender[index + 1];
    const isLocalBottom = prev.price < p.price && next.price < p.price;
    const isLocalTop = prev.price > p.price && next.price > p.price;
    if (!isLocalTop && !isLocalBottom) {
      return null;
    }

    const yOffset = isLocalBottom ? -32 : 12;

    //console.log({ p, prev, next });
    return (
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: FADE_IN_DELAY + 0.6 + index * 0.05,
        }}
        transform={`translate(${xScale(p.date) - 15},${
          yScale(p.price) + yOffset
        })`}
        key={index}
      >
        <motion.rect
          width={30}
          height={20}
          //initial={{ opacity: 0, translateY: -10 }}
          //animate={{ opacity: 1, translateY: 0 }}
          //transition={{ duration: 0.5 }}
          fill="currentColor"
          rx="5"
          className="p-4 rounded-md "
        ></motion.rect>
        {isLocalTop && (
          <polygon
            /*points={`${xScale(p.date)},${yScale(p.price)} ${xScale(p.date) + 5},${
                        yScale(p.price) - 5
                      } ${xScale(p.date) - 5},${yScale(p.price) - 5}`}*/
            points={`15,-5 22,2 8,2`}
            rx={2}
            style={{ strokeLinejoin: "round", strokeLinecap: "round" }}
            fill="currentColor"
          />
        )}
        {isLocalBottom && (
          <polygon
            /*points={`${xScale(p.date)},${yScale(p.price)} ${xScale(p.date) + 5},${
                        yScale(p.price) - 5
                      } ${xScale(p.date) - 5},${yScale(p.price) - 5}`}*/
            points={`15,25 22,18 8,18`}
            rx={2}
            style={{ strokeLinejoin: "round", strokeLinecap: "round" }}
            fill="currentColor"
          />
        )}
        <text
          textAnchor={"middle"}
          className="text-white text-xs"
          stroke="currentColor"
          fill="currentColor"
          transform="translate(15,15)"
        >
          {Math.round(p.price)}
        </text>
      </motion.g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={isRising ? "text-green-500" : "text-red-500"}
    >
      <defs>
        <clipPath id="cut-off-bottom">
          <path d={clipLine!} />
        </clipPath>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* X axis */}
      {xScale.ticks(width / 100).map((min) => (
        <motion.g
          key={min.getTime()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: FADE_IN_DELAY }}
          className="text-gray-400"
          transform={`translate(${xScale(min)},0)`}
        >
          <text
            y={height - 10}
            textAnchor="middle"
            fill="currentColor"
            className="text-[10px]"
          >
            {format(min, "HH.mm.ss")}
          </text>
        </motion.g>
      ))}

      {/* Y axis */}
      {yScale.ticks(5).map((max) => (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: FADE_IN_DELAY }}
          transform={`translate(0,${yScale(max)})`}
          className="text-gray-400"
          key={max}
        >
          <line
            x1={margin.left}
            x2={width - margin.right}
            stroke="currentColor"
            strokeDasharray="1,3"
          />
          <text
            alignmentBaseline="middle"
            className="text-[10px]"
            fill="currentColor"
          >
            {max}
          </text>
        </motion.g>
      ))}

      {/* Line */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        exit={{ pathLength: 0 }}
        transition={{ duration: 1.5, delay: 1, type: "spring" }}
        d={lineDataPoints!}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Gradient */}
      <motion.rect
        x={0}
        y={0}
        initial={{ translateY: -height, opacity: 0 }}
        animate={{ translateY: 0, opacity: 0.3 }}
        transition={{ duration: 0.5, delay: FADE_IN_DELAY + 0.1 }}
        width={width}
        height={height - 25}
        className="text-red-500"
        fill="url(#gradient)"
        clipPath="url(#cut-off-bottom)"
      />

      {/* Price tips */}
      {pricesToRender.map((_, i) => renderPriceTip(i))}

      {/* Circles */}
      {pricesToRender.map((p, i) => (
        <motion.circle
          key={p.date.getTime()}
          initial={{ r: 0 }}
          animate={{ r: 5 }}
          transition={{ duration: 0.5, delay: FADE_IN_DELAY + i * 0.05 }}
          cx={xScale(p.date)}
          cy={yScale(p.price)}
          fill="currentColor"
          strokeWidth={2}
          stroke={
            minutes.findIndex((m) => isSameMinute(m, p.date)) % 2 === 1
              ? "#f5f5f4"
              : "white"
          }
        />
      ))}
    </svg>
  );
}
