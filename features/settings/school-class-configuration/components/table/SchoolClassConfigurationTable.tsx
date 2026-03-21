"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useSchoolClassConfigurationTable } from "../../hooks/useSchoolClassConfigurationTable";

const schoolClassConfigurationTableHeaders = [
  <span key="className">className</span>,
  <span key="educationalStage">educationalStage</span>,
  <span key="minimumPassingGrade">minimumPassingGrade</span>,
  <span key="isActive">isActive</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const SchoolClassConfigurationTable = () => {
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
  } = useSchoolClassConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[220px_220px_190px_160px_120px]"
      headers={schoolClassConfigurationTableHeaders}
      pageHeading="School Class Configuration"
      addLinkHref="/school-class-configuration/new"
      addLinkLabel="Add School Class"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search school class configuration"
      emptyText="No school class configuration rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
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

export default SchoolClassConfigurationTable;
