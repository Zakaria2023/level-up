import type {
  SemesterConfigurationRow,
  SemesterEvaluationType,
} from "../types";

export const SEMESTER_EVALUATION_TYPE_OPTIONS: {
  label: string;
  value: SemesterEvaluationType;
}[] = [
  { label: "Monthly", value: "Monthly" },
  { label: "Midterm", value: "Midterm" },
  { label: "Final", value: "Final" },
];

export const SEMESTER_CONFIGURATION_ROWS: SemesterConfigurationRow[] = [
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
  row: SemesterConfigurationRow,
  academicYearName?: string,
) => [
  {
    label: "Semester Name",
    value: row.semesterName,
  },
  {
    label: "Academic Year",
    value: resolveAcademicYearLabel(academicYearName),
  },
  {
    label: "Semester Start Date",
    value: row.semesterStartDate,
  },
  {
    label: "Semester End Date",
    value: row.semesterEndDate,
  },
  {
    label: "Actual Lessons Start Date",
    value: row.actualLessonsStartDate,
  },
  {
    label: "Actual Lessons End Date",
    value: row.actualLessonsEndDate,
  },
  {
    label: "Final Exam Date",
    value: row.finalExamDate,
  },
  {
    label: "Evaluation Type",
    value: row.evaluationType,
  },
];
