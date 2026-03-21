import { renderBooleanValue } from "@/lib/utils/helpers";
import { TFunction } from "i18next";
import type { SchoolSectionRow } from "../types";

export const SECTION_SUPERVISOR_OPTIONS = [
  { label: "Anas Maria", value: "anas-maria" },
  { label: "Rana Khaled", value: "rana-khaled" },
  { label: "Omar Saleh", value: "omar-saleh" },
  { label: "Lina Haddad", value: "lina-haddad" },
];

export const SCHOOL_SECTION_ROWS: SchoolSectionRow[] = [
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
  row: SchoolSectionRow,
  t: TFunction,
  schoolClassName?: string,
  supervisorName?: string,
) => [
  {
    label: t("SchoolSectionDetails.fields.sectionName"),
    value: row.sectionName,
  },
  {
    label: t("SchoolSectionDetails.fields.schoolClass"),
    value: resolveSchoolClassLabel(schoolClassName),
  },
  {
    label: t("SchoolSectionDetails.fields.defaultCapacity"),
    value: String(row.defaultCapacity),
  },
  {
    label: t("SchoolSectionDetails.fields.sectionSupervisor"),
    value: resolveSupervisorLabel(supervisorName),
  },
  {
    label: t("SchoolSectionDetails.fields.active"),
    value: renderBooleanValue(row.isActive),
  },
];
