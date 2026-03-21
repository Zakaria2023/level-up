"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import { useAcademicYearTable } from "../../hooks/useAcademicYearTable";

const AcademicYearTable = () => {
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
  } = useAcademicYearTable();

  const academicYearTableHeaders = [
    <span key="academicYearName">{t("AcademicYearTable.academicYearName")}</span>,
    <span key="startDate">{t("AcademicYearTable.startDate")}</span>,
    <span key="endDate">{t("AcademicYearTable.endDate")}</span>,
    <span key="registrationStartDate">
      {t("AcademicYearTable.registrationStartDate")}
    </span>,
    <span key="registrationEndDate">
      {t("AcademicYearTable.registrationEndDate")}
    </span>,
    <span key="allowGradeEditingAfterEnd">
      {t("AcademicYearTable.allowGradeEditingAfterEnd")}
    </span>,
    <span key="allowStudentFileEditingAfterEnd">
      {t("AcademicYearTable.allowStudentFileEditingAfterEnd")}
    </span>,
    <span key="semesters">{t("AcademicYearTable.semesters")}</span>,
    <span key="isActive">{t("AcademicYearTable.isActive")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("AcademicYearTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[190px_150px_150px_190px_190px_220px_250px_minmax(240px,1.2fr)_120px_120px]"
      headers={academicYearTableHeaders}
      pageHeading={t("AcademicYearTable.pageHeading")}
      addLinkHref="/academic-year/new"
      addLinkLabel={t("AcademicYearTable.addAcademicYear")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("AcademicYearTable.searchPlaceholder")}
      emptyText={t("AcademicYearTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("AcademicYearTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.academicYearName}</div>
          <div>{item.startDate}</div>
          <div>{item.endDate}</div>
          <div>{item.registrationStartDate}</div>
          <div>{item.registrationEndDate}</div>
          <div>{renderBooleanValue(item.allowGradeEditingAfterEnd)}</div>
          <div>{renderBooleanValue(item.allowStudentFileEditingAfterEnd)}</div>
          <div>{item.semesters}</div>
          <div>{renderBooleanValue(item.isActive)}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/academic-year/${item.id}`}
              editLink={`/academic-year/${item.id}/edit`}
              onDeleteConfirm={() => {
                if (item.hasActiveStudentRecord) {
                  window.alert(t("AcademicYearTable.deleteBlockedMessage"));
                  return;
                }

                deleteRow(item.id);
              }}
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

export default AcademicYearTable;