"use client";

import { useAcademicYearStructureExplorer } from "../hooks/useAcademicYearStructureExplorer";
import AcademicYearStructureEmptyState from "./AcademicYearStructureEmptyState";
import AcademicYearStructureOverview from "./AcademicYearStructureOverview";
import AcademicYearStructureTree from "./AcademicYearStructureTree";

export default function AcademicYearStructureExplorer() {
  const {
    academicYears,
    academicYearOptions,
    selectedAcademicYear,
    selectedAcademicYearId,
    setSelectedAcademicYearId,
    selectedYearSemesterNames,
    semesterTimeline,
    stageStructure,
    totalClasses,
    totalSections,
    totalSubjects,
    supervisorLabelMap,
    teacherLabelMap,
  } = useAcademicYearStructureExplorer();

  if (!academicYears.length) {
    return <AcademicYearStructureEmptyState />;
  }

  return (
    <div className="mx-auto flex w-full max-w-360 flex-col gap-6">
      <AcademicYearStructureOverview
        academicYearOptions={academicYearOptions}
        selectedAcademicYearId={selectedAcademicYearId}
        setSelectedAcademicYearId={setSelectedAcademicYearId}
        selectedAcademicYear={selectedAcademicYear}
        semesterTimeline={semesterTimeline}
        stageCount={stageStructure.length}
        totalClasses={totalClasses}
        totalSections={totalSections}
        totalSubjects={totalSubjects}
        filteredSemesterCount={
          semesterTimeline.filter((item) => item.semester).length
        }
      />

      <AcademicYearStructureTree
        stageStructure={stageStructure}
        selectedYearSemesterNames={selectedYearSemesterNames}
        supervisorLabelMap={supervisorLabelMap}
        teacherLabelMap={teacherLabelMap}
      />
    </div>
  );
}
