"use client";

import { z } from "zod";

export const createSchoolClassSchema = (t: (key: string) => string) =>
  z.object({
    className: z
      .string()
      .trim()
      .min(1, t("SchoolClassSchema.errors.classNameRequired")),

    educationalStageId: z
      .string()
      .trim()
      .min(1, t("SchoolClassSchema.errors.educationalStageRequired")),

    minimumPassingGrade: z
      .number({
        error: t("SchoolClassSchema.errors.minimumPassingGradeRequired"),
      })
      .min(0, t("SchoolClassSchema.errors.minimumPassingGradeMin"))
      .max(100, t("SchoolClassSchema.errors.minimumPassingGradeMax")),

    isActive: z.boolean(),
  });

export type SchoolClassFormValues = z.infer<
  ReturnType<typeof createSchoolClassSchema>
>;

export type SchoolClassInput = z.input<
  ReturnType<typeof createSchoolClassSchema>
>;
