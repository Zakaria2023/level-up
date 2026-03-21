import { z } from "zod";

const evaluationTypeValues = ["Monthly", "Midterm", "Final"] as const;

const isBefore = (startDate: string, endDate: string) => startDate > endDate;

export const addSemesterConfigurationSchema = z
  .object({
    semesterName: z.string().trim().min(1, "Semester name is required."),
    academicYearId: z.string().trim().min(1, "Academic year is required."),
    semesterStartDate: z
      .string()
      .trim()
      .min(1, "Semester start date is required."),
    semesterEndDate: z
      .string()
      .trim()
      .min(1, "Semester end date is required."),
    actualLessonsStartDate: z
      .string()
      .trim()
      .min(1, "Actual lessons start date is required."),
    actualLessonsEndDate: z
      .string()
      .trim()
      .min(1, "Actual lessons end date is required."),
    finalExamDate: z.string().trim().min(1, "Final exam date is required."),
    evaluationType: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(evaluationTypeValues, {
        required_error: "Evaluation type is required.",
      }),
    ),
  })
  .superRefine((values, context) => {
    if (isBefore(values.semesterStartDate, values.semesterEndDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["semesterEndDate"],
        message: "Semester end date must be after the semester start date.",
      });
    }

    if (
      isBefore(values.actualLessonsStartDate, values.actualLessonsEndDate)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["actualLessonsEndDate"],
        message:
          "Actual lessons end date must be after the actual lessons start date.",
      });
    }

    if (isBefore(values.semesterStartDate, values.actualLessonsStartDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["actualLessonsStartDate"],
        message:
          "Actual lessons start date must be on or after the semester start date.",
      });
    }

    if (isBefore(values.actualLessonsEndDate, values.semesterEndDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["actualLessonsEndDate"],
        message:
          "Actual lessons end date must be on or before the semester end date.",
      });
    }

    if (isBefore(values.actualLessonsEndDate, values.finalExamDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["finalExamDate"],
        message:
          "Final exam date must be on or after the actual lessons end date.",
      });
    }
  });

export type AddSemesterConfigurationFormValues = z.infer<
  typeof addSemesterConfigurationSchema
>;
