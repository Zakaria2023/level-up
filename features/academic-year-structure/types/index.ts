import type { AcademicYearRow } from "@/features/academic-year/types";
import type { EducationalStageRow } from "@/features/educational-stage/types";
import { SchoolClassRow } from "@/features/school-class/types";
import type { SchoolSectionRow } from "@/features/school-section/types";
import type { SemesterRow } from "@/features/semester/types";
import type { SubjectClassSetting, SubjectRow } from "@/features/subject/types";

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
  teacherLabelMap: Map<string, string>;
};
