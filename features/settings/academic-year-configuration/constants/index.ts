import { renderBooleanValue } from "@/lib/utils/helpers";
import type { AcademicYearConfigurationRow } from "../types";

export const ACADEMIC_YEAR_CONFIGURATION_ROWS: AcademicYearConfigurationRow[] = [
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

export const toDetailFields = (row: AcademicYearConfigurationRow) => [
  {
    label: "Academic Year Name",
    value: row.academicYearName,
  },
  {
    label: "Start Date",
    value: row.startDate,
  },
  {
    label: "End Date",
    value: row.endDate,
  },
  {
    label: "Registration Start Date",
    value: row.registrationStartDate,
  },
  {
    label: "Registration End Date",
    value: row.registrationEndDate,
  },
  {
    label: "Allow Grade Editing After End",
    value: renderBooleanValue(row.allowGradeEditingAfterEnd),
  },
  {
    label: "Allow Student File Editing After End",
    value: renderBooleanValue(row.allowStudentFileEditingAfterEnd),
  },
  {
    label: "Semesters",
    value: row.semesters,
  },
  {
    label: "Active",
    value: renderBooleanValue(row.isActive),
  },
];
