export type SemesterEvaluationType = "Monthly" | "Midterm" | "Final";

export type SemesterRow = {
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
