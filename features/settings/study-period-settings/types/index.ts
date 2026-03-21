export type StudyPeriodDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type StudyPeriodItem = {
  periodName: string;
  schoolDays: StudyPeriodDay[];
  startTime: string;
  endTime: string;
  durationMinutes: number;
  hasBreakAfterPeriod: boolean;
  breakName: string;
  breakStartTime: string;
  breakEndTime: string;
  breakDurationMinutes: number | null;
};

export type StudyPeriodSettingsRow = {
  id: number;
  periodsCount: number;
  attendanceTrackingEnabled: boolean;
  periods: StudyPeriodItem[];
};
