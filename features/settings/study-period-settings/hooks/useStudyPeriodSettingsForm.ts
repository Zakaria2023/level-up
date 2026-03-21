"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { calculateDurationInMinutes, createEmptyStudyPeriod } from "../helpers";
import { useStudyPeriodSettingsStore } from "../store/useStudyPeriodSettingsStore";
import type { StudyPeriodItem, StudyPeriodSettingsRow } from "../types";
import {
  createStudyPeriodSettingsSchema,
  StudyPeriodSettingsFormValues,
} from "../validation/StudyPeriodSettingsSchema";

type UseStudyPeriodSettingsFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const toFormPeriod = (period?: StudyPeriodItem) => ({
  periodName: period?.periodName ?? "",
  schoolDays: period?.schoolDays ?? [],
  startTime: period?.startTime ?? "",
  endTime: period?.endTime ?? "",
  hasBreakAfterPeriod: period?.hasBreakAfterPeriod ?? false,
  breakName: period?.breakName ?? "",
  breakStartTime: period?.breakStartTime ?? "",
  breakEndTime: period?.breakEndTime ?? "",
});

const getDefaultValues = (
  row?: StudyPeriodSettingsRow,
): StudyPeriodSettingsFormValues => ({
  periodsCount: row?.periodsCount ?? 1,
  attendanceTrackingEnabled: row?.attendanceTrackingEnabled ?? false,
  periods: row?.periods.length
    ? row.periods.map((period) => toFormPeriod(period))
    : [createEmptyStudyPeriod()],
});

export const useStudyPeriodSettingsForm = ({
  mode = "create",
  rowId,
}: UseStudyPeriodSettingsFormOptions = {}) => {
  const { t } = useTranslation();

  const router = useRouter();
  const rows = useStudyPeriodSettingsStore((state) => state.rows);
  const addRow = useStudyPeriodSettingsStore((state) => state.addRow);
  const updateRow = useStudyPeriodSettingsStore((state) => state.updateRow);
  const existingRow = useStudyPeriodSettingsStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const studyPeriodSettingsSchema = createStudyPeriodSettingsSchema(t);

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudyPeriodSettingsFormValues>({
    resolver: zodResolver(studyPeriodSettingsSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "periods",
  });

  const periodsCount = useWatch({
    control,
    name: "periodsCount",
  });
  const periodValues = useWatch({
    control,
    name: "periods",
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  useEffect(() => {
    if (!Number.isFinite(periodsCount) || periodsCount < 1) {
      return;
    }

    const currentPeriods = getValues("periods");

    if (currentPeriods.length === periodsCount) {
      return;
    }

    replace(
      Array.from({ length: periodsCount }, (_, index) => {
        const currentPeriod = currentPeriods[index];
        return currentPeriod ?? createEmptyStudyPeriod();
      }),
    );
  }, [getValues, periodsCount, replace]);

  const resetForm = () => {
    setServerError(null);
    reset(getDefaultValues(existingRow));
  };

  const setPeriodSchoolDays = (index: number, schoolDays: string[]) => {
    setValue(
      `periods.${index}.schoolDays`,
      schoolDays as StudyPeriodItem["schoolDays"],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const syncBreakAfterPeriod = (index: number, enabled: boolean) => {
    if (enabled) {
      return;
    }

    setValue(`periods.${index}.breakName`, "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`periods.${index}.breakStartTime`, "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`periods.${index}.breakEndTime`, "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const getPeriodDuration = (index: number) =>
    calculateDurationInMinutes(
      periodValues?.[index]?.startTime,
      periodValues?.[index]?.endTime,
    );

  const getBreakDuration = (index: number) =>
    calculateDurationInMinutes(
      periodValues?.[index]?.breakStartTime,
      periodValues?.[index]?.breakEndTime,
    );

  const onSubmit = async (values: StudyPeriodSettingsFormValues) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError(t("StudyPeriodSettingsForm.recordNotFoundError"));
        return;
      }

      const nextRow: StudyPeriodSettingsRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        periodsCount: values.periodsCount,
        attendanceTrackingEnabled: values.attendanceTrackingEnabled,
        periods: values.periods.map((period) => ({
          periodName: period.periodName,
          schoolDays: period.schoolDays,
          startTime: period.startTime,
          endTime: period.endTime,
          durationMinutes:
            calculateDurationInMinutes(period.startTime, period.endTime) ?? 0,
          hasBreakAfterPeriod: period.hasBreakAfterPeriod,
          breakName: period.hasBreakAfterPeriod ? period.breakName : "",
          breakStartTime: period.hasBreakAfterPeriod
            ? period.breakStartTime
            : "",
          breakEndTime: period.hasBreakAfterPeriod ? period.breakEndTime : "",
          breakDurationMinutes: period.hasBreakAfterPeriod
            ? calculateDurationInMinutes(
                period.breakStartTime,
                period.breakEndTime,
              )
            : null,
        })),
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/settings/study-period-settings/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/settings/study-period-settings");
    } catch {
      setServerError(t("StudyPeriodSettingsForm.saveError"));
    }
  };

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    periodFields: fields,
    periodValues: periodValues ?? [],
    setPeriodSchoolDays,
    syncBreakAfterPeriod,
    getPeriodDuration,
    getBreakDuration,
    t,
  };
};
