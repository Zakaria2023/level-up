"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  stageName: row?.stageName ?? "",
  requiredEnrollmentAge: row?.requiredEnrollmentAge ?? 6,
  gradeCategory: row?.gradeCategory ?? "",
  isMixedStage: row?.isMixedStage ?? false,
});

export const useEducationalStageConfigurationForm = ({
  mode = "create",
  rowId,
}: UseEducationalStageConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useEducationalStageConfigurationStore((state) => state.rows);
  const addRow = useEducationalStageConfigurationStore((state) => state.addRow);
  const updateRow = useEducationalStageConfigurationStore((state) => state.updateRow);
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
    formState: { errors, isSubmitting },
  } = useForm<AddEducationalStageConfigurationFormValues>({
    resolver: zodResolver(addEducationalStageConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
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

  const onSubmit = async (values: AddEducationalStageConfigurationFormValues) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this educational stage record.");
        return;
      }

      const nextRow: EducationalStageConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) + 1,
        stageName: values.stageName,
        requiredEnrollmentAge: values.requiredEnrollmentAge,
        gradeCategory: values.gradeCategory,
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
  };
};
