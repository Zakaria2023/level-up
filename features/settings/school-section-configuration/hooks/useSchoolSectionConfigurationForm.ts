"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAcademicYearStore } from "../../../academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "../../educational-stage-configuration/constants";
import { useEducationalStageConfigurationStore } from "../../educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { formatSchoolClassLabel } from "../../school-class-configuration/constants";
import { useSchoolClassConfigurationStore } from "../../school-class-configuration/store/useSchoolClassConfigurationStore";
import { SECTION_SUPERVISOR_OPTIONS } from "../constants";
import { useSchoolSectionConfigurationStore } from "../store/useSchoolSectionConfigurationStore";
import type { SchoolSectionConfigurationRow } from "../types";
import {
  addSchoolSectionConfigurationSchema,
  type AddSchoolSectionConfigurationFormValues,
} from "../validation/addSchoolSectionConfigurationSchema";

type UseSchoolSectionConfigurationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: SchoolSectionConfigurationRow,
): AddSchoolSectionConfigurationFormValues => ({
  sectionName: row?.sectionName ?? "",
  schoolClassId: row ? String(row.schoolClassId) : "",
  defaultCapacity: row?.defaultCapacity ?? 30,
  supervisorId: row?.supervisorId ?? "",
  isActive: row?.isActive ?? false,
});

export const useSchoolSectionConfigurationForm = ({
  mode = "create",
  rowId,
}: UseSchoolSectionConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useSchoolSectionConfigurationStore((state) => state.rows);
  const addRow = useSchoolSectionConfigurationStore((state) => state.addRow);
  const updateRow = useSchoolSectionConfigurationStore(
    (state) => state.updateRow,
  );
  const schoolClasses = useSchoolClassConfigurationStore((state) => state.rows);
  const educationalStages = useEducationalStageConfigurationStore(
    (state) => state.rows,
  );
  const academicYears = useAcademicYearStore((state) => state.rows);
  const existingRow = useSchoolSectionConfigurationStore((state) =>
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
  } = useForm<AddSchoolSectionConfigurationFormValues>({
    resolver: zodResolver(addSchoolSectionConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
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

    if (
      existingRow &&
      !options.some(
        (option) => option.value === String(existingRow.schoolClassId),
      )
    ) {
      options.push({
        label: `School Class #${existingRow.schoolClassId}`,
        value: String(existingRow.schoolClassId),
      });
    }

    return options;
  }, [academicYears, educationalStages, schoolClasses, existingRow]);

  const schoolClassId = useWatch({
    control,
    name: "schoolClassId",
  });
  const supervisorId = useWatch({
    control,
    name: "supervisorId",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const setSchoolClassId = (value: string) => {
    setValue("schoolClassId", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setSupervisorId = (value: string) => {
    setValue("supervisorId", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
  };

  const onSubmit = async (values: AddSchoolSectionConfigurationFormValues) => {
    try {
      setServerError(null);
      clearErrors();

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this school section record.");
        return;
      }

      const parsedSchoolClassId = Number(values.schoolClassId);

      if (!Number.isFinite(parsedSchoolClassId) || parsedSchoolClassId <= 0) {
        setServerError("Please select a valid school class.");
        return;
      }

      const normalizedSectionName = values.sectionName.trim().toLowerCase();
      const duplicateSection = rows.find(
        (row) =>
          row.id !== existingRow?.id &&
          row.sectionName.trim().toLowerCase() === normalizedSectionName &&
          row.schoolClassId === parsedSchoolClassId,
      );

      if (duplicateSection) {
        setError("sectionName", {
          type: "manual",
          message:
            "Section name already exists in this school class. Duplicate section names are not allowed here.",
        });
        return;
      }

      const nextRow: SchoolSectionConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        sectionName: values.sectionName,
        schoolClassId: parsedSchoolClassId,
        defaultCapacity: values.defaultCapacity,
        supervisorId: values.supervisorId,
        isActive: values.isActive,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/school-section-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/school-section-configuration");
    } catch {
      setServerError(
        "Unable to save the school section configuration. Please try again.",
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
    schoolClassId,
    setSchoolClassId,
    supervisorId,
    setSupervisorId,
    schoolClassOptions,
    supervisorOptions: SECTION_SUPERVISOR_OPTIONS,
    hasSchoolClassOptions: schoolClassOptions.length > 0,
  };
};
