"use client";

import { z } from "zod";

export const createSchoolSectionSchema = (t: (key: string) => string) =>
  z.object({
    sectionName: z
      .string()
      .trim()
      .min(1, t("SchoolSectionSchema.errors.sectionNameRequired")),

    schoolClassId: z
      .string()
      .trim()
      .min(1, t("SchoolSectionSchema.errors.schoolClassRequired")),

    defaultCapacity: z
      .number({
        error: t("SchoolSectionSchema.errors.defaultCapacityRequired"),
      })
      .int(t("SchoolSectionSchema.errors.defaultCapacityInteger"))
      .min(1, t("SchoolSectionSchema.errors.defaultCapacityMin"))
      .max(100, t("SchoolSectionSchema.errors.defaultCapacityMax")),

    supervisorId: z
      .string()
      .trim()
      .min(1, t("SchoolSectionSchema.errors.supervisorRequired")),

    isActive: z.boolean(),
  });

export type SchoolSectionFormValues = z.infer<
  ReturnType<typeof createSchoolSectionSchema>
>;

export type SchoolSectionInput = z.input<
  ReturnType<typeof createSchoolSectionSchema>
>;
