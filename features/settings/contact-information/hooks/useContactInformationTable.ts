import { useMemo, useState } from "react";
import { useContactInformationStore } from "../store/useContactInformationStore";
import { ContactInformationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: ContactInformationRow) => [
  row.country,
  row.city,
  row.detailedAddress,
  row.primaryPhoneNumber,
  row.primaryEmail,
  row.website,
  row.socialMediaLinks,
];

export const useContactInformationTable = () => {
  const rows = useContactInformationStore((state) => state.rows);
  const deleteRow = useContactInformationStore((state) => state.deleteRow);
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
