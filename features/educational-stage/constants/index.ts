import { renderBooleanValue } from "@/lib/utils/helpers";
import { TFunction } from "i18next";
import type { EducationalStageRow } from "../types";

export const EDUCATIONAL_STAGE_ROWS: EducationalStageRow[] = [
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
  academicYearName?.trim() ? `${stageName} - ${academicYearName}` : stageName;

export const toDetailFields = (
  row: EducationalStageRow,
  t: TFunction,
  academicYearName?: string,
) => [
  {
    label: t("EducationalStageDetails.fields.academicYear"),
    value: resolveAcademicYearLabel(academicYearName),
  },
  {
    label: t("EducationalStageDetails.fields.stageName"),
    value: row.stageName,
  },
  {
    label: t("EducationalStageDetails.fields.requiredEnrollmentAge"),
    value: String(row.requiredEnrollmentAge),
  },
  {
    label: t("EducationalStageDetails.fields.teachingLanguage"),
    value: row.teachingLanguage,
  },
  {
    label: t("EducationalStageDetails.fields.mixedStage"),
    value: renderBooleanValue(row.isMixedStage),
  },
];
