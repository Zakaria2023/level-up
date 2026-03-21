"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toDetailFields } from "../../constants";
import { formatDuration, formatSchoolDays, formatStatusValue } from "../../helpers";
import { useStudyPeriodSettingsStore } from "../../store/useStudyPeriodSettingsStore";

type StudyPeriodSettingsDetailsProps = {
  rowId: number;
};

export const StudyPeriodSettingsDetails = ({
  rowId,
}: StudyPeriodSettingsDetailsProps) => {
  const { t } = useTranslation();

  const row = useStudyPeriodSettingsStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );

  if (!row) {
    return (
      <DashboardCard
        title={t("StudyPeriodSettingsDetails.notFoundTitle")}
        subtitle={t("StudyPeriodSettingsDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/study-period-settings"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("StudyPeriodSettingsDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-240 space-y-6">
      <DashboardCard
        title={t("StudyPeriodSettingsDetails.title", { id: row.id })}
        subtitle={t("StudyPeriodSettingsDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/settings/study-period-settings"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("StudyPeriodSettingsDetails.back")}
            </Link>
            <Link
              href={`/settings/study-period-settings/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("StudyPeriodSettingsDetails.edit")}
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {toDetailFields(row, t).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>

      <div className="space-y-4">
        {row.periods.map((period, index) => (
          <DashboardCard
            key={`${period.periodName}-${index}`}
            title={t("StudyPeriodSettingsDetails.periodTitle", { index: index + 1 })}
            subtitle={period.periodName}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.schoolDays")}
                value={formatSchoolDays(period.schoolDays, t)}
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.startTime")}
                value={period.startTime}
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.endTime")}
                value={period.endTime}
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.duration")}
                value={formatDuration(period.durationMinutes, t)}
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.breakAfterPeriod")}
                value={formatStatusValue(period.hasBreakAfterPeriod, t)}
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.breakName")}
                value={
                  period.hasBreakAfterPeriod
                    ? period.breakName
                    : t("StudyPeriodSettingsDetails.noBreak")
                }
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.breakStartTime")}
                value={period.hasBreakAfterPeriod ? period.breakStartTime : "--"}
              />
              <DetailField
                label={t("StudyPeriodSettingsDetails.fields.breakEndTime")}
                value={period.hasBreakAfterPeriod ? period.breakEndTime : "--"}
              />
            </div>

            {period.hasBreakAfterPeriod ? (
              <div className="mt-4 rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4 text-sm text-(--muted-text)">
                {t("StudyPeriodSettingsDetails.breakDuration")}{" "}
                <span className="font-semibold text-(--foreground)">
                  {formatDuration(period.breakDurationMinutes, t)}
                </span>
              </div>
            ) : null}
          </DashboardCard>
        ))}
      </div>
    </div>
  );
};

export default StudyPeriodSettingsDetails;
