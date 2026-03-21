"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import { useSchoolSectionTable } from "../../hooks/useSchoolSectionTable";

const SchoolSectionTable = () => {
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
    resolveSchoolClassName,
    resolveSupervisorName,
  } = useSchoolSectionTable();

  const schoolSectionTableHeaders = [
    <span key="sectionName">{t("SchoolSectionTable.sectionName")}</span>,
    <span key="schoolClass">{t("SchoolSectionTable.schoolClass")}</span>,
    <span key="defaultCapacity">{t("SchoolSectionTable.defaultCapacity")}</span>,
    <span key="supervisor">{t("SchoolSectionTable.supervisor")}</span>,
    <span key="isActive">{t("SchoolSectionTable.isActive")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("SchoolSectionTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.4fr)_minmax(220px,1.4fr)_minmax(170px,1.1fr)_minmax(220px,1.3fr)_minmax(150px,1fr)_120px]"
      headers={schoolSectionTableHeaders}
      pageHeading={t("SchoolSectionTable.pageHeading")}
      addLinkHref="/school-section/new"
      addLinkLabel={t("SchoolSectionTable.addSchoolSection")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("SchoolSectionTable.searchPlaceholder")}
      emptyText={t("SchoolSectionTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("SchoolSectionTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.sectionName}</div>
          <div>{resolveSchoolClassName(item.schoolClassId)}</div>
          <div>{item.defaultCapacity}</div>
          <div>{resolveSupervisorName(item.supervisorId)}</div>
          <div>{renderBooleanValue(item.isActive)}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/school-section/${item.id}`}
              editLink={`/school-section/${item.id}/edit`}
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

export default SchoolSectionTable;