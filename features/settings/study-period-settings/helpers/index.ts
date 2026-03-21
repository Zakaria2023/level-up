import type { TFunction } from "i18next";
import type { StudyPeriodDay, StudyPeriodItem } from "../types";

const parseTimeToMinutes = (value?: string) => {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

export const calculateDurationInMinutes = (
  startTime?: string,
  endTime?: string,
) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return null;
  }

  return endMinutes - startMinutes;
};

export const formatDuration = (
  durationMinutes?: number | null,
  t?: TFunction,
) =>
  typeof durationMinutes === "number"
    ? t
      ? t("StudyPeriodSettingsCommon.durationValue", {
          value: durationMinutes,
        })
      : `${durationMinutes} min`
    : "--";

export const formatStatusValue = (value: boolean, t?: TFunction) =>
  t
    ? t(value ? "StudyPeriodSettingsCommon.enabled" : "StudyPeriodSettingsCommon.disabled")
    : value
      ? "Enabled"
      : "Disabled";

export const formatSchoolDays = (
  schoolDays: StudyPeriodDay[],
  t?: TFunction,
) => {
  if (!schoolDays.length) {
    return t
      ? t("StudyPeriodSettingsCommon.noDaysSelected")
      : "No days selected";
  }

  if (!t) {
    return schoolDays.join(", ");
  }

  return schoolDays
    .map((day) => t(`StudyPeriodSettingsCommon.days.${day}`))
    .join(", ");
};

export const createEmptyStudyPeriod = (): Omit<
  StudyPeriodItem,
  "durationMinutes" | "breakDurationMinutes"
> => ({
  periodName: "",
  schoolDays: [],
  startTime: "",
  endTime: "",
  hasBreakAfterPeriod: false,
  breakName: "",
  breakStartTime: "",
  breakEndTime: "",
});
