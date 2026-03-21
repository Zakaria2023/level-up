"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useEducationalStageConfigurationStore } from "../../educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { resolveEducationalStageLabel } from "../constants";
import { useSchoolClassConfigurationStore } from "../store/useSchoolClassConfigurationStore";
import { SchoolClassConfigurationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (
  row: SchoolClassConfigurationRow,
  educationalStageName: string,
) => [
  row.className,
  educationalStageName,
  String(row.minimumPassingGrade),
  renderBooleanValue(row.isActive),
];

export const useSchoolClassConfigurationTable = () => {
  const rows = useSchoolClassConfigurationStore((state) => state.rows);
  const deleteRow = useSchoolClassConfigurationStore((state) => state.deleteRow);
  const educationalStages = useEducationalStageConfigurationStore(
    (state) => state.rows,
  );
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const educationalStageMap = useMemo(
    () => new Map(educationalStages.map((row) => [row.id, row.stageName])),
    [educationalStages],
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
        resolveEducationalStageLabel(educationalStageMap.get(row.educationalStageId)),
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
