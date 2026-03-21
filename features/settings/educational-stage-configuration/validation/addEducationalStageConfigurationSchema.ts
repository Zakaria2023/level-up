import { z } from "zod";

export const addEducationalStageConfigurationSchema = z.object({
  stageName: z.string().trim().min(1, "Stage name is required."),
  requiredEnrollmentAge: z
    .number({
      error: "Required enrollment age is required.",
    })
    .int("Required enrollment age must be a whole number.")
    .min(3, "Required enrollment age must be at least 3.")
    .max(25, "Required enrollment age cannot exceed 25."),
  gradeCategory: z.string().trim().min(1, "Grade category is required."),
  isMixedStage: z.boolean(),
});

export type AddEducationalStageConfigurationFormValues = z.infer<
  typeof addEducationalStageConfigurationSchema
>;
