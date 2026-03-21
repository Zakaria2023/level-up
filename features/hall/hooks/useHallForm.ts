"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HALL_TYPE_OPTIONS } from "../constants";
import { useHallStore } from "../store/useHallStore";
import type { HallRow } from "../types";
import {
  createHallSchema,
  type HallFormValues,
} from "../validation/HallSchema";

type UseHallFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (row?: HallRow): HallFormValues => ({
  hallName: row?.hallName ?? "",
  hallNumber: row?.hallNumber ?? "",
  capacity: row?.capacity ?? 30,
  hallType: row?.hallType ?? "Classroom",
  buildingName: row?.buildingName ?? "",
  floorNumber: row?.floorNumber ?? 0,
});

export const useHallForm = ({
  mode = "create",
  rowId,
}: UseHallFormOptions = {}) => {
  const { t } = useTranslation();

  const router = useRouter();
  const rows = useHallStore((state) => state.rows);
  const addRow = useHallStore((state) => state.addRow);
  const updateRow = useHallStore((state) => state.updateRow);
  const existingRow = useHallStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const HallSchema = createHallSchema(t);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<HallFormValues>({
    resolver: zodResolver(HallSchema),
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
    setValue("hallType", value as HallFormValues["hallType"], {
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

  const onSubmit = async (values: HallFormValues) => {
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
          message:
            "Hall number already exists. Duplicate hall numbers are not allowed.",
        });
        return;
      }

      const nextRow: HallRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        hallName: values.hallName,
        hallNumber: values.hallNumber,
        capacity: values.capacity,
        hallType: values.hallType as HallRow["hallType"],
        buildingName: values.buildingName,
        floorNumber: values.floorNumber,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/hall/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/hall");
    } catch {
      setServerError("Unable to save the hall. Please try again.");
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
    t,
  };
};
