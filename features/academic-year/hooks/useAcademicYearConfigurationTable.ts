import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useAcademicYearStore } from "../store/useAcademicYearStore";
import { AcademicYearRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: AcademicYearRow) => [
  row.academicYearName,
  row.startDate,
  row.endDate,
  row.registrationStartDate,
  row.registrationEndDate,
  renderBooleanValue(row.allowGradeEditingAfterEnd),
  renderBooleanValue(row.allowStudentFileEditingAfterEnd),
  row.semesters,
  renderBooleanValue(row.isActive),
];

export const useAcademicYearConfigurationTable = () => {
  const rows = useAcademicYearStore((state) => state.rows);
  const deleteRow = useAcademicYearStore((state) => state.deleteRow);
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
