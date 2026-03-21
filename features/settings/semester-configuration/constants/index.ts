import { TFunction } from "i18next";
import type { SemesterEvaluationType, SemesterRow } from "../types";

export const SEMESTER_EVALUATION_TYPE_OPTIONS: {
  label: string;
  value: SemesterEvaluationType;
}[] = [
  { label: "Monthly", value: "Monthly" },
  { label: "Midterm", value: "Midterm" },
  { label: "Final", value: "Final" },
];

export const SEMESTER_ROWS: SemesterRow[] = [
  {
    id: 1,
    semesterName: "First Semester",
    academicYearId: 1,
    semesterStartDate: "2025-09-01",
    semesterEndDate: "2026-01-15",
    actualLessonsStartDate: "2025-09-07",
    actualLessonsEndDate: "2026-01-05",
    finalExamDate: "2026-01-12",
    evaluationType: "Midterm",
  },
];

export const resolveAcademicYearLabel = (academicYearName?: string) =>
  academicYearName?.trim() || "Academic Year Not Available";

export const toDetailFields = (
  row: SemesterRow,
  t: TFunction,
  academicYearName?: string,
) => [
  {
    label: t("SemesterDetails.fields.semesterName"),
    value: row.semesterName,
  },
  {
    label: t("SemesterDetails.fields.academicYear"),
    value: resolveAcademicYearLabel(academicYearName),
  },
  {
    label: t("SemesterDetails.fields.semesterStartDate"),
    value: row.semesterStartDate,
  },
  {
    label: t("SemesterDetails.fields.semesterEndDate"),
    value: row.semesterEndDate,
  },
  {
    label: t("SemesterDetails.fields.actualLessonsStartDate"),
    value: row.actualLessonsStartDate,
  },
  {
    label: t("SemesterDetails.fields.actualLessonsEndDate"),
    value: row.actualLessonsEndDate,
  },
  {
    label: t("SemesterDetails.fields.finalExamDate"),
    value: row.finalExamDate,
  },
  {
    label: t("SemesterDetails.fields.evaluationType"),
    value: row.evaluationType,
  },
];
