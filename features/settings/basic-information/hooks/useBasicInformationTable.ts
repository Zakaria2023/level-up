import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useBasicInformationStore } from "../store/useBasicInformationStore";
import { BasicInformationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (row: BasicInformationRow) => [
  row.schoolNameArabic,
  row.schoolNameEnglish,
  row.yearOfEstablishment,
  row.currency,
  row.timeZone,
  row.commercialRegisterNumber,
  row.systemLanguage,
  renderBooleanValue(row.allowMultipleCurrencies),
  renderBooleanValue(row.showLogoOnInvoices),
  renderBooleanValue(row.notificationsEnabled),
  row.schoolLogo.name,
  row.schoolSeal.name,
];

export const useBasicInformationTable = () => {
  const rows = useBasicInformationStore((state) => state.rows);
  const deleteRow = useBasicInformationStore((state) => state.deleteRow);
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
