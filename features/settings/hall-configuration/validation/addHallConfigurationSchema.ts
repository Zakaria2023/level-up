import { z } from "zod";

export const addHallConfigurationSchema = z.object({
  hallName: z.string().trim().min(1, "Hall name is required."),
  hallNumber: z.string().trim().min(1, "Hall number is required."),
  capacity: z
    .number({
      error: "Capacity is required.",
    })
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1.")
    .max(500, "Capacity cannot exceed 500."),
  hallType: z.string().trim().min(1, "Hall type is required."),
  buildingName: z.string().trim().min(1, "Building name is required."),
  floorNumber: z
    .number({
      error: "Floor number is required.",
    })
    .int("Floor number must be a whole number.")
    .min(0, "Floor number cannot be negative.")
    .max(100, "Floor number cannot exceed 100."),
});

export type AddHallConfigurationFormValues = z.infer<
  typeof addHallConfigurationSchema
>;
