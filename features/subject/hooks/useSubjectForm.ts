"use client";

import { formatSchoolClassLabel } from "@/features/school-class/constants";
import { useSchoolClassStore } from "@/features/school-class/store/useSchoolClassStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type FieldErrors,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  createSubjectFormSchema,
  type SubjectFormValues,
} from "../validation/SubjectSchema";

type UseSubjectFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getFriendlySubjectValidationMessage = (
  formErrors: FieldErrors<SubjectFormValues>,
  t: (key: string) => string,
) => {
  if (formErrors.subjectName) {
    return t("SubjectForm.guidance.subjectName");
  }

  if (formErrors.subjectType) {
    return t("SubjectForm.guidance.subjectType");
  }

  if (formErrors.teacherIds) {
    return t("SubjectForm.guidance.teacherIds");
  }

  if (Array.isArray(formErrors.classSettings)) {
    for (const item of formErrors.classSettings) {
      const classSettingError = item as
        | {
            schoolClassId?: unknown;
            weeklyPeriodsCount?: unknown;
            periodDurationMinutes?: unknown;
          }
        | undefined;

      if (classSettingError?.schoolClassId) {
        return t("SubjectForm.guidance.schoolClassId");
      }

      if (classSettingError?.weeklyPeriodsCount) {
        return t("SubjectForm.guidance.weeklyPeriodsCount");
      }

      if (classSettingError?.periodDurationMinutes) {
        return t("SubjectForm.guidance.periodDurationMinutes");
      }
    }
  }

  if (findFirstErrorMessage(formErrors.classSettings)) {
    return t("SubjectForm.guidance.classSettings");
  }

  if (Array.isArray(formErrors.gradeBreakdown)) {
    for (const item of formErrors.gradeBreakdown) {
      const gradeBreakdownError = item as
        | {
            activityName?: unknown;
            percentage?: unknown;
          }
        | undefined;

      if (gradeBreakdownError?.activityName) {
        return t("SubjectForm.guidance.activityName");
      }

      if (gradeBreakdownError?.percentage) {
        return t("SubjectForm.guidance.percentage");
      }
    }
  }

  if (findFirstErrorMessage(formErrors.gradeBreakdown)) {
    return t("SubjectForm.guidance.gradeBreakdown");
  }

  if (formErrors.minimumPassingGrade) {
    return t("SubjectForm.guidance.minimumPassingGrade");
  }

  if (formErrors.teachingLanguage) {
    return t("SubjectForm.guidance.teachingLanguage");
  }

  return t("SubjectForm.validationError");
};

const findFirstErrorMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = findFirstErrorMessage(item);

      if (message) {
        return message;
      }
    }

    return undefined;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  for (const nestedValue of Object.values(record)) {
    const message = findFirstErrorMessage(nestedValue);

    if (message) {
      return message;
    }
  }

  return undefined;
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
  const { t } = useTranslation();

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

  const SubjectFormSchema = createSubjectFormSchema(t);

  const {
    register,
    control,
    handleSubmit,
    reset,
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

  const addClassSetting = () => appendClassSetting(createEmptyClassSetting());
  const addGradeBreakdown = () =>
    appendGradeBreakdown(createEmptyGradeBreakdown());

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
  };

  const onInvalid = (formErrors: FieldErrors<SubjectFormValues>) => {
    const hasValidationErrors = Object.keys(formErrors).length > 0;

    if (!hasValidationErrors) {
      return;
    }

    setServerError(
      !schoolClassOptions.length
        ? t("SubjectForm.noSchoolClassMessage")
        : getFriendlySubjectValidationMessage(formErrors, t),
    );
  };

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      setServerError(null);
      clearErrors();

      if (mode === "edit" && !existingRow) {
        setServerError(t("SubjectForm.recordNotFoundError"));
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
          message: t("SubjectForm.duplicateSubjectNameError"),
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
        router.push(`/subject/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/subject");
    } catch {
      setServerError(t("SubjectForm.saveError"));
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit, onInvalid);

  return {
    register,
    control,
    handleFormSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    subjectTypeOptions: SUBJECT_TYPE_OPTIONS,
    teacherOptions: SUBJECT_TEACHER_OPTIONS,
    schoolClassOptions,
    hasSchoolClassOptions: schoolClassOptions.length > 0,
    classSettingFields,
    addClassSetting,
    removeClassSetting,
    gradeBreakdownFields,
    gradeBreakdownValues: gradeBreakdownValues ?? [],
    addGradeBreakdown,
    removeGradeBreakdown,
  };
};
