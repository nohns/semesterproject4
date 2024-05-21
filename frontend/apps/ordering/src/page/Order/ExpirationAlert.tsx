import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui";
import {
  addSeconds,
  differenceInSeconds,
  formatDistanceStrict,
} from "date-fns";
import { da as daLocale } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";

interface ExpirationAlertProps {
  expiry?: Date;
}

export default function ExpirationAlert({ expiry }: ExpirationAlertProps) {
  const [countdown, setCountdown] = useState(0);

  // Countdown if it has not already reached 0
  useEffect(() => {
    if (countdown === 0) return;
    if (!expiry) return;
    const handle = setTimeout(() => {
      setCountdown(differenceInSeconds(expiry, new Date()));
    }, 1000);
    return () => clearTimeout(handle);
  }, [countdown, setCountdown, expiry]);

  useEffect(() => {
    if (!expiry) return;
    const diffInSecs = differenceInSeconds(expiry, new Date());
    if (diffInSecs <= 0) return;
    setCountdown(diffInSecs + 1);
  }, [expiry, setCountdown]);

  // Use date-fns to format a locale correct time interval until next reserved price, shown in seconds.
  const formattedCountdown = useMemo(() => {
    if (isNaN(countdown)) {
      return "-";
    }
    const futureDate = addSeconds(new Date(), countdown);
    return formatDistanceStrict(futureDate, new Date(), {
      unit: "second",
      locale: daLocale,
    });
  }, [countdown]);

  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <AlertTitle>Pris midlertidigt fastfrosset</AlertTitle>
      <AlertDescription>
        Du kan købe drikkevaren for nedenstående pris i {formattedCountdown}{" "}
        endnu ⌛️
      </AlertDescription>
    </Alert>
  );
}
