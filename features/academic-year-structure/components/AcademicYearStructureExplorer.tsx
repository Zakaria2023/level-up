"use client";

import { useAcademicYearStructureExplorer } from "../hooks/useAcademicYearStructureExplorer";
import AcademicYearStructureEmptyState from "./AcademicYearStructureEmptyState";
import AcademicYearStructureFlow from "./AcademicYearStructureFlow";

// Keep the explorer focused on selecting an academic year and then rendering the related structure.
export const AcademicYearStructureExplorer = () => {
  const {
    academicYears,
    academicYearOptions,
    selectedAcademicYear,
    selectedAcademicYearId,
    setSelectedAcademicYearId,
    selectedYearSemesterNames,
    stageStructure,
    supervisorLabelMap,
  } = useAcademicYearStructureExplorer();

  if (!academicYears.length) {
    return <AcademicYearStructureEmptyState />;
  }

  return (
    <div className="flex w-full flex-col">
      {/* Render the chosen academic year as a flow graph instead of the old stacked cards. */}
      <AcademicYearStructureFlow
        academicYearOptions={academicYearOptions}
        selectedAcademicYear={selectedAcademicYear}
        selectedAcademicYearId={selectedAcademicYearId}
        setSelectedAcademicYearId={setSelectedAcademicYearId}
        stageStructure={stageStructure}
        selectedYearSemesterNames={selectedYearSemesterNames}
        supervisorLabelMap={supervisorLabelMap}
      />
    </div>
  );
}
