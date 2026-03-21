"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAcademicYearStore } from "../store/useAcademicYearStore";
import type { AcademicYearRow } from "../types";
import {
  createAcademicYearSchema,
  type AcademicYearFormValues,
} from "../validation/AcademicYearSchema";

type UseAcademicYearFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (row?: AcademicYearRow): AcademicYearFormValues => ({
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

export const useAcademicYearForm = ({
  mode = "create",
  rowId,
}: UseAcademicYearFormOptions = {}) => {
  const { t } = useTranslation();

  const router = useRouter();
  const rows = useAcademicYearStore((state) => state.rows);
  const addRow = useAcademicYearStore((state) => state.addRow);
  const updateRow = useAcademicYearStore((state) => state.updateRow);
  const existingRow = useAcademicYearStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const AcademicYearSchema = createAcademicYearSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AcademicYearFormValues>({
    resolver: zodResolver(AcademicYearSchema),
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

  const onSubmit = async (values: AcademicYearFormValues) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this academic year record.");
        return;
      }

      const nextRow: AcademicYearRow = {
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
        router.push(`/academic-year/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/academic-year");
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
    t,
  };
};
