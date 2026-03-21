"use client";

import { formatSchoolClassLabel } from "@/features/school-class/constants";
import { useSchoolClassStore } from "@/features/school-class/store/useSchoolClassStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useAcademicYearStore } from "../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../educational-stage/constants";
import { useEducationalStageStore } from "../../educational-stage/store/useEducationalStageStore";
import { SUBJECT_TEACHER_OPTIONS, SUBJECT_TYPE_OPTIONS } from "../constants";
import { useSubjectStore } from "../store/useSubjectStore";
import type {
  SubjectClassSetting,
  SubjectGradeBreakdown,
  SubjectRow,
} from "../types";
import {
  SubjectFormSchema,
  type SubjectFormValues,
} from "../validation/SubjectSchema";

type UseSubjectFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const createEmptyClassSetting = () => ({
  schoolClassId: "",
  weeklyPeriodsCount: 1,
  periodDurationMinutes: 45,
});

const createEmptyGradeBreakdown = () => ({
  activityName: "",
  percentage: 0,
});

const toFormClassSetting = (setting?: SubjectClassSetting) => ({
  schoolClassId: setting ? String(setting.schoolClassId) : "",
  weeklyPeriodsCount: setting?.weeklyPeriodsCount ?? 1,
  periodDurationMinutes: setting?.periodDurationMinutes ?? 45,
});

const toFormGradeBreakdown = (item?: SubjectGradeBreakdown) => ({
  activityName: item?.activityName ?? "",
  percentage: item?.percentage ?? 0,
});

const getDefaultValues = (row?: SubjectRow): SubjectFormValues => ({
  subjectName: row?.subjectName ?? "",
  subjectType: row?.subjectType ?? "Core",
  classSettings: row?.classSettings.length
    ? row.classSettings.map((setting) => toFormClassSetting(setting))
    : [createEmptyClassSetting()],
  teacherIds: row?.teacherIds ?? [],
  countsTowardAverage: row?.countsTowardAverage ?? false,
  minimumPassingGrade: row?.minimumPassingGrade ?? 50,
  gradeBreakdown: row?.gradeBreakdown.length
    ? row.gradeBreakdown.map((item) => toFormGradeBreakdown(item))
    : [createEmptyGradeBreakdown()],
  requiresLab: row?.requiresLab ?? false,
  hasQuestionBank: row?.hasQuestionBank ?? false,
  teachingLanguage: row?.teachingLanguage ?? "",
});

export const useSubjectForm = ({
  mode = "create",
  rowId,
}: UseSubjectFormOptions = {}) => {
  const router = useRouter();
  const rows = useSubjectStore((state) => state.rows);
  const addRow = useSubjectStore((state) => state.addRow);
  const updateRow = useSubjectStore((state) => state.updateRow);
  const schoolClasses = useSchoolClassStore((state) => state.rows);
  const educationalStages = useEducationalStageStore((state) => state.rows);
  const academicYears = useAcademicYearStore((state) => state.rows);
  const existingRow = useSubjectStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const {
    fields: classSettingFields,
    append: appendClassSetting,
    remove: removeClassSetting,
  } = useFieldArray({
    control,
    name: "classSettings",
  });
  const {
    fields: gradeBreakdownFields,
    append: appendGradeBreakdown,
    remove: removeGradeBreakdown,
  } = useFieldArray({
    control,
    name: "gradeBreakdown",
  });

  const schoolClassOptions = useMemo(() => {
    const academicYearMap = new Map(
      academicYears.map((row) => [row.id, row.academicYearName]),
    );
    const educationalStageMap = new Map(
      educationalStages.map((row) => [
        row.id,
        formatEducationalStageLabel(
          row.stageName,
          resolveAcademicYearLabel(academicYearMap.get(row.academicYearId)),
        ),
      ]),
    );
    const options = schoolClasses.map((row) => ({
      label: formatSchoolClassLabel(
        row.className,
        educationalStageMap.get(row.educationalStageId),
      ),
      value: String(row.id),
    }));

    const existingClassOptions =
      existingRow?.classSettings
        .map((setting) => String(setting.schoolClassId))
        .filter((id) => !options.some((option) => option.value === id)) ?? [];

    existingClassOptions.forEach((id) => {
      options.push({
        label: `School Class #${id}`,
        value: id,
      });
    });

    return options;
  }, [academicYears, educationalStages, schoolClasses, existingRow]);

  const subjectType = useWatch({
    control,
    name: "subjectType",
  });
  const teacherIds = useWatch({
    control,
    name: "teacherIds",
  });
  const gradeBreakdownValues = useWatch({
    control,
    name: "gradeBreakdown",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const setSubjectType = (value: string) => {
    setValue("subjectType", value as SubjectFormValues["subjectType"], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setTeacherIds = (values: string[]) => {
    setValue("teacherIds", values, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setClassSettingSchoolClassId = (index: number, value: string) => {
    setValue(`classSettings.${index}.schoolClassId`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addClassSetting = () => appendClassSetting(createEmptyClassSetting());
  const addGradeBreakdown = () =>
    appendGradeBreakdown(createEmptyGradeBreakdown());

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
  };

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      setServerError(null);
      clearErrors();

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this subject record.");
        return;
      }

      const normalizedSubjectName = values.subjectName.trim().toLowerCase();
      const duplicateSubject = rows.find(
        (row) =>
          row.id !== existingRow?.id &&
          row.subjectName.trim().toLowerCase() === normalizedSubjectName,
      );

      if (duplicateSubject) {
        setError("subjectName", {
          type: "manual",
          message:
            "Subject name already exists. Duplicate subject names are not allowed.",
        });
        return;
      }

      const nextRow: SubjectRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        subjectName: values.subjectName,
        subjectType: values.subjectType,
        classSettings: values.classSettings.map((setting) => ({
          schoolClassId: Number(setting.schoolClassId),
          weeklyPeriodsCount: setting.weeklyPeriodsCount,
          periodDurationMinutes: setting.periodDurationMinutes,
        })),
        teacherIds: values.teacherIds,
        countsTowardAverage: values.countsTowardAverage,
        minimumPassingGrade: values.minimumPassingGrade,
        gradeBreakdown: values.gradeBreakdown,
        requiresLab: values.requiresLab,
        hasQuestionBank: values.hasQuestionBank,
        teachingLanguage: values.teachingLanguage,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/subject-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/subject-configuration");
    } catch {
      setServerError(
        "Unable to save the subject configuration. Please try again.",
      );
    }
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    subjectType,
    setSubjectType,
    subjectTypeOptions: SUBJECT_TYPE_OPTIONS,
    teacherIds: teacherIds ?? [],
    setTeacherIds,
    teacherOptions: SUBJECT_TEACHER_OPTIONS,
    schoolClassOptions,
    hasSchoolClassOptions: schoolClassOptions.length > 0,
    classSettingFields,
    setClassSettingSchoolClassId,
    addClassSetting,
    removeClassSetting,
    gradeBreakdownFields,
    gradeBreakdownValues: gradeBreakdownValues ?? [],
    addGradeBreakdown,
    removeGradeBreakdown,
  };
};
