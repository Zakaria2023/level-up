"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { FilePreview } from "@/components/ui/FilePreview";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useBasicInformationTable } from "../../hooks/useBasicInformationTable";

const basicInformationTableHeaders = [
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
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const BasicInformationTable = () => {
  const {
    deleteRow,
    pageSize,
    paginatedRows,
    searchValue,
    setPage,
    setPageSize,
    setSearchValue,
    totalPages,
    filteredRows,
    currentPage
  } = useBasicInformationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.2fr)_minmax(220px,1.2fr)_190px_160px_220px_180px_190px_190px_200px_200px_120px]"
      headers={basicInformationTableHeaders}
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
          <div>
            <span>
              {item.schoolNameArabic}
            </span>
          </div>

          <div>
            <span>
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

          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/settings/basic-information/${item.id}`}
              editLink={`/settings/basic-information/${item.id}/edit`}
              onDeleteConfirm={() => deleteRow(item.id)}
            />
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
