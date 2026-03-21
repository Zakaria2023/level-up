import { renderBooleanValue } from "@/lib/utils/helpers";
import type { EducationalStageConfigurationRow } from "../types";

export const EDUCATIONAL_STAGE_CONFIGURATION_ROWS: EducationalStageConfigurationRow[] =
  [
    {
      id: 1,
      academicYearId: 1,
      stageName: "Primary Stage",
      requiredEnrollmentAge: 6,
      teachingLanguage: "English",
      isMixedStage: true,
    },
  ];

export const resolveAcademicYearLabel = (academicYearName?: string) =>
  academicYearName?.trim() || "Academic year not available";

export const formatEducationalStageLabel = (
  stageName: string,
  academicYearName?: string,
) =>
  academicYearName?.trim()
    ? `${stageName} - ${academicYearName}`
    : stageName;

export const toDetailFields = (
  row: EducationalStageConfigurationRow,
  academicYearName?: string,
) => [
  {
    label: "Academic Year",
    value: resolveAcademicYearLabel(academicYearName),
  },
  {
    label: "Stage Name",
    value: row.stageName,
  },
  {
    label: "Required Enrollment Age",
    value: String(row.requiredEnrollmentAge),
  },
  {
    label: "Teaching Language",
    value: row.teachingLanguage,
  },
  {
    label: "Mixed Stage",
    value: renderBooleanValue(row.isMixedStage),
  },
];
