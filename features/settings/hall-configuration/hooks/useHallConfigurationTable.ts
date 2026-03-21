"use client";

import { useMemo, useState } from "react";
import { formatHallLocation, resolveHallTypeLabel } from "../constants";
import { useHallConfigurationStore } from "../store/useHallConfigurationStore";
import { HallConfigurationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: HallConfigurationRow) => [
  row.hallName,
  row.hallNumber,
  String(row.capacity),
  resolveHallTypeLabel(row.hallType),
  row.buildingName,
  String(row.floorNumber),
  formatHallLocation(row.buildingName, row.floorNumber),
];

export const useHallConfigurationTable = () => {
  const rows = useHallConfigurationStore((state) => state.rows);
  const deleteRow = useHallConfigurationStore((state) => state.deleteRow);
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
