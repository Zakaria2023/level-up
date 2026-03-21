"use client";

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

const createPeriodSchema = (t: (key: string) => string) =>
  z
    .object({
      periodName: z
        .string()
        .trim()
        .min(1, t("StudyPeriodSettingsSchema.errors.periodNameRequired")),

      schoolDays: z
        .array(z.enum(studyPeriodDayValues))
        .min(1, t("StudyPeriodSettingsSchema.errors.schoolDaysRequired")),

      startTime: z
        .string()
        .trim()
        .min(1, t("StudyPeriodSettingsSchema.errors.startTimeRequired")),

      endTime: z
        .string()
        .trim()
        .min(1, t("StudyPeriodSettingsSchema.errors.endTimeRequired")),

      hasBreakAfterPeriod: z.boolean(),

      breakName: z.string().trim(),
      breakStartTime: z.string().trim(),
      breakEndTime: z.string().trim(),
    })
    .superRefine((values, context) => {
      if (
        calculateDurationInMinutes(values.startTime, values.endTime) === null
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endTime"],
          message: t("StudyPeriodSettingsSchema.errors.endTimeAfterStart"),
        });
      }

      if (!values.hasBreakAfterPeriod) {
        return;
      }

      if (!values.breakName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakName"],
          message: t("StudyPeriodSettingsSchema.errors.breakNameRequired"),
        });
      }

      if (!values.breakStartTime) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakStartTime"],
          message: t("StudyPeriodSettingsSchema.errors.breakStartTimeRequired"),
        });
      }

      if (!values.breakEndTime) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakEndTime"],
          message: t("StudyPeriodSettingsSchema.errors.breakEndTimeRequired"),
        });
      }

      if (
        values.breakStartTime &&
        values.breakEndTime &&
        calculateDurationInMinutes(
          values.breakStartTime,
          values.breakEndTime,
        ) === null
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakEndTime"],
          message: t("StudyPeriodSettingsSchema.errors.breakEndTimeAfterStart"),
        });
      }

      const periodEndMinutes = calculateDurationInMinutes(
        values.startTime,
        values.endTime,
      );
      const breakGap = calculateDurationInMinutes(
        values.endTime,
        values.breakStartTime,
      );

      if (
        periodEndMinutes !== null &&
        values.breakStartTime &&
        breakGap === null &&
        values.breakStartTime < values.endTime
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakStartTime"],
          message: t(
            "StudyPeriodSettingsSchema.errors.breakStartTimeAfterPeriodEnd",
          ),
        });
      }
    });

export const createStudyPeriodSettingsSchema = (t: (key: string) => string) =>
  z
    .object({
      periodsCount: z
        .number({
          error: t("StudyPeriodSettingsSchema.errors.periodsCountRequired"),
        })
        .int(t("StudyPeriodSettingsSchema.errors.periodsCountInteger"))
        .min(1, t("StudyPeriodSettingsSchema.errors.periodsCountMin"))
        .max(20, t("StudyPeriodSettingsSchema.errors.periodsCountMax")),

      attendanceTrackingEnabled: z.boolean(),

      periods: z
        .array(createPeriodSchema(t))
        .min(1, t("StudyPeriodSettingsSchema.errors.periodsRequired")),
    })
    .superRefine((values, context) => {
      if (values.periods.length !== values.periodsCount) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["periodsCount"],
          message: t("StudyPeriodSettingsSchema.errors.periodsCountMatch"),
        });
      }
    });

export type StudyPeriodSettingsFormValues = z.infer<
  ReturnType<typeof createStudyPeriodSettingsSchema>
>;

export type StudyPeriodSettingsInput = z.input<
  ReturnType<typeof createStudyPeriodSettingsSchema>
>;
