import { useEffect, useState } from "react";

export const useDashboardRealTime = (initialNowIso: string) => {
  const [now, setNow] = useState(() => new Date(initialNowIso));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [initialNowIso]);

  return now;
};
