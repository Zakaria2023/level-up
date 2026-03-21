"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAcademicYearConfigurationStore } from "../store/useAcademicYearConfigurationStore";
import type { AcademicYearConfigurationRow } from "../types";
import {
  addAcademicYearConfigurationSchema,
  type AddAcademicYearConfigurationFormValues,
} from "../validation/addAcademicYearConfigurationSchema";

type UseAcademicYearConfigurationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: AcademicYearConfigurationRow,
): AddAcademicYearConfigurationFormValues => ({
  academicYearName: row?.academicYearName ?? "",
  startDate: row?.startDate ?? "",
  endDate: row?.endDate ?? "",
  registrationStartDate: row?.registrationStartDate ?? "",
  registrationEndDate: row?.registrationEndDate ?? "",
  allowGradeEditingAfterEnd: row?.allowGradeEditingAfterEnd ?? false,
  allowStudentFileEditingAfterEnd:
    row?.allowStudentFileEditingAfterEnd ?? false,
  semesters: row?.semesters ?? "",
  isActive: row?.isActive ?? false,
});

export const useAcademicYearConfigurationForm = ({
  mode = "create",
  rowId,
}: UseAcademicYearConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useAcademicYearConfigurationStore((state) => state.rows);
  const addRow = useAcademicYearConfigurationStore((state) => state.addRow);
  const updateRow = useAcademicYearConfigurationStore((state) => state.updateRow);
  const existingRow = useAcademicYearConfigurationStore((state) =>
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
  } = useForm<AddAcademicYearConfigurationFormValues>({
    resolver: zodResolver(addAcademicYearConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const semestersValue = useWatch({
    control,
    name: "semesters",
  });

  const semesters = (semestersValue ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

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

  const setSemesters = (values: string[]) => {
    setValue("semesters", values.join(", "), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: AddAcademicYearConfigurationFormValues) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this academic year record.");
        return;
      }

      const nextRow: AcademicYearConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        academicYearName: values.academicYearName,
        startDate: values.startDate,
        endDate: values.endDate,
        registrationStartDate: values.registrationStartDate,
        registrationEndDate: values.registrationEndDate,
        allowGradeEditingAfterEnd: values.allowGradeEditingAfterEnd,
        allowStudentFileEditingAfterEnd: values.allowStudentFileEditingAfterEnd,
        semesters: values.semesters,
        isActive: values.isActive,
        hasActiveStudentRecord: existingRow?.hasActiveStudentRecord ?? false,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/academic-year-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/academic-year-configuration");
    } catch {
      setServerError(
        "Unable to save the academic year configuration. Please try again.",
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
    mode,
    semesters,
    setSemesters,
  };
};
