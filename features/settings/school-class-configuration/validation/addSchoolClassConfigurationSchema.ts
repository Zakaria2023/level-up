import { z } from "zod";

export const addSchoolClassConfigurationSchema = z.object({
  className: z.string().trim().min(1, "Class name is required."),
  educationalStageId: z.string().trim().min(1, "Educational stage is required."),
  minimumPassingGrade: z
    .number({
      error: "Minimum passing grade is required.",
    })
    .min(0, "Minimum passing grade cannot be below 0.")
    .max(100, "Minimum passing grade cannot exceed 100."),
  isActive: z.boolean(),
});

export type AddSchoolClassConfigurationFormValues = z.infer<
  typeof addSchoolClassConfigurationSchema
>;
