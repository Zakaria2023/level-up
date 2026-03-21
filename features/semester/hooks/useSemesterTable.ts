"use client";

import { useMemo, useState } from "react";
import { useAcademicYearStore } from "../../academic-year/store/useAcademicYearStore";
import { resolveAcademicYearLabel } from "../constants";
import { useSemesterStore } from "../store/useSemesterStore";
import { SemesterRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: SemesterRow, academicYearName: string) => [
  row.semesterName,
  academicYearName,
  row.semesterStartDate,
  row.semesterEndDate,
  row.actualLessonsStartDate,
  row.actualLessonsEndDate,
  row.finalExamDate,
  row.evaluationType,
];

export const useSemesterTable = () => {
  const rows = useSemesterStore((state) => state.rows);
  const deleteRow = useSemesterStore((state) => state.deleteRow);
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

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      toSearchableValues(
        row,
        resolveAcademicYearLabel(academicYearMap.get(row.academicYearId)),
      ).some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
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
  };
};
