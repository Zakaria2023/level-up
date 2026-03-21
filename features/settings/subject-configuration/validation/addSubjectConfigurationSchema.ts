import { z } from "zod";

const subjectTypeValues = ["Core", "Enrichment"] as const;

const subjectClassSettingSchema = z.object({
  schoolClassId: z.string().trim().min(1, "School class is required."),
  weeklyPeriodsCount: z
    .number({
      error: "Weekly periods count is required.",
    })
    .int("Weekly periods count must be a whole number.")
    .min(1, "Weekly periods count must be at least 1.")
    .max(20, "Weekly periods count cannot exceed 20."),
  periodDurationMinutes: z
    .number({
      error: "Period duration is required.",
    })
    .int("Period duration must be a whole number.")
    .min(1, "Period duration must be at least 1 minute.")
    .max(180, "Period duration cannot exceed 180 minutes."),
});

const subjectGradeBreakdownSchema = z.object({
  activityName: z.string().trim().min(1, "Activity name is required."),
  percentage: z
    .number({
      error: "Activity percentage is required.",
    })
    .min(0.01, "Activity percentage must be greater than 0.")
    .max(100, "Activity percentage cannot exceed 100."),
});

export const addSubjectConfigurationSchema = z
  .object({
    subjectName: z.string().trim().min(1, "Subject name is required."),
    subjectType: z.enum(subjectTypeValues, {
      error: "Subject type is required.",
    }),
    classSettings: z
      .array(subjectClassSettingSchema)
      .min(1, "Add at least one school class setting."),
    teacherIds: z.array(z.string().trim()).min(1, "Select at least one teacher."),
    countsTowardAverage: z.boolean(),
    minimumPassingGrade: z
      .number({
        error: "Minimum passing grade is required.",
      })
      .min(0, "Minimum passing grade cannot be below 0.")
      .max(100, "Minimum passing grade cannot exceed 100."),
    gradeBreakdown: z
      .array(subjectGradeBreakdownSchema)
      .min(1, "Add at least one grade breakdown row."),
    requiresLab: z.boolean(),
    hasQuestionBank: z.boolean(),
    teachingLanguage: z.string().trim().min(1, "Teaching language is required."),
  })
  .superRefine((values, context) => {
    const totalPercentage = values.gradeBreakdown.reduce(
      (total, item) => total + item.percentage,
      0,
    );

    if (Math.abs(totalPercentage - 100) > 0.001) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gradeBreakdown"],
        message: "Grade breakdown percentages must total 100%.",
      });
    }
  });

export type AddSubjectConfigurationFormValues = z.infer<
  typeof addSubjectConfigurationSchema
>;
