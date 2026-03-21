import { renderBooleanValue } from "@/lib/utils/helpers";
import type { SchoolClassConfigurationRow } from "../types";

export const SCHOOL_CLASS_CONFIGURATION_ROWS: SchoolClassConfigurationRow[] = [
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

export const toDetailFields = (
  row: SchoolClassConfigurationRow,
  educationalStageName?: string,
) => [
  {
    label: "Class Name",
    value: row.className,
  },
  {
    label: "Educational Stage",
    value: resolveEducationalStageLabel(educationalStageName),
  },
  {
    label: "Minimum Passing Grade",
    value: `${row.minimumPassingGrade}%`,
  },
  {
    label: "Active",
    value: renderBooleanValue(row.isActive),
  },
];
