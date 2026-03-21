"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { formatHallLocation, resolveHallTypeLabel } from "../../constants";
import { useHallConfigurationTable } from "../../hooks/useHallConfigurationTable";

const hallConfigurationTableHeaders = [
  <span key="hallName">hallName</span>,
  <span key="hallNumber">hallNumber</span>,
  <span key="capacity">capacity</span>,
  <span key="hallType">hallType</span>,
  <span key="location">location</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const HallConfigurationTable = () => {
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
  } = useHallConfigurationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.3fr)_minmax(170px,1fr)_minmax(150px,0.9fr)_minmax(200px,1.1fr)_minmax(240px,1.4fr)_120px]"
      headers={hallConfigurationTableHeaders}
      pageHeading="Hall Configuration"
      addLinkHref="/hall-configuration/new"
      addLinkLabel="Add Hall"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search hall configuration"
      emptyText="No hall configuration rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.hallName}</div>
          <div>{item.hallNumber}</div>
          <div>{item.capacity}</div>
          <div>{resolveHallTypeLabel(item.hallType)}</div>
          <div>{formatHallLocation(item.buildingName, item.floorNumber)}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/hall-configuration/${item.id}`}
              editLink={`/hall-configuration/${item.id}/edit`}
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

export default HallConfigurationTable;
