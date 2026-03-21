export type AcademicYearRow = {
  id: number;
  academicYearName: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  allowGradeEditingAfterEnd: boolean;
  allowStudentFileEditingAfterEnd: boolean;
  semesters: string;
  isActive: boolean;
  hasActiveStudentRecord: boolean;
};
