"use client";

import { renderBooleanValue } from "@/lib/utils/helpers";
import { useMemo, useState } from "react";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../educational-stage-configuration/constants";
import { useEducationalStageConfigurationStore } from "../../educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { formatSchoolClassLabel } from "../../school-class-configuration/constants";
import { useSchoolClassConfigurationStore } from "../../school-class-configuration/store/useSchoolClassConfigurationStore";
import {
  resolveSchoolClassLabel,
  resolveTeacherLabel,
  SUBJECT_TEACHER_OPTIONS,
  summarizeClassSettings,
  summarizeGradeBreakdown,
  summarizeTeacherNames,
} from "../constants";
import { useSubjectConfigurationStore } from "../store/useSubjectConfigurationStore";
import { SubjectConfigurationRow } from "../types";

const PAGE_SIZE = 5;

const toSearchableValues = (
  row: SubjectConfigurationRow,
  schoolClassMap: Map<number, string>,
  teacherMap: Map<string, string>,
) => [
  row.subjectName,
  row.subjectType,
  summarizeClassSettings(row, schoolClassMap),
  summarizeTeacherNames(row.teacherIds, teacherMap),
  renderBooleanValue(row.countsTowardAverage),
  `${row.minimumPassingGrade}%`,
  summarizeGradeBreakdown(row.gradeBreakdown),
  renderBooleanValue(row.requiresLab),
  renderBooleanValue(row.hasQuestionBank),
  row.teachingLanguage,
];

export const useSubjectConfigurationTable = () => {
  const rows = useSubjectConfigurationStore((state) => state.rows);
  const deleteRow = useSubjectConfigurationStore((state) => state.deleteRow);
  const schoolClasses = useSchoolClassConfigurationStore((state) => state.rows);
  const educationalStages = useEducationalStageConfigurationStore(
    (state) => state.rows,
  );
  const academicYears = useAcademicYearStore((state) => state.rows);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const academicYearMap = useMemo(
    () => new Map(academicYears.map((row) => [row.id, row.academicYearName])),
    [academicYears],
  );
  const educationalStageMap = useMemo(
    () =>
      new Map(
        educationalStages.map((row) => [
          row.id,
          formatEducationalStageLabel(
            row.stageName,
            resolveAcademicYearLabel(academicYearMap.get(row.academicYearId)),
          ),
        ]),
      ),
    [academicYearMap, educationalStages],
  );
  const schoolClassMap = useMemo(
    () =>
      new Map(
        schoolClasses.map((row) => [
          row.id,
          formatSchoolClassLabel(
            row.className,
            educationalStageMap.get(row.educationalStageId),
          ),
        ]),
      ),
    [educationalStageMap, schoolClasses],
  );
  const teacherMap = useMemo(
    () =>
      new Map(SUBJECT_TEACHER_OPTIONS.map((item) => [item.value, item.label])),
    [],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      toSearchableValues(row, schoolClassMap, teacherMap).some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [rows, searchValue, schoolClassMap, teacherMap]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedRows = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  const resolveTeacherName = (teacherId: string) =>
    resolveTeacherLabel(teacherMap.get(teacherId));
  const resolveSchoolClassName = (schoolClassId: number) =>
    resolveSchoolClassLabel(schoolClassMap.get(schoolClassId));

  return {
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
    resolveTeacherName,
    resolveSchoolClassName,
  };
};
