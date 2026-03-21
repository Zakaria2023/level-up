"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { useMemo, useState } from "react";
import type {
  BasicInformationInputType,
  BasicInformationRow,
  BasicInformationStatus,
} from "../../types";

interface Props {
  initialRows: BasicInformationRow[];
}

const tableHeaders = [
  <span key="id" className="block w-full text-left">
    ID
  </span>,
  <span key="field" className="block w-full text-left">
    Field
  </span>,
  <span key="value" className="block w-full text-left">
    Value
  </span>,
  <span key="input-type" className="block w-full text-center">
    Input Type
  </span>,
  <span key="status" className="block w-full text-center">
    Status
  </span>,
  <span key="actions" className="block w-full text-center">
    Actions
  </span>,
];

const typeBadgeClassName: Record<BasicInformationInputType, string> = {
  Text: "bg-(--surface-muted) text-[color:var(--primary-strong)]",
  Number: "bg-[#e7f6f8] text-[color:var(--primary-strong)]",
  Select: "bg-[#ddf4f7] text-[color:var(--primary-strong)]",
  Checkbox: "bg-[#d2f0f4] text-[color:var(--primary-strong)]",
  File: "bg-[#c9f8fc] text-[color:var(--primary-strong)]",
};

const statusBadgeClassName: Record<BasicInformationStatus, string> = {
  Configured: "bg-[#e8f9fb] text-[color:var(--primary-strong)]",
  Uploaded: "bg-[#d8f4f7] text-[color:var(--primary-strong)]",
  Verified: "bg-[#edf8fa] text-[#20545b]",
  Primary: "bg-[#c9f8fc] text-[color:var(--primary-strong)]",
  Default: "bg-[#e6f5f7] text-[#20545b]",
  Active: "bg-[color:var(--primary)] text-white",
};

const PAGE_SIZE = 5;

const BasicInformationTable = ({ initialRows }: Props) => {
  const [rows, setRows] = useState(initialRows);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      [row.field, row.value, row.inputType, row.status].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [rows, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedRows = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  const handleDelete = (id: number) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  };

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[80px_minmax(280px,1.65fr)_minmax(220px,1.2fr)_150px_140px_100px]"
      headers={tableHeaders}
      pageHeading="Basic Information"
      addLinkHref="/settings/basic-information/add"
      addLinkLabel="Add Field"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search by field, value, type, or status"
      emptyText="No basic information rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} fields
        </div>
      }
      renderRow={(item) => (
        <>
          <div className="w-full text-left text-sm font-semibold text-(--primary-strong)">
            {item.id.toString().padStart(2, "0")}
          </div>

          <div className="w-full text-left">
            <p className="font-semibold text-(--foreground)">{item.field}</p>
          </div>

          <div className="w-full text-left">
            {item.inputType === "File" ? (
              <span className="inline-flex rounded-full bg-(--surface-muted) px-3 py-1 text-xs font-semibold text-(--foreground)">
                {item.value}
              </span>
            ) : (
              <span className="text-sm font-medium text-(--foreground)">
                {item.value}
              </span>
            )}
          </div>

          <div className="flex w-full justify-center">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClassName[item.inputType]}`}
            >
              {item.inputType}
            </span>
          </div>

          <div className="flex w-full justify-center">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClassName[item.status]}`}
            >
              {item.status}
            </span>
          </div>

          <div className="flex w-full justify-center">
            <DataTableAction onDeleteConfirm={() => handleDelete(item.id)} />
          </div>
        </>
      )}
      pagination={{
        page: currentPage,
        setPage,
        totalPages,
        totalCount: filteredRows.length,
        pageSize,
        setPageSize,
      }}
    />
  );
};

export default BasicInformationTable;
