import { renderBooleanValue } from "@/lib/utils/helpers";
import type { EducationalStageConfigurationRow } from "../types";

export const EDUCATIONAL_STAGE_CONFIGURATION_ROWS: EducationalStageConfigurationRow[] =
  [
    {
      id: 1,
      stageName: "Primary Stage",
      requiredEnrollmentAge: 6,
      gradeCategory: "Primary Grades",
      isMixedStage: true,
    },
  ];

export const toDetailFields = (row: EducationalStageConfigurationRow) => [
  {
    label: "Stage Name",
    value: row.stageName,
  },
  {
    label: "Required Enrollment Age",
    value: String(row.requiredEnrollmentAge),
  },
  {
    label: "Grade Category",
    value: row.gradeCategory,
  },
  {
    label: "Mixed Stage",
    value: renderBooleanValue(row.isMixedStage),
  },
];
