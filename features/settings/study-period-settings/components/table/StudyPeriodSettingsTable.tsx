"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import {
  summarizePeriodNames,
  summarizeSchoolDays,
} from "../../constants";
import { useStudyPeriodSettingsTable } from "../../hooks/useStudyPeriodSettingsTable";

const studyPeriodSettingsHeaders = [
  <span key="periodsCount">periodsCount</span>,
  <span key="attendanceTracking">attendanceTracking</span>,
  <span key="periodNames">periodNames</span>,
  <span key="schoolDays">schoolDays</span>,
  <span key="breaksCount">breaksCount</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const trimValue = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

const StudyPeriodSettingsTable = () => {
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
  } = useStudyPeriodSettingsTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[140px_180px_minmax(260px,1.4fr)_minmax(260px,1.4fr)_140px_120px]"
      headers={studyPeriodSettingsHeaders}
      pageHeading="Study Period Settings"
      addLinkHref="/settings/study-period-settings/new"
      addLinkLabel="Add Study Period Settings"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search study period settings"
      emptyText="No study period settings rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.periodsCount}</div>
          <div>{renderBooleanValue(item.attendanceTrackingEnabled)}</div>
          <div>{trimValue(summarizePeriodNames(item), 60)}</div>
          <div>{trimValue(summarizeSchoolDays(item), 60)}</div>
          <div>{item.periods.filter((period) => period.hasBreakAfterPeriod).length}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/settings/study-period-settings/${item.id}`}
              editLink={`/settings/study-period-settings/${item.id}/edit`}
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

export default StudyPeriodSettingsTable;
