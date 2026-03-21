"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  resolveSchoolClassLabel,
  resolveTeacherLabel,
  toDetailFields,
} from "../../constants";
import { useSubjectTable } from "../../hooks/useSubjectTable";
import { useSubjectStore } from "../../store/useSubjectStore";

type SubjectDetailsProps = {
  rowId: number;
};

export const SubjectDetails = ({
  rowId,
}: SubjectDetailsProps) => {
  const { t } = useTranslation();

  const row = useSubjectStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );
  const { schoolClassMap, teacherMap } = useSubjectTable();

  if (!row) {
    return (
      <DashboardCard
        title={t("SubjectDetails.notFoundTitle")}
        subtitle={t("SubjectDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/subject"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SubjectDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-240 space-y-6">
      <DashboardCard
        title={t("SubjectDetails.title", { id: row.id })}
        subtitle={t("SubjectDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/subject"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("SubjectDetails.back")}
            </Link>
            <Link
              href={`/subject/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("SubjectDetails.edit")}
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toDetailFields(row, t, schoolClassMap, teacherMap).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title={t("SubjectDetails.classSettingsTitle")}
        subtitle={t("SubjectDetails.classSettingsSubtitle")}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {row.classSettings.map((setting, index) => (
            <DetailField
              key={`${setting.schoolClassId}-${index}`}
              label={resolveSchoolClassLabel(schoolClassMap.get(setting.schoolClassId))}
              value={t("SubjectDetails.classSettingsValue", {
                weeklyPeriodsCount: setting.weeklyPeriodsCount,
                periodDurationMinutes: setting.periodDurationMinutes,
              })}
            />
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title={t("SubjectDetails.teachersTitle")}
        subtitle={t("SubjectDetails.teachersSubtitle")}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {row.teacherIds.map((teacherId) => (
            <DetailField
              key={teacherId}
              label={t("SubjectDetails.teacher")}
              value={resolveTeacherLabel(teacherMap.get(teacherId))}
            />
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title={t("SubjectDetails.gradeBreakdownTitle")}
        subtitle={t("SubjectDetails.gradeBreakdownSubtitle")}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {row.gradeBreakdown.map((item, index) => (
            <DetailField
              key={`${item.activityName}-${index}`}
              label={item.activityName}
              value={t("SubjectDetails.percentageValue", {
                percentage: item.percentage,
              })}
            />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default SubjectDetails;