"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../../educational-stage/constants";
import { useEducationalStageStore } from "../../../educational-stage/store/useEducationalStageStore";
import { resolveEducationalStageLabel } from "../constants";
import { useSchoolClassStore } from "../store/useSchoolClassStore";
import { SchoolClassRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (
  row: SchoolClassRow,
  educationalStageName: string,
) => [
  row.className,
  educationalStageName,
  String(row.minimumPassingGrade),
  renderBooleanValue(row.isActive),
];

export const useSchoolClassConfigurationTable = () => {
  const rows = useSchoolClassStore((state) => state.rows);
  const deleteRow = useSchoolClassStore((state) => state.deleteRow);
  const educationalStages = useEducationalStageStore((state) => state.rows);
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

  const resolveEducationalStageName = (educationalStageId: number) =>
    resolveEducationalStageLabel(educationalStageMap.get(educationalStageId));

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      toSearchableValues(
        row,
        resolveEducationalStageLabel(
          educationalStageMap.get(row.educationalStageId),
        ),
      ).some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [rows, searchValue, educationalStageMap]);

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
    resolveEducationalStageName,
  };
};
