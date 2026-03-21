"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useEducationalStageConfigurationStore } from "../store/useEducationalStageConfigurationStore";
import { EducationalStageConfigurationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: EducationalStageConfigurationRow) => [
  row.stageName,
  String(row.requiredEnrollmentAge),
  row.gradeCategory,
  renderBooleanValue(row.isMixedStage),
];

export const useEducationalStageConfigurationTable = () => {
  const rows = useEducationalStageConfigurationStore((state) => state.rows);
  const deleteRow = useEducationalStageConfigurationStore((state) => state.deleteRow);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      toSearchableValues(row).some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [rows, searchValue]);

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
  };
};
