"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import {
  summarizePeriodNames,
  summarizeSchoolDays,
} from "../constants";
import { useStudyPeriodSettingsStore } from "../store/useStudyPeriodSettingsStore";
import { StudyPeriodSettingsRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: StudyPeriodSettingsRow) => [
  String(row.periodsCount),
  renderBooleanValue(row.attendanceTrackingEnabled),
  summarizePeriodNames(row),
  summarizeSchoolDays(row),
  String(row.periods.filter((period) => period.hasBreakAfterPeriod).length),
];

export const useStudyPeriodSettingsTable = () => {
  const rows = useStudyPeriodSettingsStore((state) => state.rows);
  const deleteRow = useStudyPeriodSettingsStore((state) => state.deleteRow);
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
