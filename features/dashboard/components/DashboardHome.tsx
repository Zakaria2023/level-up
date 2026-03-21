"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { format } from "date-fns";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { getStoredUserName } from "../helpers";
import { useDashboardRealTime } from "../hooks/useDashboardRealTime";

const getGreeting = (date: Date, t: TFunction) => {
  const hour = date.getHours();

  if (hour < 12) {
    return t("DashboardHome.goodMorning");
  }

  if (hour < 18) {
    return t("DashboardHome.goodAfternoon");
  }

  return t("DashboardHome.goodEvening");
};

export const DashboardHome = () => {
  const { t } = useTranslation();
  const now = useDashboardRealTime();
  const userName = getStoredUserName();

  return (
    <div className="mx-auto w-full max-w-260 md:mt-40">
      <DashboardCard className="border-(--border-color) bg-(--surface) shadow-[0_28px_70px_rgba(11,86,95,0.12)]">
        <div className="space-y-6 p-6 md:p-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-(--foreground) md:text-4xl">
              {getGreeting(now, t)}, {userName}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-3xl border border-(--border-color) bg-(--surface-muted) p-5 shadow-[0_18px_36px_rgba(11,86,95,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--muted-text)">
                {t("DashboardHome.today")}
              </p>
              <p className="mt-3 text-2xl font-semibold text-(--foreground) md:text-3xl">
                {format(now, "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div className="rounded-3xl border border-(--border-color) bg-(--surface) p-5 shadow-[0_24px_42px_rgba(26,149,164,0.12)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--muted-text)">
                {t("DashboardHome.currentTime")}
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