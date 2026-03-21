"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import { useAcademicYearStore } from "@/features/academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "@/features/educational-stage/constants";
import { useEducationalStageStore } from "@/features/educational-stage/store/useEducationalStageStore";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toDetailFields } from "../../constants";
import { useSchoolClassStore } from "../../store/useSchoolClassStore";

type SchoolClassDetailsProps = {
  rowId: number;
};

export const SchoolClassDetails = ({
  rowId,
}: SchoolClassDetailsProps) => {
  const { t } = useTranslation();

  const row = useSchoolClassStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );

  const educationalStage = useEducationalStageStore((state) =>
    row ? state.rows.find((item) => item.id === row.educationalStageId) : undefined,
  );

  const academicYearName = useAcademicYearStore((state) =>
    educationalStage
      ? state.rows.find((item) => item.id === educationalStage.academicYearId)
        ?.academicYearName
      : undefined,
  );

  if (!row) {
    return (
      <DashboardCard
        title={t("SchoolClassDetails.notFoundTitle")}
        subtitle={t("SchoolClassDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/school-class-configuration"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SchoolClassDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-220 space-y-6">
      <DashboardCard
        title={t("SchoolClassDetails.title", { id: row.id })}
        subtitle={t("SchoolClassDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/school-class-configuration"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("SchoolClassDetails.back")}
            </Link>
            <Link
              href={`/school-class-configuration/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("SchoolClassDetails.edit")}
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {toDetailFields(
            row,
            t,
            educationalStage
              ? formatEducationalStageLabel(
                educationalStage.stageName,
                resolveAcademicYearLabel(academicYearName),
              )
              : undefined,
          ).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default SchoolClassDetails;