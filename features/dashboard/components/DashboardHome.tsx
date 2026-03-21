"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const DEFAULT_USER_NAME = "Level Up User";

const getGreeting = (date: Date) => {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
};

const getStoredUserName = () => {
  if (typeof window === "undefined") {
    return DEFAULT_USER_NAME;
  }

  return window.localStorage.getItem("level_up_user_name") || DEFAULT_USER_NAME;
};

export const DashboardHome = () => {
  const [now, setNow] = useState(() => new Date());
  const userName = getStoredUserName();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-260 md:mt-40">
      <DashboardCard className="border-(--border-color) bg-(--surface) shadow-[0_28px_70px_rgba(11,86,95,0.12)]">
        <div className="space-y-6 p-6 md:p-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-(--foreground) md:text-4xl">
              {getGreeting(now)}, {userName}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-3xl border border-(--border-color) bg-(--surface-muted) p-5 shadow-[0_18px_36px_rgba(11,86,95,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--muted-text)">
                Today
              </p>
              <p className="mt-3 text-2xl font-semibold text-(--foreground) md:text-3xl">
                {format(now, "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div className="rounded-3xl border border-(--border-color) bg-(--surface) p-5 shadow-[0_24px_42px_rgba(26,149,164,0.12)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--muted-text)">
                Current Time
              </p>
              <p className="mt-3 font-mono text-3xl font-semibold text-(--foreground) md:text-4xl">
                {format(now, "hh:mm:ss a")}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default DashboardHome;
