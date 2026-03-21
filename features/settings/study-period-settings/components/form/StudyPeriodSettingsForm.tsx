"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Input from "@/components/ui/Input";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { STUDY_PERIOD_DAY_OPTIONS } from "../../constants";
import { formatDuration } from "../../helpers";
import { useStudyPeriodSettingsForm } from "../../hooks/useStudyPeriodSettingsForm";

type StudyPeriodSettingsFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const StudyPeriodSettingsForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: StudyPeriodSettingsFormProps = {}) => {
  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    periodFields,
    periodValues,
    setPeriodSchoolDays,
    syncBreakAfterPeriod,
    getPeriodDuration,
    getBreakDuration,
    t
  } = useStudyPeriodSettingsForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("StudyPeriodSettingsForm.editTitle")
      : t("StudyPeriodSettingsForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("StudyPeriodSettingsForm.editSubtitle")
      : t("StudyPeriodSettingsForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ??
    (mode === "edit"
      ? t("StudyPeriodSettingsForm.saveChanges")
      : t("StudyPeriodSettingsForm.saveSettings"));

  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/settings/study-period-settings/${rowId}`
      : "/settings/study-period-settings");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("StudyPeriodSettingsForm.notFoundTitle")}
        subtitle={t("StudyPeriodSettingsForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/study-period-settings"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("StudyPeriodSettingsForm.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title={resolvedTitle}
      subtitle={resolvedSubtitle}
      className="max-w-240"
      contentClassName="px-4 pb-4 pt-4 md:px-5"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("StudyPeriodSettingsForm.studyPeriodCount")}
            requiredMark
            inputType="number"
            placeholder={t("StudyPeriodSettingsForm.studyPeriodCountPlaceholder")}
            min={1}
            max={20}
            error={errors.periodsCount?.message}
            disabled={isSubmitting}
            {...register("periodsCount", { valueAsNumber: true })}
          />

          <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
            <p className="text-[16px] font-semibold text-[#0E6B7A]">
              {t("StudyPeriodSettingsForm.attendanceTracking")}
            </p>
            <label className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("attendanceTrackingEnabled")}
              />
              {t("StudyPeriodSettingsForm.enableAttendanceRecording")}
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {periodFields.map((field, index) => {
            const period = periodValues[index];
            const hasBreakAfterPeriod = period?.hasBreakAfterPeriod ?? false;

            return (
              <div
                key={field.id}
                className="rounded-3xl border border-(--border-color) bg-[#F8FDFF] p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#0D3B52]">
                      {t("StudyPeriodSettingsForm.periodTitle", { index: index + 1 })}
                    </h3>
                    <p className="text-sm text-[#97A6B6]">
                      {t("StudyPeriodSettingsForm.periodSubtitle")}
                    </p>
                  </div>

                  <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
                    {t("StudyPeriodSettingsForm.durationLabel")}{" "}
                    {formatDuration(getPeriodDuration(index))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={t("StudyPeriodSettingsForm.periodName")}
                    requiredMark
                    inputType="text"
                    placeholder={t("StudyPeriodSettingsForm.periodNamePlaceholder", {
                      index: index + 1,
                    })}
                    error={errors.periods?.[index]?.periodName?.message}
                    disabled={isSubmitting}
                    {...register(`periods.${index}.periodName` as const)}
                  />

                  <Controller
                    control={control}
                    name={`periods.${index}.schoolDays` as const}
                    render={({ field: fieldControl }) => (
                      <MultiSelectDropdown
                        label={t("StudyPeriodSettingsForm.schoolDays")}
                        values={fieldControl.value ?? []}
                        onChange={(values) => {
                          fieldControl.onChange(values);
                          setPeriodSchoolDays(index, values);
                        }}
                        options={STUDY_PERIOD_DAY_OPTIONS}
                        placeholder={t("StudyPeriodSettingsForm.selectSchoolDays")}
                        searchable
                        searchPlaceholder={t("StudyPeriodSettingsForm.searchSchoolDays")}
                        error={errors.periods?.[index]?.schoolDays?.message as string | undefined}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input
                    label={t("StudyPeriodSettingsForm.startTime")}
                    requiredMark
                    inputType="time"
                    error={errors.periods?.[index]?.startTime?.message}
                    disabled={isSubmitting}
                    {...register(`periods.${index}.startTime` as const)}
                  />

                  <Input
                    label={t("StudyPeriodSettingsForm.endTime")}
                    requiredMark
                    inputType="time"
                    error={errors.periods?.[index]?.endTime?.message}
                    disabled={isSubmitting}
                    {...register(`periods.${index}.endTime` as const)}
                  />
                </div>

                <div className="mt-4 rounded-[18px] border border-(--border-color) bg-white p-4 text-sm text-(--muted-text)">
                  {t("StudyPeriodSettingsForm.automaticDuration")}{" "}
                  <span className="font-semibold text-(--foreground)">
                    {formatDuration(getPeriodDuration(index))}
                  </span>
                </div>

                <div className="mt-4">
                  <Controller
                    control={control}
                    name={`periods.${index}.hasBreakAfterPeriod` as const}
                    render={({ field: fieldControl }) => (
                      <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
                        <input
                          type="checkbox"
                          checked={fieldControl.value ?? false}
                          disabled={isSubmitting}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            fieldControl.onChange(checked);
                            syncBreakAfterPeriod(index, checked);
                          }}
                          className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                        />
                        {t("StudyPeriodSettingsForm.addBreakAfterPeriod")}
                      </label>
                    )}
                  />
                </div>

                {hasBreakAfterPeriod ? (
                  <div className="mt-4 space-y-4 rounded-[20px] border border-(--border-color) bg-white p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label={t("StudyPeriodSettingsForm.breakName")}
                        requiredMark
                        inputType="text"
                        placeholder={t("StudyPeriodSettingsForm.breakNamePlaceholder")}
                        error={errors.periods?.[index]?.breakName?.message}
                        disabled={isSubmitting}
                        {...register(`periods.${index}.breakName` as const)}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label={t("StudyPeriodSettingsForm.breakStartTime")}
                        requiredMark
                        inputType="time"
                        error={errors.periods?.[index]?.breakStartTime?.message}
                        disabled={isSubmitting}
                        {...register(`periods.${index}.breakStartTime` as const)}
                      />

                      <Input
                        label={t("StudyPeriodSettingsForm.breakEndTime")}
                        requiredMark
                        inputType="time"
                        error={errors.periods?.[index]?.breakEndTime?.message}
                        disabled={isSubmitting}
                        {...register(`periods.${index}.breakEndTime` as const)}
                      />
                    </div>

                    <div className="rounded-[18px] border border-(--border-color) bg-[#F8FDFF] p-4 text-sm text-(--muted-text)">
                      {t("StudyPeriodSettingsForm.automaticBreakDuration")}{" "}
                      <span className="font-semibold text-(--foreground)">
                        {formatDuration(getBreakDuration(index))}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {serverError ? <ServerError>{serverError}</ServerError> : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t("StudyPeriodSettingsForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("StudyPeriodSettingsForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("StudyPeriodSettingsForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};