"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { renderBooleanValue } from "@/lib/utils/helpers";
import {
  summarizeClassSettings,
  summarizeGradeBreakdown,
  summarizeTeacherNames,
} from "../../constants";
import { useSubjectTable } from "../../hooks/useSubjectTable";

const trimValue = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

const subjectConfigurationTableHeaders = [
  <span key="subjectName">subjectName</span>,
  <span key="subjectType">subjectType</span>,
  <span key="schoolClasses">schoolClasses</span>,
  <span key="teachers">teachers</span>,
  <span key="countsTowardAverage">countsTowardAverage</span>,
  <span key="minimumPassingGrade">minimumPassingGrade</span>,
  <span key="gradeBreakdown">gradeBreakdown</span>,
  <span key="requiresLab">requiresLab</span>,
  <span key="hasQuestionBank">hasQuestionBank</span>,
  <span key="teachingLanguage">teachingLanguage</span>,
  <span key="actions" className="block w-full text-center">
    actions
  </span>,
];

const SubjectConfigurationTable = () => {
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

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(280px,1.7fr)_minmax(240px,1.5fr)_minmax(180px,1.1fr)_minmax(180px,1.1fr)_minmax(280px,1.7fr)_minmax(150px,1fr)_minmax(170px,1.1fr)_minmax(180px,1.1fr)_120px]"
      headers={subjectConfigurationTableHeaders}
      pageHeading="Subject Configuration"
      addLinkHref="/subject-configuration/new"
      addLinkLabel="Add Subject"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search subject configuration"
      emptyText="No subject configuration rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
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
              viewLink={`/subject-configuration/${item.id}`}
              editLink={`/subject-configuration/${item.id}/edit`}
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

export default SubjectConfigurationTable;
