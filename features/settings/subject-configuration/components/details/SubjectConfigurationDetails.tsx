"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import {
  resolveSchoolClassLabel,
  resolveTeacherLabel,
  toDetailFields,
} from "../../constants";
import { useSubjectConfigurationTable } from "../../hooks/useSubjectConfigurationTable";
import { useSubjectConfigurationStore } from "../../store/useSubjectConfigurationStore";

type SubjectConfigurationDetailsProps = {
  rowId: number;
};

export const SubjectConfigurationDetails = ({
  rowId,
}: SubjectConfigurationDetailsProps) => {
  const row = useSubjectConfigurationStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );
  const { schoolClassMap, teacherMap } = useSubjectConfigurationTable();

  if (!row) {
    return (
      <DashboardCard
        title="Subject Configuration Not Found"
        subtitle="The requested record could not be found in the current session."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/subject-configuration"
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
        title={`Subject Configuration #${row.id}`}
        subtitle="Review the stored values for this subject configuration record."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/subject-configuration"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              Back
            </Link>
            <Link
              href={`/subject-configuration/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              Edit
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toDetailFields(row, schoolClassMap, teacherMap).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Class Settings"
        subtitle="Weekly periods and duration by school class."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {row.classSettings.map((setting, index) => (
            <DetailField
              key={`${setting.schoolClassId}-${index}`}
              label={resolveSchoolClassLabel(schoolClassMap.get(setting.schoolClassId))}
              value={`${setting.weeklyPeriodsCount} per week, ${setting.periodDurationMinutes} min`}
            />
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Teachers"
        subtitle="Assigned teachers for this subject."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {row.teacherIds.map((teacherId) => (
            <DetailField
              key={teacherId}
              label="Teacher"
              value={resolveTeacherLabel(teacherMap.get(teacherId))}
            />
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Grade Breakdown"
        subtitle="Activities and their assigned percentages."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {row.gradeBreakdown.map((item, index) => (
            <DetailField
              key={`${item.activityName}-${index}`}
              label={item.activityName}
              value={`${item.percentage}%`}
            />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default SubjectConfigurationDetails;
