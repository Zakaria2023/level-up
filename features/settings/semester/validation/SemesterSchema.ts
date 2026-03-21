"use client";

import { z } from "zod";

const evaluationTypeValues = ["Monthly", "Midterm", "Final"] as const;

const isBefore = (startDate: string, endDate: string) => startDate > endDate;

export const createSemesterSchema = (t: (key: string) => string) =>
  z
    .object({
      semesterName: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.semesterNameRequired")),

      academicYearId: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.academicYearRequired")),

      semesterStartDate: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.semesterStartDateRequired")),

      semesterEndDate: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.semesterEndDateRequired")),

      actualLessonsStartDate: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.actualLessonsStartDateRequired")),

      actualLessonsEndDate: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.actualLessonsEndDateRequired")),

      finalExamDate: z
        .string()
        .trim()
        .min(1, t("SemesterSchema.errors.finalExamDateRequired")),

      evaluationType: z.enum(evaluationTypeValues, {
        error: t("SemesterSchema.errors.evaluationTypeRequired"),
      }),
    })
    .superRefine((values, context) => {
      if (isBefore(values.semesterStartDate, values.semesterEndDate)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["semesterEndDate"],
          message: t("SemesterSchema.errors.semesterEndDateAfterStart"),
        });
      }

      if (
        isBefore(values.actualLessonsStartDate, values.actualLessonsEndDate)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualLessonsEndDate"],
          message: t("SemesterSchema.errors.actualLessonsEndDateAfterStart"),
        });
      }

      if (isBefore(values.semesterStartDate, values.actualLessonsStartDate)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualLessonsStartDate"],
          message: t(
            "SemesterSchema.errors.actualLessonsStartDateAfterSemesterStart",
          ),
        });
      }

      if (isBefore(values.actualLessonsEndDate, values.semesterEndDate)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualLessonsEndDate"],
          message: t(
            "SemesterSchema.errors.actualLessonsEndDateBeforeSemesterEnd",
          ),
        });
      }

      if (isBefore(values.actualLessonsEndDate, values.finalExamDate)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["finalExamDate"],
          message: t("SemesterSchema.errors.finalExamDateAfterLessonsEnd"),
        });
      }
    });

export type SemesterFormValues = z.infer<
  ReturnType<typeof createSemesterSchema>
>;
export type SemesterInput = z.input<ReturnType<typeof createSemesterSchema>>;
