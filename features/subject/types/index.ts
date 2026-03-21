export type SubjectType = "Core" | "Enrichment";

export type SubjectClassSetting = {
  schoolClassId: number;
  weeklyPeriodsCount: number;
  periodDurationMinutes: number;
};

export type SubjectGradeBreakdown = {
  activityName: string;
  percentage: number;
};

export type SubjectRow = {
  id: number;
  subjectName: string;
  subjectType: SubjectType;
  classSettings: SubjectClassSetting[];
  teacherIds: string[];
  countsTowardAverage: boolean;
  minimumPassingGrade: number;
  gradeBreakdown: SubjectGradeBreakdown[];
  requiresLab: boolean;
  hasQuestionBank: boolean;
  teachingLanguage: string;
};
