"use client";

import { useAcademicYearStructureExplorer } from "../hooks/useAcademicYearStructureExplorer";
import AcademicYearStructureEmptyState from "./AcademicYearStructureEmptyState";
import AcademicYearStructureFlow from "./AcademicYearStructureFlow";

// Keep the explorer focused on selecting an academic year and then rendering the related structure.
export default function AcademicYearStructureExplorer() {
  const {
    academicYears,
    academicYearOptions,
    selectedAcademicYear,
    selectedAcademicYearId,
    setSelectedAcademicYearId,
    selectedYearSemesterNames,
    stageStructure,
    supervisorLabelMap,
    teacherLabelMap,
  } = useAcademicYearStructureExplorer();

  if (!academicYears.length) {
    return <AcademicYearStructureEmptyState />;
  }

  return (
    <div className="mx-auto flex w-full max-w-360 flex-col gap-6">
      {/* Render the chosen academic year as a flow graph instead of the old stacked cards. */}
      <AcademicYearStructureFlow
        academicYearOptions={academicYearOptions}
        selectedAcademicYear={selectedAcademicYear}
        selectedAcademicYearId={selectedAcademicYearId}
        setSelectedAcademicYearId={setSelectedAcademicYearId}
        stageStructure={stageStructure}
        selectedYearSemesterNames={selectedYearSemesterNames}
        supervisorLabelMap={supervisorLabelMap}
        teacherLabelMap={teacherLabelMap}
      />
    </div>
  );
}
