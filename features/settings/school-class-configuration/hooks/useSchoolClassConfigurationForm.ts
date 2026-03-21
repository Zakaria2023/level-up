"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../../educational-stage/constants";
import { useEducationalStageStore } from "../../../educational-stage/store/useEducationalStageStore";
import { useSchoolClassConfigurationStore } from "../store/useSchoolClassConfigurationStore";
import type { SchoolClassConfigurationRow } from "../types";
import {
  addSchoolClassConfigurationSchema,
  type AddSchoolClassConfigurationFormValues,
} from "../validation/addSchoolClassConfigurationSchema";

type UseSchoolClassConfigurationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: SchoolClassConfigurationRow,
): AddSchoolClassConfigurationFormValues => ({
  className: row?.className ?? "",
  educationalStageId: row ? String(row.educationalStageId) : "",
  minimumPassingGrade: row?.minimumPassingGrade ?? 50,
  isActive: row?.isActive ?? false,
});

export const useSchoolClassConfigurationForm = ({
  mode = "create",
  rowId,
}: UseSchoolClassConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useSchoolClassConfigurationStore((state) => state.rows);
  const addRow = useSchoolClassConfigurationStore((state) => state.addRow);
  const updateRow = useSchoolClassConfigurationStore(
    (state) => state.updateRow,
  );
  const educationalStages = useEducationalStageStore((state) => state.rows);
  const academicYears = useAcademicYearStore((state) => state.rows);
  const existingRow = useSchoolClassConfigurationStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AddSchoolClassConfigurationFormValues>({
    resolver: zodResolver(addSchoolClassConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const educationalStageOptions = useMemo(() => {
    const academicYearMap = new Map(
      academicYears.map((row) => [row.id, row.academicYearName]),
    );
    const options = educationalStages.map((row) => ({
      label: formatEducationalStageLabel(
        row.stageName,
        resolveAcademicYearLabel(academicYearMap.get(row.academicYearId)),
      ),
      value: String(row.id),
    }));

    if (
      existingRow &&
      !options.some(
        (option) => option.value === String(existingRow.educationalStageId),
      )
    ) {
      options.push({
        label: `Educational Stage #${existingRow.educationalStageId}`,
        value: String(existingRow.educationalStageId),
      });
    }

    return options;
  }, [academicYears, educationalStages, existingRow]);

  const educationalStageId = useWatch({
    control,
    name: "educationalStageId",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const setEducationalStageId = (value: string) => {
    setValue("educationalStageId", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
  };

  const onSubmit = async (values: AddSchoolClassConfigurationFormValues) => {
    try {
      setServerError(null);
      clearErrors();

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this school class record.");
        return;
      }

      const parsedEducationalStageId = Number(values.educationalStageId);

      if (
        !Number.isFinite(parsedEducationalStageId) ||
        parsedEducationalStageId <= 0
      ) {
        setServerError("Please select a valid educational stage.");
        return;
      }

      const normalizedClassName = values.className.trim().toLowerCase();
      const duplicateClass = rows.find(
        (row) =>
          row.id !== existingRow?.id &&
          row.className.trim().toLowerCase() === normalizedClassName &&
          row.educationalStageId === parsedEducationalStageId,
      );

      if (duplicateClass) {
        setError("className", {
          type: "manual",
          message:
            "Class name already exists in this educational stage. Duplicate class names are not allowed here.",
        });
        return;
      }

      const nextRow: SchoolClassConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        className: values.className,
        educationalStageId: parsedEducationalStageId,
        minimumPassingGrade: values.minimumPassingGrade,
        isActive: values.isActive,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/school-class-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/school-class-configuration");
    } catch {
      setServerError(
        "Unable to save the school class configuration. Please try again.",
      );
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    educationalStageId,
    setEducationalStageId,
    educationalStageOptions,
    hasEducationalStageOptions: educationalStageOptions.length > 0,
  };
};
