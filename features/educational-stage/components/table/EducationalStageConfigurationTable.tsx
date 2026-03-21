"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useEducationalStageConfigurationTable } from "../../hooks/useEducationalStageConfigurationTable";

const educationalStageConfigurationTableHeaders = [
  <span key="academicYear">academicYear</span>,
  <span key="stageName">stageName</span>,
  <span key="requiredEnrollmentAge">requiredEnrollmentAge</span>,
  <span key="teachingLanguage">teachingLanguage</span>,
  <span key="isMixedStage">isMixedStage</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const EducationalStageConfigurationTable = () => {
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
  } = useEducationalStageConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.2fr)_minmax(240px,1.4fr)_minmax(190px,1fr)_minmax(220px,1.2fr)_minmax(160px,1fr)_120px]"
      headers={educationalStageConfigurationTableHeaders}
      pageHeading="Educational Stage"
      addLinkHref="/educational-stage/new"
      addLinkLabel="Add Educational Stage"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search educational stage"
      emptyText="No educational stage rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
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

export default EducationalStageConfigurationTable;
