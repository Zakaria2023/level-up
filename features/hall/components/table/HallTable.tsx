"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { useTranslation } from "react-i18next";
import { formatHallLocation, resolveHallTypeLabel } from "../../constants";
import { useHallTable } from "../../hooks/useHallTable";

const HallTable = () => {
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
  } = useHallTable();

  const hallTableHeaders = [
    <span key="hallName">{t("HallTable.hallName")}</span>,
    <span key="hallNumber">{t("HallTable.hallNumber")}</span>,
    <span key="capacity">{t("HallTable.capacity")}</span>,
    <span key="hallType">{t("HallTable.hallType")}</span>,
    <span key="location">{t("HallTable.location")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("HallTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.3fr)_minmax(170px,1fr)_minmax(150px,0.9fr)_minmax(200px,1.1fr)_minmax(240px,1.4fr)_120px]"
      headers={hallTableHeaders}
      pageHeading={t("HallTable.pageHeading")}
      addLinkHref="/hall/new"
      addLinkLabel={t("HallTable.addHall")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("HallTable.searchPlaceholder")}
      emptyText={t("HallTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("HallTable.records")}
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
              viewLink={`/hall/${item.id}`}
              editLink={`/hall/${item.id}/edit`}
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

export default HallTable;