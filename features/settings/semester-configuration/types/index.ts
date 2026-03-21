export type SemesterEvaluationType = "Monthly" | "Midterm" | "Final";

export type SemesterConfigurationRow = {
  id: number;
  semesterName: string;
  academicYearId: number;
  semesterStartDate: string;
  semesterEndDate: string;
  actualLessonsStartDate: string;
  actualLessonsEndDate: string;
  finalExamDate: string;
  evaluationType: SemesterEvaluationType;
};
