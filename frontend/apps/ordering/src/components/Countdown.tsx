/** @format */

import Countdown, { CountdownRenderProps } from "react-countdown";

function CountDown() {
  //We likely need to add some state here to keep track of the time left and prevent rerenders
  //Should communicate with the server to get the time left potentialy

  console.log("CountDown rendered");
  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      return <span>Tiden er gået</span>;
    } else {
      // Only show non-zero time units, prioritizing the largest unit.
      // Handle hours
      if (hours) {
        return (
          <span>
            {hours} time{hours !== 1 ? "r" : ""}
          </span>
        );
      }
      // Handle minutes
      else if (minutes) {
        if (minutes === 1) {
          return <span>{minutes} minut</span>; // Singular form for "minute"
        } else {
          return <span>{minutes} minutter</span>;
        }
      }
      // Handle seconds
      else {
        if (seconds === 1) {
          return <span>{seconds} sekund</span>; // Singular form for "second"
        } else {
          return <span>{seconds} sekunder</span>;
        }
      }
    }
  };

  return <Countdown date={Date.now() + 100000} renderer={renderer} />;
}

export default CountDown;
