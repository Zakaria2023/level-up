"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import { useAcademicYearStore } from "../../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../../educational-stage-configuration/constants";
import { useEducationalStageConfigurationStore } from "../../../educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { formatSchoolClassLabel } from "../../../school-class-configuration/constants";
import { useSchoolClassConfigurationStore } from "../../../school-class-configuration/store/useSchoolClassConfigurationStore";
import {
  resolveSupervisorLabel,
  SECTION_SUPERVISOR_OPTIONS,
  toDetailFields,
} from "../../constants";
import { useSchoolSectionConfigurationStore } from "../../store/useSchoolSectionConfigurationStore";

type SchoolSectionConfigurationDetailsProps = {
  rowId: number;
};

export const SchoolSectionConfigurationDetails = ({
  rowId,
}: SchoolSectionConfigurationDetailsProps) => {
  const row = useSchoolSectionConfigurationStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );
  const schoolClass = useSchoolClassConfigurationStore((state) =>
    row ? state.rows.find((item) => item.id === row.schoolClassId) : undefined,
  );
  const educationalStage = useEducationalStageConfigurationStore((state) =>
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
        title="School Section Configuration Not Found"
        subtitle="The requested record could not be found in the current session."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/school-section-configuration"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Back to Table
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-220 space-y-6">
      <DashboardCard
        title={`School Section Configuration #${row.id}`}
        subtitle="Review the stored values for this school section configuration record."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/school-section-configuration"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              Back
            </Link>
            <Link
              href={`/school-section-configuration/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              Edit
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {toDetailFields(
            row,
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

export default SchoolSectionConfigurationDetails;
