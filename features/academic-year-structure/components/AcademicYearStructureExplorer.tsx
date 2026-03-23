"use client";

import { useAcademicYearStructureExplorer } from "../hooks/useAcademicYearStructureExplorer";
import AcademicYearStructureEmptyState from "./AcademicYearStructureEmptyState";
import AcademicYearStructureFlow from "./AcademicYearStructureFlow";

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
