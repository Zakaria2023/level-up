import { renderBooleanValue } from "@/lib/utils/helpers";
import type {
  SubjectConfigurationRow,
  SubjectGradeBreakdown,
  SubjectType,
} from "../types";

export const SUBJECT_TYPE_OPTIONS: { label: string; value: SubjectType }[] = [
  { label: "Core", value: "Core" },
  { label: "Enrichment", value: "Enrichment" },
];

export const SUBJECT_TEACHER_OPTIONS = [
  { label: "Ahmad Darwish", value: "ahmad-darwish" },
  { label: "Maya Saleh", value: "maya-saleh" },
  { label: "Khaled Nasser", value: "khaled-nasser" },
  { label: "Rasha Hamdan", value: "rasha-hamdan" },
];

export const SUBJECT_CONFIGURATION_ROWS: SubjectConfigurationRow[] = [
  {
    id: 1,
    subjectName: "Mathematics",
    subjectType: "Core",
    classSettings: [
      {
        schoolClassId: 1,
        weeklyPeriodsCount: 5,
        periodDurationMinutes: 45,
      },
    ],
    teacherIds: ["ahmad-darwish", "maya-saleh"],
    countsTowardAverage: true,
    minimumPassingGrade: 50,
    gradeBreakdown: [
      { activityName: "Homework", percentage: 20 },
      { activityName: "Midterm", percentage: 30 },
      { activityName: "Final Exam", percentage: 50 },
    ],
    requiresLab: false,
    hasQuestionBank: true,
    teachingLanguage: "English",
  },
];

export const resolveSchoolClassLabel = (schoolClassName?: string) =>
  schoolClassName?.trim() || "School class not available";

export const resolveTeacherLabel = (teacherName?: string) =>
  teacherName?.trim() || "Teacher not available";

export const summarizeTeacherNames = (
  teacherIds: string[],
  teacherMap: Map<string, string>,
) =>
  teacherIds
    .map((teacherId) => resolveTeacherLabel(teacherMap.get(teacherId)))
    .join(", ");

export const summarizeClassSettings = (
  row: SubjectConfigurationRow,
  schoolClassMap: Map<number, string>,
) =>
  row.classSettings
    .map(
      (setting) =>
        `${resolveSchoolClassLabel(
          schoolClassMap.get(setting.schoolClassId),
        )} (${setting.weeklyPeriodsCount}/week, ${setting.periodDurationMinutes} min)`,
    )
    .join(", ");

export const summarizeGradeBreakdown = (
  gradeBreakdown: SubjectGradeBreakdown[],
) =>
  gradeBreakdown
    .map((item) => `${item.activityName} ${item.percentage}%`)
    .join(", ");

export const toDetailFields = (
  row: SubjectConfigurationRow,
  schoolClassMap: Map<number, string>,
  teacherMap: Map<string, string>,
) => [
  {
    label: "Subject Name",
    value: row.subjectName,
  },
  {
    label: "Subject Type",
    value: row.subjectType,
  },
  {
    label: "Counts Toward Average",
    value: renderBooleanValue(row.countsTowardAverage),
  },
  {
    label: "Minimum Passing Grade",
    value: `${row.minimumPassingGrade}%`,
  },
  {
    label: "Requires Lab",
    value: renderBooleanValue(row.requiresLab),
  },
  {
    label: "Has Question Bank",
    value: renderBooleanValue(row.hasQuestionBank),
  },
  {
    label: "Teaching Language",
    value: row.teachingLanguage,
  },
  {
    label: "Teachers",
    value: summarizeTeacherNames(row.teacherIds, teacherMap),
  },
  {
    label: "School Classes",
    value: summarizeClassSettings(row, schoolClassMap),
  },
  {
    label: "Grade Breakdown",
    value: summarizeGradeBreakdown(row.gradeBreakdown),
  },
];
