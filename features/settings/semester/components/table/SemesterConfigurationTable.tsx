"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { useSemesterConfigurationTable } from "../../hooks/useSemesterConfigurationTable";

const semesterConfigurationTableHeaders = [
  <span key="semesterName">semesterName</span>,
  <span key="academicYear">academicYear</span>,
  <span key="semesterStartDate">semesterStartDate</span>,
  <span key="semesterEndDate">semesterEndDate</span>,
  <span key="actualLessonsStartDate">actualLessonsStartDate</span>,
  <span key="actualLessonsEndDate">actualLessonsEndDate</span>,
  <span key="finalExamDate">finalExamDate</span>,
  <span key="evaluationType">evaluationType</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const SemesterConfigurationTable = () => {
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
  } = useSemesterConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[180px_180px_150px_150px_190px_190px_150px_150px_120px]"
      headers={semesterConfigurationTableHeaders}
      pageHeading="Semester"
      addLinkHref="/semester/new"
      addLinkLabel="Add Semester"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search semester"
      emptyText="No semester rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
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

export default SemesterConfigurationTable;
