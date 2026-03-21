"use client";

import DataTable from "@/components/data/DataTable";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { useBasicInformationStore } from "../../store/useBasicInformationStore";
import type { BasicInformationAsset, BasicInformationRow } from "../../types";

const tableHeaders = [
  <span key="schoolNameArabic">
    schoolNameArabic
  </span>,
  <span key="schoolNameEnglish">
    schoolNameEnglish
  </span>,
  <span key="yearOfEstablishment">
    yearOfEstablishment
  </span>,
  <span key="currency">
    currency
  </span>,
  <span key="commercialRegisterNumber">
    commercialRegisterNumber
  </span>,
  <span key="systemLanguage">
    systemLanguage
  </span>,
  <span key="allowMultipleCurrencies">
    allowMultipleCurrencies
  </span>,
  <span key="showLogoOnInvoices">
    showLogoOnInvoices
  </span>,
  <span key="schoolLogo">
    schoolLogo
  </span>,
  <span key="schoolSeal">
    schoolSeal
  </span>,
];

const PAGE_SIZE = 5;

const isImagePreviewUrl = (previewUrl?: string) =>
  Boolean(
    previewUrl &&
    (previewUrl.startsWith("data:image/") ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(previewUrl))
  );

const renderBooleanValue = (value: boolean) => (value ? "Enabled" : "Disabled");

const FilePreview = ({ asset }: { asset: BasicInformationAsset }) => {
  if (asset.previewUrl && isImagePreviewUrl(asset.previewUrl)) {
    return (
      <div className="flex items-center gap-3">
        <Image
          src={asset.previewUrl}
          alt={asset.name}
          width={44}
          height={44}
          unoptimized
          className="h-11 w-11 rounded-2xl border border-(--border-color) object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-(--foreground)">
            {asset.name}
          </p>
          <p className="text-xs text-(--muted-text)">Image file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary-strong)">
        <FiFileText className="text-lg" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-(--foreground)">
          {asset.name}
        </p>
        {asset.previewUrl ? (
          <a
            href={asset.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-(--primary-strong) underline underline-offset-2"
          >
            Open preview
          </a>
        ) : (
          <p className="text-xs text-(--muted-text)">File uploaded</p>
        )}
      </div>
    </div>
  );
};

const toSearchableValues = (row: BasicInformationRow) => [
  row.schoolNameArabic,
  row.schoolNameEnglish,
  row.yearOfEstablishment,
  row.currency,
  row.commercialRegisterNumber,
  row.systemLanguage,
  renderBooleanValue(row.allowMultipleCurrencies),
  renderBooleanValue(row.showLogoOnInvoices),
  row.schoolLogo.name,
  row.schoolSeal.name,
];

const BasicInformationTable = () => {
  const rows = useBasicInformationStore((state) => state.rows);
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

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.2fr)_minmax(220px,1.2fr)_190px_160px_220px_180px_190px_190px_200px_200px]"
      headers={tableHeaders}
      pageHeading="Basic Information"
      addLinkHref="/settings/basic-information/new"
      addLinkLabel="Add Basic Information"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search basic information"
      emptyText="No basic information rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
        </div>
      }
      renderRow={(item) => (
        <>
          <div >
            <span >
              {item.schoolNameArabic}
            </span>
          </div>

          <div >
            <span >
              {item.schoolNameEnglish}
            </span>
          </div>

          <div>
            <span>
              {item.yearOfEstablishment}
            </span>
          </div>

          <div>
            <span>
              {item.currency}
            </span>
          </div>

          <div>
            <span>
              {item.commercialRegisterNumber}
            </span>
          </div>

          <div>
            <span>
              {item.systemLanguage}
            </span>
          </div>

          <div>
            <span>
              {renderBooleanValue(item.allowMultipleCurrencies)}
            </span>
          </div>

          <div>
            <span>
              {renderBooleanValue(item.showLogoOnInvoices)}
            </span>
          </div>

          <div>
            <FilePreview asset={item.schoolLogo} />
          </div>

          <div>
            <FilePreview asset={item.schoolSeal} />
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
