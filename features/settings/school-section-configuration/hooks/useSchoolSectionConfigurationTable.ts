"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../educational-stage-configuration/constants";
import { useEducationalStageConfigurationStore } from "../../educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { formatSchoolClassLabel } from "../../school-class-configuration/constants";
import { useSchoolClassConfigurationStore } from "../../school-class-configuration/store/useSchoolClassConfigurationStore";
import {
  resolveSchoolClassLabel,
  resolveSupervisorLabel,
  SECTION_SUPERVISOR_OPTIONS,
} from "../constants";
import { useSchoolSectionConfigurationStore } from "../store/useSchoolSectionConfigurationStore";
import { SchoolSectionConfigurationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (
  row: SchoolSectionConfigurationRow,
  schoolClassName: string,
  supervisorName: string,
) => [
  row.sectionName,
  schoolClassName,
  String(row.defaultCapacity),
  supervisorName,
  renderBooleanValue(row.isActive),
];

export const useSchoolSectionConfigurationTable = () => {
  const rows = useSchoolSectionConfigurationStore((state) => state.rows);
  const deleteRow = useSchoolSectionConfigurationStore(
    (state) => state.deleteRow,
  );
  const schoolClasses = useSchoolClassConfigurationStore((state) => state.rows);
  const educationalStages = useEducationalStageConfigurationStore(
    (state) => state.rows,
  );
  const academicYears = useAcademicYearStore((state) => state.rows);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const academicYearMap = useMemo(
    () => new Map(academicYears.map((row) => [row.id, row.academicYearName])),
    [academicYears],
  );
  const educationalStageMap = useMemo(
    () =>
      new Map(
        educationalStages.map((row) => [
          row.id,
          formatEducationalStageLabel(
            row.stageName,
            resolveAcademicYearLabel(academicYearMap.get(row.academicYearId)),
          ),
        ]),
      ),
    [academicYearMap, educationalStages],
  );
  const schoolClassMap = useMemo(
    () =>
      new Map(
        schoolClasses.map((row) => [
          row.id,
          formatSchoolClassLabel(
            row.className,
            educationalStageMap.get(row.educationalStageId),
          ),
        ]),
      ),
    [educationalStageMap, schoolClasses],
  );
  const supervisorMap = useMemo(
    () =>
      new Map(
        SECTION_SUPERVISOR_OPTIONS.map((item) => [item.value, item.label]),
      ),
    [],
  );

  const resolveSchoolClassName = (schoolClassId: number) =>
    resolveSchoolClassLabel(schoolClassMap.get(schoolClassId));
  const resolveSupervisorName = (supervisorId: string) =>
    resolveSupervisorLabel(supervisorMap.get(supervisorId));

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      toSearchableValues(
        row,
        resolveSchoolClassLabel(schoolClassMap.get(row.schoolClassId)),
        resolveSupervisorLabel(supervisorMap.get(row.supervisorId)),
      ).some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [rows, searchValue, schoolClassMap, supervisorMap]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedRows = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  return {
    paginatedRows,
    deleteRow,
    searchValue,
    setSearchValue,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredRows,
    currentPage,
    resolveSchoolClassName,
    resolveSupervisorName,
  };
};
