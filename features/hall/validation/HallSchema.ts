"use client";

import { z } from "zod";

export const createHallSchema = (t: (key: string) => string) =>
  z.object({
    hallName: z.string().trim().min(1, t("HallSchema.errors.hallNameRequired")),

    hallNumber: z
      .string()
      .trim()
      .min(1, t("HallSchema.errors.hallNumberRequired")),

    capacity: z
      .number({
        error: t("HallSchema.errors.capacityRequired"),
      })
      .int(t("HallSchema.errors.capacityInteger"))
      .min(1, t("HallSchema.errors.capacityMin"))
      .max(500, t("HallSchema.errors.capacityMax")),

    hallType: z.string().trim().min(1, t("HallSchema.errors.hallTypeRequired")),

    buildingName: z
      .string()
      .trim()
      .min(1, t("HallSchema.errors.buildingNameRequired")),

    floorNumber: z
      .number({
        error: t("HallSchema.errors.floorNumberRequired"),
      })
      .int(t("HallSchema.errors.floorNumberInteger"))
      .min(0, t("HallSchema.errors.floorNumberMin"))
      .max(100, t("HallSchema.errors.floorNumberMax")),
  });

export type HallFormValues = z.infer<ReturnType<typeof createHallSchema>>;
export type HallInput = z.input<ReturnType<typeof createHallSchema>>;
