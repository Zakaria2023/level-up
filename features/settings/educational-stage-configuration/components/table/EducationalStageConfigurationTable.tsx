"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useEducationalStageConfigurationTable } from "../../hooks/useEducationalStageConfigurationTable";

const educationalStageConfigurationTableHeaders = [
  <span key="stageName">stageName</span>,
  <span key="requiredEnrollmentAge">requiredEnrollmentAge</span>,
  <span key="gradeCategory">gradeCategory</span>,
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
  } = useEducationalStageConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[220px_190px_minmax(240px,1.4fr)_160px_120px]"
      headers={educationalStageConfigurationTableHeaders}
      pageHeading="Educational Stage Configuration"
      addLinkHref="/educational-stage-configuration/new"
      addLinkLabel="Add Educational Stage"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search educational stage configuration"
      emptyText="No educational stage configuration rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.stageName}</div>
          <div>{item.requiredEnrollmentAge}</div>
          <div>{item.gradeCategory}</div>
          <div>{renderBooleanValue(item.isMixedStage)}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/educational-stage-configuration/${item.id}`}
              editLink={`/educational-stage-configuration/${item.id}/edit`}
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
