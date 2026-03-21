"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useAcademicYearConfigurationTable } from "../../hooks/useAcademicYearConfigurationTable";

const academicYearConfigurationTableHeaders = [
  <span key="academicYearName">academicYearName</span>,
  <span key="startDate">startDate</span>,
  <span key="endDate">endDate</span>,
  <span key="registrationStartDate">registrationStartDate</span>,
  <span key="registrationEndDate">registrationEndDate</span>,
  <span key="allowGradeEditingAfterEnd">allowGradeEditingAfterEnd</span>,
  <span key="allowStudentFileEditingAfterEnd">
    allowStudentFileEditingAfterEnd
  </span>,
  <span key="semesters">semesters</span>,
  <span key="isActive">isActive</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const AcademicYearConfigurationTable = () => {
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
  } = useAcademicYearConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[190px_150px_150px_190px_190px_220px_250px_minmax(240px,1.2fr)_120px_120px]"
      headers={academicYearConfigurationTableHeaders}
      pageHeading="Academic Year Configuration"
      addLinkHref="/academic-year-configuration/new"
      addLinkLabel="Add Academic Year"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search academic year configuration"
      emptyText="No academic year configuration rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
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
              viewLink={`/academic-year-configuration/${item.id}`}
              editLink={`/academic-year-configuration/${item.id}/edit`}
              onDeleteConfirm={() => {
                if (item.hasActiveStudentRecord) {
                  window.alert(
                    "This academic year cannot be deleted because it is linked to an active student record.",
                  );
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

export default AcademicYearConfigurationTable;
