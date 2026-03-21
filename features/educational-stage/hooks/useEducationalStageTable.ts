"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useAcademicYearStore } from "../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../constants";
import { useEducationalStageStore } from "../store/useEducationalStageStore";
import { EducationalStageRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: EducationalStageRow) => [
  String(row.academicYearId),
  row.stageName,
  String(row.requiredEnrollmentAge),
  row.teachingLanguage,
  renderBooleanValue(row.isMixedStage),
];

export const useEducationalStageTable = () => {
  const rows = useEducationalStageStore((state) => state.rows);
  const deleteRow = useEducationalStageStore((state) => state.deleteRow);
  const academicYears = useAcademicYearStore((state) => state.rows);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const academicYearMap = useMemo(
    () => new Map(academicYears.map((row) => [row.id, row.academicYearName])),
    [academicYears],
  );

  const resolveAcademicYearName = (academicYearId: number) =>
    resolveAcademicYearLabel(academicYearMap.get(academicYearId));

  const resolveEducationalStageName = (row: EducationalStageRow) =>
    formatEducationalStageLabel(
      row.stageName,
      academicYearMap.get(row.academicYearId),
    );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) => {
      const resolvedAcademicYearName = resolveAcademicYearLabel(
        academicYearMap.get(row.academicYearId),
      );
      const resolvedStageName = formatEducationalStageLabel(
        row.stageName,
        academicYearMap.get(row.academicYearId),
      );

      return [
        resolvedAcademicYearName,
        resolvedStageName,
        ...toSearchableValues(row),
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [rows, searchValue, academicYearMap]);

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
    resolveAcademicYearName,
    resolveEducationalStageName,
  };
};
