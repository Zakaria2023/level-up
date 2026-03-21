import type { AcademicYearRow } from "@/features/academic-year/types";
import type { SemesterRow } from "@/features/semester/types";
import type { EducationalStageConfigurationRow } from "@/features/settings/educational-stage-configuration/types";
import type { SchoolClassConfigurationRow } from "@/features/settings/school-class-configuration/types";
import type { SchoolSectionConfigurationRow } from "@/features/settings/school-section-configuration/types";
import type {
  SubjectClassSetting,
  SubjectConfigurationRow,
} from "@/features/settings/subject-configuration/types";

export type AcademicYearStructureTimelineItem = {
  key: string;
  label: string;
  semester?: SemesterRow;
};

export type AcademicYearStructureSubjectItem = SubjectConfigurationRow & {
  classSetting?: SubjectClassSetting;
};

export type AcademicYearStructureClassItem = {
  schoolClass: SchoolClassConfigurationRow;
  schoolClassLabel: string;
  sections: SchoolSectionConfigurationRow[];
  subjects: AcademicYearStructureSubjectItem[];
};

export type AcademicYearStructureStageItem = {
  stage: EducationalStageConfigurationRow;
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
