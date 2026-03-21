import { renderBooleanValue } from "@/lib/utils/helpers";
import { TFunction } from "i18next";
import type { SchoolClassRow } from "../types";

export const SCHOOL_CLASS_ROWS: SchoolClassRow[] = [
  {
    id: 1,
    className: "Grade 1",
    educationalStageId: 1,
    minimumPassingGrade: 50,
    isActive: true,
  },
];

export const resolveEducationalStageLabel = (educationalStageName?: string) =>
  educationalStageName?.trim() || "Educational stage not available";

export const formatSchoolClassLabel = (
  className: string,
  educationalStageName?: string,
) =>
  educationalStageName?.trim()
    ? `${className} - ${educationalStageName}`
    : className;

export const toDetailFields = (
  row: SchoolClassRow,
  t: TFunction,
  educationalStageName?: string,
) => [
  {
    label: t("SchoolClassDetails.fields.className"),
    value: row.className,
  },
  {
    label: t("SchoolClassDetails.fields.educationalStage"),
    value: resolveEducationalStageLabel(educationalStageName),
  },
  {
    label: t("SchoolClassDetails.fields.minimumPassingGrade"),
    value: `${row.minimumPassingGrade}%`,
  },
  {
    label: t("SchoolClassDetails.fields.active"),
    value: renderBooleanValue(row.isActive),
  },
];
