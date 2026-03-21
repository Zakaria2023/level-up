"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import { formatSchoolClassLabel } from "@/features/school-class/constants";
import { useSchoolClassStore } from "@/features/school-class/store/useSchoolClassStore";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../../educational-stage/constants";
import { useEducationalStageStore } from "../../../educational-stage/store/useEducationalStageStore";
import {
  resolveSupervisorLabel,
  SECTION_SUPERVISOR_OPTIONS,
  toDetailFields,
} from "../../constants";
import { useSchoolSectionStore } from "../../store/useSchoolSectionStore";

type SchoolSectionDetailsProps = {
  rowId: number;
};

export const SchoolSectionDetails = ({
  rowId,
}: SchoolSectionDetailsProps) => {
  const { t } = useTranslation();

  const row = useSchoolSectionStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );

  const schoolClass = useSchoolClassStore((state) =>
    row ? state.rows.find((item) => item.id === row.schoolClassId) : undefined,
  );

  const educationalStage = useEducationalStageStore((state) =>
    schoolClass
      ? state.rows.find((item) => item.id === schoolClass.educationalStageId)
      : undefined,
  );

  const academicYearName = useAcademicYearStore((state) =>
    educationalStage
      ? state.rows.find((item) => item.id === educationalStage.academicYearId)
        ?.academicYearName
      : undefined,
  );

  const supervisorName = resolveSupervisorLabel(
    SECTION_SUPERVISOR_OPTIONS.find((item) => item.value === row?.supervisorId)
      ?.label,
  );

  if (!row) {
    return (
      <DashboardCard
        title={t("SchoolSectionDetails.notFoundTitle")}
        subtitle={t("SchoolSectionDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/school-section"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SchoolSectionDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-220 space-y-6">
      <DashboardCard
        title={t("SchoolSectionDetails.title", { id: row.id })}
        subtitle={t("SchoolSectionDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/school-section"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("SchoolSectionDetails.back")}
            </Link>
            <Link
              href={`/school-section/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("SchoolSectionDetails.edit")}
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {toDetailFields(
            row,
            t,
            schoolClass
              ? formatSchoolClassLabel(
                schoolClass.className,
                educationalStage
                  ? formatEducationalStageLabel(
                    educationalStage.stageName,
                    resolveAcademicYearLabel(academicYearName),
                  )
                  : undefined,
              )
              : undefined,
            supervisorName,
          ).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default SchoolSectionDetails;