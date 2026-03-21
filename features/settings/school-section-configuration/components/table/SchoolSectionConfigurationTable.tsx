"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useSchoolSectionConfigurationTable } from "../../hooks/useSchoolSectionConfigurationTable";

const schoolSectionConfigurationTableHeaders = [
  <span key="sectionName">sectionName</span>,
  <span key="schoolClass">schoolClass</span>,
  <span key="defaultCapacity">defaultCapacity</span>,
  <span key="supervisor">supervisor</span>,
  <span key="isActive">isActive</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const SchoolSectionConfigurationTable = () => {
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
  } = useSchoolSectionConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.4fr)_minmax(220px,1.4fr)_minmax(170px,1.1fr)_minmax(220px,1.3fr)_minmax(150px,1fr)_120px]"
      headers={schoolSectionConfigurationTableHeaders}
      pageHeading="School Section Configuration"
      addLinkHref="/school-section-configuration/new"
      addLinkLabel="Add School Section"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search school section configuration"
      emptyText="No school section configuration rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
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
              viewLink={`/school-section-configuration/${item.id}`}
              editLink={`/school-section-configuration/${item.id}/edit`}
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

export default SchoolSectionConfigurationTable;
