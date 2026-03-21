"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { FilePreview } from "@/components/ui/FilePreview";
import useCurrentLang from "@/hooks/useCurrentLang";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import { useBasicInformationTable } from "../../hooks/useBasicInformationTable";

const BasicInformationTable = () => {
  const lang = useCurrentLang();
  const { t } = useTranslation();

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
    currentPage,
  } = useBasicInformationTable();

  const basicInformationTableHeaders = [
    <span key="schoolName">{t("BasicInformationTable.schoolName")}</span>,
    <span key="yearOfEstablishment">
      {t("BasicInformationTable.yearOfEstablishment")}
    </span>,
    <span key="currency">{t("BasicInformationTable.currency")}</span>,
    <span key="commercialRegisterNumber">
      {t("BasicInformationTable.commercialRegisterNumber")}
    </span>,
    <span key="systemLanguage">{t("BasicInformationTable.systemLanguage")}</span>,
    <span key="allowMultipleCurrencies">
      {t("BasicInformationTable.allowMultipleCurrencies")}
    </span>,
    <span key="showLogoOnInvoices">
      {t("BasicInformationTable.showLogoOnInvoices")}
    </span>,
    <span key="schoolLogo">{t("BasicInformationTable.schoolLogo")}</span>,
    <span key="schoolSeal">{t("BasicInformationTable.schoolSeal")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("BasicInformationTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.2fr)_190px_160px_220px_180px_190px_190px_200px_200px_120px]"
      headers={basicInformationTableHeaders}
      pageHeading={t("BasicInformationTable.pageHeading")}
      addLinkHref="/settings/basic-information/new"
      addLinkLabel={t("BasicInformationTable.addBasicInformation")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("BasicInformationTable.searchPlaceholder")}
      emptyText={t("BasicInformationTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("BasicInformationTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>
            {lang === "ar" ? item.schoolNameArabic : item.schoolNameEnglish}
          </div>

          <div>{item.yearOfEstablishment}</div>

          <div>{item.currency}</div>

          <div>{item.commercialRegisterNumber}</div>

          <div>{item.systemLanguage}</div>

          <div>{renderBooleanValue(item.allowMultipleCurrencies)}</div>

          <div>{renderBooleanValue(item.showLogoOnInvoices)}</div>

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