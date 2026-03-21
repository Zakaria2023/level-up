"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  summarizePeriodNames,
  summarizeSchoolDays,
} from "../constants";
import { formatStatusValue } from "../helpers";
import { useStudyPeriodSettingsStore } from "../store/useStudyPeriodSettingsStore";
import { StudyPeriodSettingsRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (
  row: StudyPeriodSettingsRow,
  statusLabel: string,
  schoolDaysLabel: string,
) => [
  String(row.periodsCount),
  statusLabel,
  summarizePeriodNames(row),
  schoolDaysLabel,
  String(row.periods.filter((period) => period.hasBreakAfterPeriod).length),
];

export const useStudyPeriodSettingsTable = () => {
  const { t } = useTranslation();
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

    return rows.filter((row) => {
      const statusLabel = formatStatusValue(row.attendanceTrackingEnabled, t);
      const schoolDaysLabel = summarizeSchoolDays(row, t);

      return toSearchableValues(row, statusLabel, schoolDaysLabel).some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [rows, searchValue, t]);

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
