import type { HallConfigurationRow, HallType } from "../types";

export const HALL_TYPE_OPTIONS: { label: string; value: HallType }[] = [
  { label: "Classroom", value: "Classroom" },
  { label: "Laboratory", value: "Laboratory" },
  { label: "Computer Room", value: "Computer Room" },
  { label: "Theater", value: "Theater" },
  { label: "Sports", value: "Sports" },
];

export const HALL_CONFIGURATION_ROWS: HallConfigurationRow[] = [
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

export const toDetailFields = (row: HallConfigurationRow) => [
  {
    label: "Hall Name",
    value: row.hallName,
  },
  {
    label: "Hall Number",
    value: row.hallNumber,
  },
  {
    label: "Capacity",
    value: String(row.capacity),
  },
  {
    label: "Hall Type",
    value: resolveHallTypeLabel(row.hallType),
  },
  {
    label: "Building Name",
    value: row.buildingName,
  },
  {
    label: "Floor Number",
    value: String(row.floorNumber),
  },
];
