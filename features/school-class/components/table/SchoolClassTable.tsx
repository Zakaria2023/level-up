"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import { useSchoolClassTable } from "../../hooks/useSchoolClassTable";

const SchoolClassTable = () => {
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
    resolveEducationalStageName,
  } = useSchoolClassTable();

  const schoolClassTableHeaders = [
    <span key="className">{t("SchoolClassTable.className")}</span>,
    <span key="educationalStage">{t("SchoolClassTable.educationalStage")}</span>,
    <span key="minimumPassingGrade">{t("SchoolClassTable.minimumPassingGrade")}</span>,
    <span key="isActive">{t("SchoolClassTable.isActive")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("SchoolClassTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.4fr)_minmax(220px,1.4fr)_minmax(190px,1.2fr)_minmax(160px,1fr)_120px]"
      headers={schoolClassTableHeaders}
      pageHeading={t("SchoolClassTable.pageHeading")}
      addLinkHref="/school-class/new"
      addLinkLabel={t("SchoolClassTable.addSchoolClass")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("SchoolClassTable.searchPlaceholder")}
      emptyText={t("SchoolClassTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("SchoolClassTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.className}</div>
          <div>{resolveEducationalStageName(item.educationalStageId)}</div>
          <div>{item.minimumPassingGrade}%</div>
          <div>{renderBooleanValue(item.isActive)}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/school-class-configuration/${item.id}`}
              editLink={`/school-class-configuration/${item.id}/edit`}
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

export default SchoolClassTable;