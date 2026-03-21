"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import { useEducationalStageConfigurationStore } from "../store/useEducationalStageConfigurationStore";
import type { EducationalStageConfigurationRow } from "../types";
import {
  addEducationalStageConfigurationSchema,
  type AddEducationalStageConfigurationFormValues,
} from "../validation/addEducationalStageConfigurationSchema";

type UseEducationalStageConfigurationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: EducationalStageConfigurationRow,
): AddEducationalStageConfigurationFormValues => ({
  academicYearId: row ? String(row.academicYearId) : "",
  stageName: row?.stageName ?? "",
  requiredEnrollmentAge: row?.requiredEnrollmentAge ?? 6,
  teachingLanguage: row?.teachingLanguage ?? "",
  isMixedStage: row?.isMixedStage ?? false,
});

export const useEducationalStageConfigurationForm = ({
  mode = "create",
  rowId,
}: UseEducationalStageConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useEducationalStageConfigurationStore((state) => state.rows);
  const addRow = useEducationalStageConfigurationStore((state) => state.addRow);
  const updateRow = useEducationalStageConfigurationStore(
    (state) => state.updateRow,
  );
  const academicYears = useAcademicYearStore((state) => state.rows);
  const existingRow = useEducationalStageConfigurationStore((state) =>
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
    formState: { errors, isSubmitting },
  } = useForm<AddEducationalStageConfigurationFormValues>({
    resolver: zodResolver(addEducationalStageConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const academicYearId = useWatch({
    control,
    name: "academicYearId",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const resetForm = () => {
    setServerError(null);
    reset(getDefaultValues(existingRow));
  };

  const setAcademicYearId = (value: string) => {
    setValue("academicYearId", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const academicYearOptions = academicYears.map((row) => ({
    label: row.academicYearName,
    value: String(row.id),
  }));

  const onSubmit = async (
    values: AddEducationalStageConfigurationFormValues,
  ) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this educational stage record.");
        return;
      }

      const parsedAcademicYearId = Number(values.academicYearId);

      if (!Number.isFinite(parsedAcademicYearId) || parsedAcademicYearId <= 0) {
        setServerError("Please select a valid academic year.");
        return;
      }

      const nextRow: EducationalStageConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        academicYearId: parsedAcademicYearId,
        stageName: values.stageName,
        requiredEnrollmentAge: values.requiredEnrollmentAge,
        teachingLanguage: values.teachingLanguage,
        isMixedStage: values.isMixedStage,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/educational-stage-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/educational-stage-configuration");
    } catch {
      setServerError(
        "Unable to save the educational stage configuration. Please try again.",
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
    academicYearId,
    setAcademicYearId,
    academicYearOptions,
    hasAcademicYearOptions: academicYearOptions.length > 0,
  };
};
