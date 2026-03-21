"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { HALL_TYPE_OPTIONS } from "../constants";
import { useHallConfigurationStore } from "../store/useHallConfigurationStore";
import type { HallConfigurationRow } from "../types";
import {
  addHallConfigurationSchema,
  type AddHallConfigurationFormValues,
} from "../validation/addHallConfigurationSchema";

type UseHallConfigurationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: HallConfigurationRow,
): AddHallConfigurationFormValues => ({
  hallName: row?.hallName ?? "",
  hallNumber: row?.hallNumber ?? "",
  capacity: row?.capacity ?? 30,
  hallType: row?.hallType ?? "Classroom",
  buildingName: row?.buildingName ?? "",
  floorNumber: row?.floorNumber ?? 0,
});

export const useHallConfigurationForm = ({
  mode = "create",
  rowId,
}: UseHallConfigurationFormOptions = {}) => {
  const router = useRouter();
  const rows = useHallConfigurationStore((state) => state.rows);
  const addRow = useHallConfigurationStore((state) => state.addRow);
  const updateRow = useHallConfigurationStore((state) => state.updateRow);
  const existingRow = useHallConfigurationStore((state) =>
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
  } = useForm<AddHallConfigurationFormValues>({
    resolver: zodResolver(addHallConfigurationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const hallType = useWatch({
    control,
    name: "hallType",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const setHallType = (value: string) => {
    setValue("hallType", value as AddHallConfigurationFormValues["hallType"], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
  };

  const hallTypeOptions = useMemo(() => HALL_TYPE_OPTIONS, []);

  const onSubmit = async (values: AddHallConfigurationFormValues) => {
    try {
      setServerError(null);
      clearErrors();

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this hall record.");
        return;
      }

      const normalizedHallNumber = values.hallNumber.trim().toLowerCase();
      const duplicateHallNumber = rows.find(
        (row) =>
          row.id !== existingRow?.id &&
          row.hallNumber.trim().toLowerCase() === normalizedHallNumber,
      );

      if (duplicateHallNumber) {
        setError("hallNumber", {
          type: "manual",
          message: "Hall number already exists. Duplicate hall numbers are not allowed.",
        });
        return;
      }

      const nextRow: HallConfigurationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) + 1,
        hallName: values.hallName,
        hallNumber: values.hallNumber,
        capacity: values.capacity,
        hallType: values.hallType as HallConfigurationRow["hallType"],
        buildingName: values.buildingName,
        floorNumber: values.floorNumber,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/hall-configuration/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/hall-configuration");
    } catch {
      setServerError("Unable to save the hall configuration. Please try again.");
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
    hallType,
    setHallType,
    hallTypeOptions,
  };
};
