"use client";

import { z } from "zod";

const subjectTypeValues = ["Core", "Enrichment"] as const;

const createSubjectClassSettingSchema = (t: (key: string) => string) =>
  z.object({
    schoolClassId: z
      .string()
      .trim()
      .min(1, t("SubjectSchema.errors.schoolClassRequired")),

    weeklyPeriodsCount: z
      .number({
        error: t("SubjectSchema.errors.weeklyPeriodsCountRequired"),
      })
      .int(t("SubjectSchema.errors.weeklyPeriodsCountInteger"))
      .min(1, t("SubjectSchema.errors.weeklyPeriodsCountMin"))
      .max(20, t("SubjectSchema.errors.weeklyPeriodsCountMax")),

    periodDurationMinutes: z
      .number({
        error: t("SubjectSchema.errors.periodDurationRequired"),
      })
      .int(t("SubjectSchema.errors.periodDurationInteger"))
      .min(1, t("SubjectSchema.errors.periodDurationMin"))
      .max(180, t("SubjectSchema.errors.periodDurationMax")),
  });

const createSubjectGradeBreakdownSchema = (t: (key: string) => string) =>
  z.object({
    activityName: z
      .string()
      .trim()
      .min(1, t("SubjectSchema.errors.activityNameRequired")),

    percentage: z
      .number({
        error: t("SubjectSchema.errors.activityPercentageRequired"),
      })
      .min(0.01, t("SubjectSchema.errors.activityPercentageMin"))
      .max(100, t("SubjectSchema.errors.activityPercentageMax")),
  });

export const createSubjectFormSchema = (t: (key: string) => string) =>
  z
    .object({
      subjectName: z
        .string()
        .trim()
        .min(1, t("SubjectSchema.errors.subjectNameRequired")),

      subjectType: z.enum(subjectTypeValues, {
        error: t("SubjectSchema.errors.subjectTypeRequired"),
      }),

      classSettings: z
        .array(createSubjectClassSettingSchema(t))
        .min(1, t("SubjectSchema.errors.classSettingsRequired")),

      teacherIds: z
        .array(z.string().trim())
        .min(1, t("SubjectSchema.errors.teacherIdsRequired")),

      countsTowardAverage: z.boolean(),

      minimumPassingGrade: z
        .number({
          error: t("SubjectSchema.errors.minimumPassingGradeRequired"),
        })
        .min(0, t("SubjectSchema.errors.minimumPassingGradeMin"))
        .max(100, t("SubjectSchema.errors.minimumPassingGradeMax")),

      gradeBreakdown: z
        .array(createSubjectGradeBreakdownSchema(t))
        .min(1, t("SubjectSchema.errors.gradeBreakdownRequired")),

      requiresLab: z.boolean(),
      hasQuestionBank: z.boolean(),

      teachingLanguage: z
        .string()
        .trim()
        .min(1, t("SubjectSchema.errors.teachingLanguageRequired")),
    })
    .superRefine((values, context) => {
      const totalPercentage = values.gradeBreakdown.reduce(
        (total, item) => total + item.percentage,
        0,
      );

      if (Math.abs(totalPercentage - 100) > 0.001) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gradeBreakdown"],
          message: t("SubjectSchema.errors.gradeBreakdownTotal"),
        });
      }
    });

export type SubjectFormValues = z.infer<
  ReturnType<typeof createSubjectFormSchema>
>;

export type SubjectInput = z.input<ReturnType<typeof createSubjectFormSchema>>;
