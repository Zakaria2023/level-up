"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSchoolClassConfigurationStore } from "../../school-class-configuration/store/useSchoolClassConfigurationStore";
import {
  SUBJECT_TEACHER_OPTIONS,
  SUBJECT_TYPE_OPTIONS,
} from "../constants";
import { useSubjectConfigurationStore } from "../store/useSubjectConfigurationStore";
import type {
  SubjectClassSetting,
  SubjectConfigurationRow,
  SubjectGradeBreakdown,
} from "../types";
import {
  addSubjectConfigurationSchema,
  type AddSubjectConfigurationFormValues,
} from "../validation/addSubjectConfigurationSchema";

type UseSubjectConfigurationFormOptions = {
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

const getDefaultValues = (
  row?: SubjectConfigurationRow,
): AddSubjectConfigurationFormValues => ({
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

export const useSubjectConfigurationForm = ({
  mode = "create",
  rowId,
}: UseSubjectConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useSubjectConfigurationStore((state) => state.rows);
  const addRow = useSubjectConfigurationStore((state) => state.addRow);
  const updateRow = useSubjectConfigurationStore((state) => state.updateRow);
  const schoolClasses = useSchoolClassConfigurationStore((state) => state.rows);
  const existingRow = useSubjectConfigurationStore((state) =>
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
  } = useForm<AddSubjectConfigurationFormValues>({
    resolver: zodResolver(addSubjectConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const { fields: classSettingFields, append: appendClassSetting, remove: removeClassSetting } =
    useFieldArray({
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
    const options = schoolClasses.map((row) => ({
      label: row.className,
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
  }, [schoolClasses, existingRow]);

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
    setValue("subjectType", value as AddSubjectConfigurationFormValues["subjectType"], {
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
  const addGradeBreakdown = () => appendGradeBreakdown(createEmptyGradeBreakdown());

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
  };

  const onSubmit = async (values: AddSubjectConfigurationFormValues) => {
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
          message: "Subject name already exists. Duplicate subject names are not allowed.",
        });
        return;
      }

      const nextRow: SubjectConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) + 1,
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
      setServerError("Unable to save the subject configuration. Please try again.");
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
