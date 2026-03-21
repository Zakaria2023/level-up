import { renderBooleanValue } from "@/lib/utils/helpers";
import { TFunction } from "i18next";
import type { AcademicYearRow } from "../types";

export const ACADEMIC_YEAR_SEMESTER_OPTIONS = [
  { label: "First Semester", value: "First Semester" },
  { label: "Second Semester", value: "Second Semester" },
  { label: "Third Semester", value: "Third Semester" },
  { label: "Summer Semester", value: "Summer Semester" },
];

export const ACADEMIC_YEAR_ROWS: AcademicYearRow[] = [
  {
    id: 1,
    academicYearName: "2025 / 2026",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    registrationStartDate: "2025-07-15",
    registrationEndDate: "2025-10-01",
    allowGradeEditingAfterEnd: false,
    allowStudentFileEditingAfterEnd: false,
    semesters: "First Semester, Second Semester",
    isActive: true,
    hasActiveStudentRecord: true,
  },
];

export const toDetailFields = (row: AcademicYearRow, t: TFunction) => [
  {
    label: t("AcademicYearDetails.fields.academicYearName"),
    value: row.academicYearName,
  },
  {
    label: t("AcademicYearDetails.fields.startDate"),
    value: row.startDate,
  },
  {
    label: t("AcademicYearDetails.fields.endDate"),
    value: row.endDate,
  },
  {
    label: t("AcademicYearDetails.fields.registrationStartDate"),
    value: row.registrationStartDate,
  },
  {
    label: t("AcademicYearDetails.fields.registrationEndDate"),
    value: row.registrationEndDate,
  },
  {
    label: t("AcademicYearDetails.fields.allowGradeEditingAfterEnd"),
    value: renderBooleanValue(row.allowGradeEditingAfterEnd),
  },
  {
    label: t("AcademicYearDetails.fields.allowStudentFileEditingAfterEnd"),
    value: renderBooleanValue(row.allowStudentFileEditingAfterEnd),
  },
  {
    label: t("AcademicYearDetails.fields.semesters"),
    value: row.semesters,
  },
  {
    label: t("AcademicYearDetails.fields.active"),
    value: renderBooleanValue(row.isActive),
  },
];
