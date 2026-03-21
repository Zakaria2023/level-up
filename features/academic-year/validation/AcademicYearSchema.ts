import { z } from "zod";

export const AcademicYearSchema = z.object({
  academicYearName: z.string().trim().min(1, "Academic year name is required."),
  startDate: z.string().trim().min(1, "Start date is required."),
  endDate: z.string().trim().min(1, "End date is required."),
  registrationStartDate: z
    .string()
    .trim()
    .min(1, "Registration start date is required."),
  registrationEndDate: z
    .string()
    .trim()
    .min(1, "Registration end date is required."),
  allowGradeEditingAfterEnd: z.boolean(),
  allowStudentFileEditingAfterEnd: z.boolean(),
  semesters: z.string().trim().min(1, "Semesters are required."),
  isActive: z.boolean(),
});

export type AcademicYearFormValues = z.infer<typeof AcademicYearSchema>;
