"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { useTranslation } from "react-i18next";
import { useSemesterTable } from "../../hooks/useSemesterTable";

const SemesterTable = () => {
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
  } = useSemesterTable();

  const semesterTableHeaders = [
    <span key="semesterName">{t("SemesterTable.semesterName")}</span>,
    <span key="academicYear">{t("SemesterTable.academicYear")}</span>,
    <span key="semesterStartDate">{t("SemesterTable.semesterStartDate")}</span>,
    <span key="semesterEndDate">{t("SemesterTable.semesterEndDate")}</span>,
    <span key="actualLessonsStartDate">
      {t("SemesterTable.actualLessonsStartDate")}
    </span>,
    <span key="actualLessonsEndDate">
      {t("SemesterTable.actualLessonsEndDate")}
    </span>,
    <span key="finalExamDate">{t("SemesterTable.finalExamDate")}</span>,
    <span key="evaluationType">{t("SemesterTable.evaluationType")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("SemesterTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[180px_180px_150px_150px_190px_190px_150px_150px_120px]"
      headers={semesterTableHeaders}
      pageHeading={t("SemesterTable.pageHeading")}
      addLinkHref="/semester/new"
      addLinkLabel={t("SemesterTable.addSemester")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("SemesterTable.searchPlaceholder")}
      emptyText={t("SemesterTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("SemesterTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.semesterName}</div>
          <div>{resolveAcademicYearName(item.academicYearId)}</div>
          <div>{item.semesterStartDate}</div>
          <div>{item.semesterEndDate}</div>
          <div>{item.actualLessonsStartDate}</div>
          <div>{item.actualLessonsEndDate}</div>
          <div>{item.finalExamDate}</div>
          <div>{item.evaluationType}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/semester/${item.id}`}
              editLink={`/semester/${item.id}/edit`}
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

export default SemesterTable;