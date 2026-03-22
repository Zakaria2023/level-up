import type { AcademicYearRow } from "@/features/academic-year/types";
import type { EducationalStageRow } from "@/features/educational-stage/types";
import { SchoolClassRow } from "@/features/school-class/types";
import type { SchoolSectionRow } from "@/features/school-section/types";
import type { SemesterRow } from "@/features/semester/types";
import type { SubjectClassSetting, SubjectRow } from "@/features/subject/types";
import type { Node } from "@xyflow/react";

export type AcademicYearStructureTimelineItem = {
  key: string;
  label: string;
  semester?: SemesterRow;
};

export type AcademicYearStructureSubjectItem = SubjectRow & {
  classSetting?: SubjectClassSetting;
};

export type AcademicYearStructureClassItem = {
  schoolClass: SchoolClassRow;
  schoolClassLabel: string;
  sections: SchoolSectionRow[];
  subjects: AcademicYearStructureSubjectItem[];
};

export type AcademicYearStructureStageItem = {
  stage: EducationalStageRow;
  stageLabel: string;
  classes: AcademicYearStructureClassItem[];
};

export type AcademicYearStructureNodeKind =
  | "academicYear"
  | "stage"
  | "grade"
  | "class"
  | "section";

export type AcademicYearStructureQuickStat = {
  label: string;
  value: string;
};

export type AcademicYearStructureDetailItem = {
  label: string;
  value: string;
  valueDir?: "auto" | "ltr" | "rtl";
};

export type AcademicYearStructureHierarchyNode = {
  id: string;
  kind: AcademicYearStructureNodeKind;
  kindLabel: string;
  childrenLabel: string;
  title: string;
  subtitle?: string;
  status: string;
  expandLabel: string;
  collapseLabel: string;
  childrenCount: number;
  quickStats: AcademicYearStructureQuickStat[];
  detailItems: AcademicYearStructureDetailItem[];
  children: AcademicYearStructureHierarchyNode[];
  parentId?: string;
};

export type AcademicYearStructureFlowNodeData = {
  hierarchyNode: AcademicYearStructureHierarchyNode;
  isExpanded: boolean;
  onToggle: (nodeId: string) => void;
};

export type AcademicYearStructureFlowGraphNode = Node<
  AcademicYearStructureFlowNodeData,
  "structureNode"
>;

export type AcademicYearStructureData = {
  academicYears: AcademicYearRow[];
  academicYearOptions: {
    label: string;
    value: string;
  }[];
  selectedAcademicYear?: AcademicYearRow;
  selectedAcademicYearId: string;
  setSelectedAcademicYearId: (value: string) => void;
  selectedYearSemesterNames: string[];
  semesterTimeline: AcademicYearStructureTimelineItem[];
  stageStructure: AcademicYearStructureStageItem[];
  totalClasses: number;
  totalSections: number;
  totalSubjects: number;
  supervisorLabelMap: Map<string, string>;
};
