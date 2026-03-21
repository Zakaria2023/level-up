"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAcademicYearConfigurationStore } from "../../academic-year-configuration/store/useAcademicYearConfigurationStore";
import { SEMESTER_EVALUATION_TYPE_OPTIONS } from "../constants";
import { useSemesterConfigurationStore } from "../store/useSemesterConfigurationStore";
import type { SemesterConfigurationRow } from "../types";
import {
  addSemesterConfigurationSchema,
  type AddSemesterConfigurationFormValues,
} from "../validation/addSemesterConfigurationSchema";

type UseSemesterConfigurationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: SemesterConfigurationRow,
): AddSemesterConfigurationFormValues => ({
  semesterName: row?.semesterName ?? "",
  academicYearId: row ? String(row.academicYearId) : "",
  semesterStartDate: row?.semesterStartDate ?? "",
  semesterEndDate: row?.semesterEndDate ?? "",
  actualLessonsStartDate: row?.actualLessonsStartDate ?? "",
  actualLessonsEndDate: row?.actualLessonsEndDate ?? "",
  finalExamDate: row?.finalExamDate ?? "",
  evaluationType: row?.evaluationType ?? "Monthly",
});

export const useSemesterConfigurationForm = ({
  mode = "create",
  rowId,
}: UseSemesterConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useSemesterConfigurationStore((state) => state.rows);
  const addRow = useSemesterConfigurationStore((state) => state.addRow);
  const updateRow = useSemesterConfigurationStore((state) => state.updateRow);
  const academicYears = useAcademicYearConfigurationStore((state) => state.rows);
  const existingRow = useSemesterConfigurationStore((state) =>
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
  } = useForm<AddSemesterConfigurationFormValues>({
    resolver: zodResolver(addSemesterConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const academicYearOptions = useMemo(() => {
    const options = academicYears.map((row) => ({
      label: row.academicYearName,
      value: String(row.id),
    }));

    if (
      existingRow &&
      !options.some((option) => option.value === String(existingRow.academicYearId))
    ) {
      options.push({
        label: `Academic Year #${existingRow.academicYearId}`,
        value: String(existingRow.academicYearId),
      });
    }

    return options;
  }, [academicYears, existingRow]);

  const academicYearId = useWatch({
    control,
    name: "academicYearId",
  });
  const evaluationType = useWatch({
    control,
    name: "evaluationType",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const setAcademicYearId = (value: string) => {
    setValue("academicYearId", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setEvaluationType = (value: string) => {
    setValue(
      "evaluationType",
      value as AddSemesterConfigurationFormValues["evaluationType"],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const resetForm = () => {
    setServerError(null);
    reset(getDefaultValues(existingRow));
  };

  const onSubmit = async (values: AddSemesterConfigurationFormValues) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this semester configuration record.");
        return;
      }

      const parsedAcademicYearId = Number(values.academicYearId);

      if (!Number.isFinite(parsedAcademicYearId) || parsedAcademicYearId <= 0) {
        setServerError("Please select a valid academic year.");
        return;
      }

      const nextRow: SemesterConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) + 1,
        semesterName: values.semesterName,
        academicYearId: parsedAcademicYearId,
        semesterStartDate: values.semesterStartDate,
        semesterEndDate: values.semesterEndDate,
        actualLessonsStartDate: values.actualLessonsStartDate,
        actualLessonsEndDate: values.actualLessonsEndDate,
        finalExamDate: values.finalExamDate,
        evaluationType: values.evaluationType,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/semester-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/semester-configuration");
    } catch {
      setServerError(
        "Unable to save the semester configuration. Please try again.",
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
    evaluationType,
    setEvaluationType,
    academicYearOptions,
    evaluationTypeOptions: SEMESTER_EVALUATION_TYPE_OPTIONS,
    hasAcademicYearOptions: academicYearOptions.length > 0,
  };
};
