import { z } from "zod";

export const addSchoolSectionConfigurationSchema = z.object({
  sectionName: z.string().trim().min(1, "Section name is required."),
  schoolClassId: z.string().trim().min(1, "School class is required."),
  defaultCapacity: z
    .number({
      error: "Default capacity is required.",
    })
    .int("Default capacity must be a whole number.")
    .min(1, "Default capacity must be at least 1.")
    .max(100, "Default capacity cannot exceed 100."),
  supervisorId: z.string().trim().min(1, "Section supervisor is required."),
  isActive: z.boolean(),
});

export type AddSchoolSectionConfigurationFormValues = z.infer<
  typeof addSchoolSectionConfigurationSchema
>;
