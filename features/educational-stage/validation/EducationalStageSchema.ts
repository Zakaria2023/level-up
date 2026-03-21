"use client";

import { z } from "zod";

export const createEducationalStageSchema = (t: (key: string) => string) =>
  z.object({
    academicYearId: z
      .string()
      .trim()
      .min(1, t("EducationalStageSchema.errors.academicYearRequired")),

    stageName: z
      .string()
      .trim()
      .min(1, t("EducationalStageSchema.errors.stageNameRequired")),

    requiredEnrollmentAge: z
      .number({
        error: t("EducationalStageSchema.errors.requiredEnrollmentAgeRequired"),
      })
      .int(t("EducationalStageSchema.errors.requiredEnrollmentAgeInteger"))
      .min(3, t("EducationalStageSchema.errors.requiredEnrollmentAgeMin"))
      .max(25, t("EducationalStageSchema.errors.requiredEnrollmentAgeMax")),

    teachingLanguage: z
      .string()
      .trim()
      .min(1, t("EducationalStageSchema.errors.teachingLanguageRequired")),

    isMixedStage: z.boolean(),
  });

export type EducationalStageFormValues = z.infer<
  ReturnType<typeof createEducationalStageSchema>
>;

export type EducationalStageInput = z.input<
  ReturnType<typeof createEducationalStageSchema>
>;
