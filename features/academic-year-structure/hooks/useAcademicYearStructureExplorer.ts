"use client";

import { useAcademicYearStore } from "@/features/academic-year/store/useAcademicYearStore";
import { useSemesterStore } from "@/features/semester/store/useSemesterStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "@/features/settings/educational-stage-configuration/constants";
import { useEducationalStageConfigurationStore } from "@/features/settings/educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { formatSchoolClassLabel } from "@/features/settings/school-class-configuration/constants";
import { useSchoolClassConfigurationStore } from "@/features/settings/school-class-configuration/store/useSchoolClassConfigurationStore";
import { SECTION_SUPERVISOR_OPTIONS } from "@/features/settings/school-section-configuration/constants";
import { useSchoolSectionConfigurationStore } from "@/features/settings/school-section-configuration/store/useSchoolSectionConfigurationStore";
import { SUBJECT_TEACHER_OPTIONS } from "@/features/settings/subject-configuration/constants";
import { useSubjectConfigurationStore } from "@/features/settings/subject-configuration/store/useSubjectConfigurationStore";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AcademicYearStructureData } from "../types";

export const useAcademicYearStructureExplorer = (): AcademicYearStructureData => {
  const { t } = useTranslation();

  const academicYears = useAcademicYearStore((state) => state.rows);
  const semesters = useSemesterStore((state) => state.rows);
  const educationalStages = useEducationalStageConfigurationStore(
    (state) => state.rows,
  );
  const schoolClasses = useSchoolClassConfigurationStore((state) => state.rows);
  const schoolSections = useSchoolSectionConfigurationStore((state) => state.rows);
  const subjects = useSubjectConfigurationStore((state) => state.rows);

  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");

  const resolvedSelectedAcademicYearId =
    selectedAcademicYearId &&
    academicYears.some((row) => String(row.id) === selectedAcademicYearId)
      ? selectedAcademicYearId
      : academicYears[0]
        ? String(academicYears[0].id)
        : "";

  const academicYearOptions = useMemo(
    () =>
      academicYears.map((row) => ({
        label: row.academicYearName,
        value: String(row.id),
      })),
    [academicYears],
  );

  const selectedAcademicYear = academicYears.find(
    (row) => String(row.id) === resolvedSelectedAcademicYearId,
  );

  const filteredSemesters = useMemo(() => {
    if (!selectedAcademicYear) {
      return [];
    }

    return semesters.filter((row) => row.academicYearId === selectedAcademicYear.id);
  }, [semesters, selectedAcademicYear]);

  const selectedYearSemesterNames = useMemo(
    () =>
      selectedAcademicYear?.semesters
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? [],
    [selectedAcademicYear],
  );

  const semesterMap = useMemo(
    () =>
      new Map(
        filteredSemesters.map((semester) => [semester.semesterName, semester]),
      ),
    [filteredSemesters],
  );

  const supervisorLabelMap = useMemo(
    () =>
      new Map(
        SECTION_SUPERVISOR_OPTIONS.map((option) => [
          option.value,
          t(`AcademicYearStructureExplorer.supervisorOptions.${option.value}`, {
            defaultValue: option.label,
          }),
        ]),
      ),
    [t],
  );

  const teacherLabelMap = useMemo(
    () =>
      new Map(
        SUBJECT_TEACHER_OPTIONS.map((option) => [
          option.value,
          t(`AcademicYearStructureExplorer.teacherOptions.${option.value}`, {
            defaultValue: option.label,
          }),
        ]),
      ),
    [t],
  );

  const semesterTimeline = useMemo(() => {
    if (selectedYearSemesterNames.length) {
      return selectedYearSemesterNames.map((semesterName, index) => ({
        key: `${semesterName}-${index}`,
        label: semesterName,
        semester: semesterMap.get(semesterName),
      }));
    }

    return filteredSemesters.map((semester) => ({
      key: String(semester.id),
      label: semester.semesterName,
      semester,
    }));
  }, [filteredSemesters, selectedYearSemesterNames, semesterMap]);

  const academicYearNameMap = useMemo(
    () => new Map(academicYears.map((row) => [row.id, row.academicYearName])),
    [academicYears],
  );

  const stageStructure = useMemo(
    () =>
      educationalStages
        .filter((stage) => stage.academicYearId === selectedAcademicYear?.id)
        .map((stage) => {
          const stageLabel = formatEducationalStageLabel(
            stage.stageName,
            resolveAcademicYearLabel(academicYearNameMap.get(stage.academicYearId)),
          );
          const classes = schoolClasses.filter(
            (schoolClass) => schoolClass.educationalStageId === stage.id,
          );

          return {
            stage,
            stageLabel,
            classes: classes.map((schoolClass) => {
              const sections = schoolSections.filter(
                (section) => section.schoolClassId === schoolClass.id,
              );
              const classSubjects = subjects.filter((subject) =>
                subject.classSettings.some(
                  (classSetting) => classSetting.schoolClassId === schoolClass.id,
                ),
              );

              return {
                schoolClass,
                schoolClassLabel: formatSchoolClassLabel(
                  schoolClass.className,
                  stageLabel,
                ),
                sections,
                subjects: classSubjects.map((subject) => ({
                  ...subject,
                  classSetting: subject.classSettings.find(
                    (setting) => setting.schoolClassId === schoolClass.id,
                  ),
                })),
              };
            }),
          };
        }),
    [
      academicYearNameMap,
      educationalStages,
      schoolClasses,
      schoolSections,
      selectedAcademicYear?.id,
      subjects,
    ],
  );

  const totalClasses = useMemo(
    () => stageStructure.reduce((total, stage) => total + stage.classes.length, 0),
    [stageStructure],
  );

  const totalSections = useMemo(
    () =>
      stageStructure.reduce(
        (total, stage) =>
          total +
          stage.classes.reduce(
            (classTotal, item) => classTotal + item.sections.length,
            0,
          ),
        0,
      ),
    [stageStructure],
  );

  const totalSubjects = useMemo(
    () =>
      stageStructure.reduce(
        (total, stage) =>
          total +
          stage.classes.reduce(
            (classTotal, item) => classTotal + item.subjects.length,
            0,
          ),
        0,
      ),
    [stageStructure],
  );

  return {
    academicYears,
    academicYearOptions,
    selectedAcademicYear,
    selectedAcademicYearId: resolvedSelectedAcademicYearId,
    setSelectedAcademicYearId,
    selectedYearSemesterNames,
    semesterTimeline,
    stageStructure,
    totalClasses,
    totalSections,
    totalSubjects,
    supervisorLabelMap,
    teacherLabelMap,
  };
};
