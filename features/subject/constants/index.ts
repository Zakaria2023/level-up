import { renderBooleanValue } from "@/lib/utils/helpers";
import { TFunction } from "i18next";
import type { SubjectGradeBreakdown, SubjectRow, SubjectType } from "../types";

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

export const SUBJECT_ROWS: SubjectRow[] = [
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
  row: SubjectRow,
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
  row: SubjectRow,
  t: TFunction,
  schoolClassMap: Map<number, string>,
  teacherMap: Map<string, string>,
) => [
  {
    label: t("SubjectDetails.fields.subjectName"),
    value: row.subjectName,
  },
  {
    label: t("SubjectDetails.fields.subjectType"),
    value: row.subjectType,
  },
  {
    label: t("SubjectDetails.fields.countsTowardAverage"),
    value: renderBooleanValue(row.countsTowardAverage),
  },
  {
    label: t("SubjectDetails.fields.minimumPassingGrade"),
    value: `${row.minimumPassingGrade}%`,
  },
  {
    label: t("SubjectDetails.fields.requiresLab"),
    value: renderBooleanValue(row.requiresLab),
  },
  {
    label: t("SubjectDetails.fields.hasQuestionBank"),
    value: renderBooleanValue(row.hasQuestionBank),
  },
  {
    label: t("SubjectDetails.fields.teachingLanguage"),
    value: row.teachingLanguage,
  },
  {
    label: t("SubjectDetails.fields.teachers"),
    value: summarizeTeacherNames(row.teacherIds, teacherMap),
  },
  {
    label: t("SubjectDetails.fields.schoolClasses"),
    value: summarizeClassSettings(row, schoolClassMap),
  },
  {
    label: t("SubjectDetails.fields.gradeBreakdown"),
    value: summarizeGradeBreakdown(row.gradeBreakdown),
  },
];
