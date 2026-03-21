import { renderBooleanValue } from "@/lib/utils/helpers";
import type { SchoolSectionConfigurationRow } from "../types";

export const SECTION_SUPERVISOR_OPTIONS = [
  { label: "Anas Maria", value: "anas-maria" },
  { label: "Rana Khaled", value: "rana-khaled" },
  { label: "Omar Saleh", value: "omar-saleh" },
  { label: "Lina Haddad", value: "lina-haddad" },
];

export const SCHOOL_SECTION_CONFIGURATION_ROWS: SchoolSectionConfigurationRow[] = [
  {
    id: 1,
    sectionName: "Section A",
    schoolClassId: 1,
    defaultCapacity: 30,
    supervisorId: "anas-maria",
    isActive: true,
  },
];

export const resolveSchoolClassLabel = (schoolClassName?: string) =>
  schoolClassName?.trim() || "School class not available";

export const resolveSupervisorLabel = (supervisorName?: string) =>
  supervisorName?.trim() || "Supervisor not available";

export const toDetailFields = (
  row: SchoolSectionConfigurationRow,
  schoolClassName?: string,
  supervisorName?: string,
) => [
  {
    label: "Section Name",
    value: row.sectionName,
  },
  {
    label: "School Class",
    value: resolveSchoolClassLabel(schoolClassName),
  },
  {
    label: "Default Capacity",
    value: String(row.defaultCapacity),
  },
  {
    label: "Section Supervisor",
    value: resolveSupervisorLabel(supervisorName),
  },
  {
    label: "Active",
    value: renderBooleanValue(row.isActive),
  },
];
