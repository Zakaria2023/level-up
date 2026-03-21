export type HallType =
  | "Classroom"
  | "Laboratory"
  | "Computer Room"
  | "Theater"
  | "Sports";

export type HallRow = {
  id: number;
  hallName: string;
  hallNumber: string;
  capacity: number;
  hallType: HallType;
  buildingName: string;
  floorNumber: number;
};
