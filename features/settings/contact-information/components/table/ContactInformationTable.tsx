"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { useTranslation } from "react-i18next";
import { useContactInformationTable } from "../../hooks/useContactInformationTable";

const ContactInformationTable = () => {
  const { t } = useTranslation();

  const {
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
  } = useContactInformationTable();

  const contactInformationTableHeaders = [
    <span key="country">{t("ContactInformationTable.country")}</span>,
    <span key="city">{t("ContactInformationTable.city")}</span>,
    <span key="detailedAddress">
      {t("ContactInformationTable.detailedAddress")}
    </span>,
    <span key="primaryPhoneNumber">
      {t("ContactInformationTable.primaryPhoneNumber")}
    </span>,
    <span key="primaryEmail">{t("ContactInformationTable.primaryEmail")}</span>,
    <span key="website">{t("ContactInformationTable.website")}</span>,
    <span key="socialMediaLinks">
      {t("ContactInformationTable.socialMediaLinks")}
    </span>,
    <span key="actions">{t("ContactInformationTable.actions")}</span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[180px_180px_minmax(280px,1.5fr)_200px_220px_220px_minmax(260px,1.5fr)_120px]"
      headers={contactInformationTableHeaders}
      pageHeading={t("ContactInformationTable.pageHeading")}
      addLinkHref="/settings/contact-information/new"
      addLinkLabel={t("ContactInformationTable.addContactInformation")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("ContactInformationTable.searchPlaceholder")}
      emptyText={t("ContactInformationTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("ContactInformationTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.country}</div>

          <div>{item.city}</div>

          <div>{item.detailedAddress}</div>

          <div dir="ltr">{item.primaryPhoneNumber}</div>

          <div>{item.primaryEmail}</div>

          <div>{item.website}</div>

          <div>
            {item.socialMediaLinks.slice(0, 20)}
            {item.socialMediaLinks.length > 20 && "..."}
          </div>

          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/settings/contact-information/${item.id}`}
              editLink={`/settings/contact-information/${item.id}/edit`}
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

export default ContactInformationTable;