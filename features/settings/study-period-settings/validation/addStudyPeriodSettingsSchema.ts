import { z } from "zod";
import { calculateDurationInMinutes } from "../helpers";

const studyPeriodDayValues = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const periodSchema = z
  .object({
    periodName: z.string().trim().min(1, "Period name is required."),
    schoolDays: z
      .array(z.enum(studyPeriodDayValues))
      .min(1, "Select at least one school day."),
    startTime: z.string().trim().min(1, "Start time is required."),
    endTime: z.string().trim().min(1, "End time is required."),
    hasBreakAfterPeriod: z.boolean(),
    breakName: z.string().trim(),
    breakStartTime: z.string().trim(),
    breakEndTime: z.string().trim(),
  })
  .superRefine((values, context) => {
    if (calculateDurationInMinutes(values.startTime, values.endTime) === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after the start time.",
      });
    }

    if (!values.hasBreakAfterPeriod) {
      return;
    }

    if (!values.breakName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["breakName"],
        message: "Break name is required when a break is enabled.",
      });
    }

    if (!values.breakStartTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["breakStartTime"],
        message: "Break start time is required when a break is enabled.",
      });
    }

    if (!values.breakEndTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["breakEndTime"],
        message: "Break end time is required when a break is enabled.",
      });
    }

    if (
      values.breakStartTime &&
      values.breakEndTime &&
      calculateDurationInMinutes(values.breakStartTime, values.breakEndTime) === null
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["breakEndTime"],
        message: "Break end time must be after the break start time.",
      });
    }

    const periodEndMinutes = calculateDurationInMinutes(values.startTime, values.endTime);
    const breakGap = calculateDurationInMinutes(values.endTime, values.breakStartTime);

    if (
      periodEndMinutes !== null &&
      values.breakStartTime &&
      breakGap === null &&
      values.breakStartTime < values.endTime
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["breakStartTime"],
        message: "Break start time must be at or after the period end time.",
      });
    }
  });

export const addStudyPeriodSettingsSchema = z
  .object({
    periodsCount: z
      .number({
        error: "Periods count is required.",
      })
      .int("Periods count must be a whole number.")
      .min(1, "At least one study period is required.")
      .max(20, "Periods count cannot exceed 20."),
    attendanceTrackingEnabled: z.boolean(),
    periods: z.array(periodSchema).min(1, "Add at least one period."),
  })
  .superRefine((values, context) => {
    if (values.periods.length !== values.periodsCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["periodsCount"],
        message: "Periods count must match the generated period rows.",
      });
    }
  });

export type AddStudyPeriodSettingsFormValues = z.infer<
  typeof addStudyPeriodSettingsSchema
>;
