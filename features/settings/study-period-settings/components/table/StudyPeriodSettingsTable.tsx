"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import {
  summarizePeriodNames,
  summarizeSchoolDays,
} from "../../constants";
import { useStudyPeriodSettingsTable } from "../../hooks/useStudyPeriodSettingsTable";

const trimValue = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

const StudyPeriodSettingsTable = () => {
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
  } = useStudyPeriodSettingsTable();

  const studyPeriodSettingsHeaders = [
    <span key="periodsCount">{t("StudyPeriodSettingsTable.periodsCount")}</span>,
    <span key="attendanceTracking">
      {t("StudyPeriodSettingsTable.attendanceTracking")}
    </span>,
    <span key="periodNames">{t("StudyPeriodSettingsTable.periodNames")}</span>,
    <span key="schoolDays">{t("StudyPeriodSettingsTable.schoolDays")}</span>,
    <span key="breaksCount">{t("StudyPeriodSettingsTable.breaksCount")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("StudyPeriodSettingsTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[140px_180px_minmax(260px,1.4fr)_minmax(260px,1.4fr)_140px_120px]"
      headers={studyPeriodSettingsHeaders}
      pageHeading={t("StudyPeriodSettingsTable.pageHeading")}
      addLinkHref="/settings/study-period-settings/new"
      addLinkLabel={t("StudyPeriodSettingsTable.addStudyPeriodSettings")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("StudyPeriodSettingsTable.searchPlaceholder")}
      emptyText={t("StudyPeriodSettingsTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("StudyPeriodSettingsTable.records")}
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