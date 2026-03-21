"use client";

import { z } from "zod";

export const createAcademicYearSchema = (t: (key: string) => string) =>
  z.object({
    academicYearName: z
      .string()
      .trim()
      .min(1, t("AcademicYearSchema.errors.academicYearNameRequired")),

    startDate: z
      .string()
      .trim()
      .min(1, t("AcademicYearSchema.errors.startDateRequired")),

    endDate: z
      .string()
      .trim()
      .min(1, t("AcademicYearSchema.errors.endDateRequired")),

    registrationStartDate: z
      .string()
      .trim()
      .min(1, t("AcademicYearSchema.errors.registrationStartDateRequired")),

    registrationEndDate: z
      .string()
      .trim()
      .min(1, t("AcademicYearSchema.errors.registrationEndDateRequired")),

    allowGradeEditingAfterEnd: z.boolean(),

    allowStudentFileEditingAfterEnd: z.boolean(),

    semesters: z
      .string()
      .trim()
      .min(1, t("AcademicYearSchema.errors.semestersRequired")),

    isActive: z.boolean(),
  });

export type AcademicYearFormValues = z.infer<
  ReturnType<typeof createAcademicYearSchema>
>;

export type AcademicYearInput = z.input<
  ReturnType<typeof createAcademicYearSchema>
>;
