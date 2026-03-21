"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import {
  summarizeClassSettings,
  summarizeGradeBreakdown,
  summarizeTeacherNames,
} from "../../constants";
import { useSubjectTable } from "../../hooks/useSubjectTable";

const trimValue = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

const SubjectTable = () => {
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
    schoolClassMap,
    teacherMap,
  } = useSubjectTable();

  const subjectTableHeaders = [
    <span key="subjectName">{t("SubjectTable.subjectName")}</span>,
    <span key="subjectType">{t("SubjectTable.subjectType")}</span>,
    <span key="schoolClasses">{t("SubjectTable.schoolClasses")}</span>,
    <span key="teachers">{t("SubjectTable.teachers")}</span>,
    <span key="countsTowardAverage">{t("SubjectTable.countsTowardAverage")}</span>,
    <span key="minimumPassingGrade">{t("SubjectTable.minimumPassingGrade")}</span>,
    <span key="gradeBreakdown">{t("SubjectTable.gradeBreakdown")}</span>,
    <span key="requiresLab">{t("SubjectTable.requiresLab")}</span>,
    <span key="hasQuestionBank">{t("SubjectTable.hasQuestionBank")}</span>,
    <span key="teachingLanguage">{t("SubjectTable.teachingLanguage")}</span>,
    <span key="actions" className="block w-full text-center">
      {t("SubjectTable.actions")}
    </span>,
  ];

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(280px,1.7fr)_minmax(240px,1.5fr)_minmax(180px,1.1fr)_minmax(180px,1.1fr)_minmax(280px,1.7fr)_minmax(150px,1fr)_minmax(170px,1.1fr)_minmax(180px,1.1fr)_120px]"
      headers={subjectTableHeaders}
      pageHeading={t("SubjectTable.pageHeading")}
      addLinkHref="/subject/new"
      addLinkLabel={t("SubjectTable.addSubject")}
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder={t("SubjectTable.searchPlaceholder")}
      emptyText={t("SubjectTable.emptyText")}
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} {t("SubjectTable.records")}
        </div>
      }
      renderRow={(item) => (
        <>
          <div>{item.subjectName}</div>
          <div>{item.subjectType}</div>
          <div>{trimValue(summarizeClassSettings(item, schoolClassMap), 70)}</div>
          <div>{trimValue(summarizeTeacherNames(item.teacherIds, teacherMap), 55)}</div>
          <div>{renderBooleanValue(item.countsTowardAverage)}</div>
          <div>{item.minimumPassingGrade}%</div>
          <div>{trimValue(summarizeGradeBreakdown(item.gradeBreakdown), 70)}</div>
          <div>{renderBooleanValue(item.requiresLab)}</div>
          <div>{renderBooleanValue(item.hasQuestionBank)}</div>
          <div>{item.teachingLanguage}</div>
          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/subject/${item.id}`}
              editLink={`/subject/${item.id}/edit`}
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

export default SubjectTable;