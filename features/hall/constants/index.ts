import { TFunction } from "i18next";
import type { HallRow, HallType } from "../types";

export const HALL_TYPE_OPTIONS: { label: string; value: HallType }[] = [
  { label: "Classroom", value: "Classroom" },
  { label: "Laboratory", value: "Laboratory" },
  { label: "Computer Room", value: "Computer Room" },
  { label: "Theater", value: "Theater" },
  { label: "Sports", value: "Sports" },
];

export const HALL_ROWS: HallRow[] = [
  {
    id: 1,
    hallName: "Science Lab A",
    hallNumber: "LAB-101",
    capacity: 28,
    hallType: "Laboratory",
    buildingName: "Main Building",
    floorNumber: 1,
  },
];

export const resolveHallTypeLabel = (hallType?: string) =>
  hallType?.trim() || "Hall type not available";

export const formatHallLocation = (
  buildingName?: string,
  floorNumber?: number,
) => {
  if (!buildingName?.trim()) {
    return "Location not available";
  }

  return `${buildingName} - Floor ${floorNumber ?? 0}`;
};

export const toDetailFields = (row: HallRow, t: TFunction) => [
  {
    label: t("HallDetails.fields.hallName"),
    value: row.hallName,
  },
  {
    label: t("HallDetails.fields.hallNumber"),
    value: row.hallNumber,
  },
  {
    label: t("HallDetails.fields.capacity"),
    value: String(row.capacity),
  },
  {
    label: t("HallDetails.fields.hallType"),
    value: resolveHallTypeLabel(row.hallType),
  },
  {
    label: t("HallDetails.fields.buildingName"),
    value: row.buildingName,
  },
  {
    label: t("HallDetails.fields.floorNumber"),
    value: String(row.floorNumber),
  },
];
