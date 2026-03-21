"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import { renderBooleanValue } from "@/lib/utils/helpers";
import Link from "next/link";
import { toDetailFields } from "../../constants";
import { formatDuration, formatSchoolDays } from "../../helpers";
import { useStudyPeriodSettingsStore } from "../../store/useStudyPeriodSettingsStore";

type StudyPeriodSettingsDetailsProps = {
  rowId: number;
};

export const StudyPeriodSettingsDetails = ({
  rowId,
}: StudyPeriodSettingsDetailsProps) => {
  const row = useStudyPeriodSettingsStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );

  if (!row) {
    return (
      <DashboardCard
        title="Study Period Settings Not Found"
        subtitle="The requested record could not be found in the current session."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/study-period-settings"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Back to Table
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-240 space-y-6">
      <DashboardCard
        title={`Study Period Settings #${row.id}`}
        subtitle="Review the stored values for this study period settings record."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/settings/study-period-settings"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              Back
            </Link>
            <Link
              href={`/settings/study-period-settings/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              Edit
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {toDetailFields(row).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>

      <div className="space-y-4">
        {row.periods.map((period, index) => (
          <DashboardCard
            key={`${period.periodName}-${index}`}
            title={`Period ${index + 1}`}
            subtitle={period.periodName}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailField label="School Days" value={formatSchoolDays(period.schoolDays)} />
              <DetailField label="Start Time" value={period.startTime} />
              <DetailField label="End Time" value={period.endTime} />
              <DetailField
                label="Duration"
                value={formatDuration(period.durationMinutes)}
              />
              <DetailField
                label="Break After Period"
                value={renderBooleanValue(period.hasBreakAfterPeriod)}
              />
              <DetailField
                label="Break Name"
                value={period.hasBreakAfterPeriod ? period.breakName : "No break"}
              />
              <DetailField
                label="Break Start Time"
                value={period.hasBreakAfterPeriod ? period.breakStartTime : "--"}
              />
              <DetailField
                label="Break End Time"
                value={period.hasBreakAfterPeriod ? period.breakEndTime : "--"}
              />
            </div>

            {period.hasBreakAfterPeriod ? (
              <div className="mt-4 rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4 text-sm text-(--muted-text)">
                Break duration:{" "}
                <span className="font-semibold text-(--foreground)">
                  {formatDuration(period.breakDurationMinutes)}
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
