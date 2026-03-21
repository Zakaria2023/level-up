import { renderBooleanValue } from "@/lib/utils/helpers";
import { calculateDurationInMinutes, formatSchoolDays } from "../helpers";
import type { StudyPeriodDay, StudyPeriodSettingsRow } from "../types";

export const STUDY_PERIOD_DAY_OPTIONS: { label: string; value: StudyPeriodDay }[] = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

export const STUDY_PERIOD_SETTINGS_ROWS: StudyPeriodSettingsRow[] = [
  {
    id: 1,
    periodsCount: 3,
    attendanceTrackingEnabled: true,
    periods: [
      {
        periodName: "Period 1",
        schoolDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "08:00",
        endTime: "08:45",
        durationMinutes: 45,
        hasBreakAfterPeriod: true,
        breakName: "Morning Break",
        breakStartTime: "08:45",
        breakEndTime: "09:00",
        breakDurationMinutes: 15,
      },
      {
        periodName: "Period 2",
        schoolDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "09:00",
        endTime: "09:45",
        durationMinutes: 45,
        hasBreakAfterPeriod: false,
        breakName: "",
        breakStartTime: "",
        breakEndTime: "",
        breakDurationMinutes: null,
      },
      {
        periodName: "Period 3",
        schoolDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "10:00",
        endTime: "10:45",
        durationMinutes: 45,
        hasBreakAfterPeriod: false,
        breakName: "",
        breakStartTime: "",
        breakEndTime: "",
        breakDurationMinutes: null,
      },
    ],
  },
];

export const toDetailFields = (row: StudyPeriodSettingsRow) => [
  {
    label: "Periods Count",
    value: String(row.periodsCount),
  },
  {
    label: "Attendance Tracking",
    value: renderBooleanValue(row.attendanceTrackingEnabled),
  },
  {
    label: "Periods With Breaks",
    value: String(row.periods.filter((period) => period.hasBreakAfterPeriod).length),
  },
];

export const summarizePeriodNames = (row: StudyPeriodSettingsRow) =>
  row.periods.map((period) => period.periodName).join(", ");

export const summarizeSchoolDays = (row: StudyPeriodSettingsRow) => {
  const uniqueDays = Array.from(
    new Set(row.periods.flatMap((period) => period.schoolDays)),
  ) as StudyPeriodDay[];

  return formatSchoolDays(uniqueDays);
};

export const normalizeStudyPeriods = (row: StudyPeriodSettingsRow) => ({
  ...row,
  periods: row.periods.map((period) => ({
    ...period,
    durationMinutes:
      calculateDurationInMinutes(period.startTime, period.endTime) ??
      period.durationMinutes,
    breakDurationMinutes: period.hasBreakAfterPeriod
      ? calculateDurationInMinutes(period.breakStartTime, period.breakEndTime)
      : null,
  })),
});
