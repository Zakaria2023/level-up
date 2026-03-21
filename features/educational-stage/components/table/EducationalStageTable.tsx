"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import { useEducationalStageTable } from "../../hooks/useEducationalStageTable";

const EducationalStageTable = () => {
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
    resolveAcademicYearName,
    resolveEducationalStageName,
  } = useEducationalStageTable();

  const educationalStageTableHeaders = [
    <span key="academicYear">{t("EducationalStageTable.academicYear")}</span>,
    <span key="stageName">{t("EducationalStageTable.stageName")}</span>,
    <span key="requiredEnrollmentAge">
      {t("EducationalStageTable.requiredEnrollmentAge")}
    </span>,
    <span key="teachingLanguage">{t("EducationalStageTable.teachingLanguage")}</span>,
    <span key="isMixedStage">{t("EducationalStageTable.isMixedStage")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("EducationalStageTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.2fr)_minmax(240px,1.4fr)_minmax(190px,1fr)_minmax(220px,1.2fr)_minmax(160px,1fr)_120px]"
      headers={educationalStageTableHeaders}
      pageHeading={t("EducationalStageTable.pageHeading")}
      addLinkHref="/educational-stage/new"
      addLinkLabel={t("EducationalStageTable.addEducationalStage")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("EducationalStageTable.searchPlaceholder")}
      emptyText={t("EducationalStageTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("EducationalStageTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{resolveAcademicYearName(item.academicYearId)}</div>
          <div>{resolveEducationalStageName(item)}</div>
          <div>{item.requiredEnrollmentAge}</div>
          <div>{item.teachingLanguage}</div>
          <div>{renderBooleanValue(item.isMixedStage)}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/educational-stage/${item.id}`}
              editLink={`/educational-stage/${item.id}/edit`}
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

export default EducationalStageTable;