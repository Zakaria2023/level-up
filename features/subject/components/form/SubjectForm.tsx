"use client";

import FormError from "@/components/feedback/FormError";
import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSubjectForm } from "../../hooks/useSubjectForm";

type SubjectFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

const resolveErrorMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = resolveErrorMessage(item);

      if (message) {
        return message;
      }
    }

    return undefined;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  if (record.root) {
    return resolveErrorMessage(record.root);
  }

  return undefined;
};

export const SubjectForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: SubjectFormProps = {}) => {
  const { t } = useTranslation();

  const {
    register,
    control,
    handleFormSubmit,
    errors,
    isSubmitting,
    serverError,
    resetForm,
    existingRow,
    subjectTypeOptions,
    teacherOptions,
    schoolClassOptions,
    hasSchoolClassOptions,
    classSettingFields,
    addClassSetting,
    removeClassSetting,
    gradeBreakdownFields,
    gradeBreakdownValues,
    addGradeBreakdown,
    removeGradeBreakdown,
  } = useSubjectForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("SubjectForm.editTitle")
      : t("SubjectForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("SubjectForm.editSubtitle")
      : t("SubjectForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ??
    (mode === "edit"
      ? t("SubjectForm.saveChanges")
      : t("SubjectForm.save"));

  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit"
      ? `/subject/${rowId}`
      : "/subject");

  const inputsDisabled = isSubmitting || !hasSchoolClassOptions;

  const gradeBreakdownTotal = gradeBreakdownValues.reduce(
    (total, item) => total + (item?.percentage ?? 0),
    0,
  );
  const isGradeBreakdownTotalValid =
    Math.abs(gradeBreakdownTotal - 100) <= 0.001;

  const gradeBreakdownError = resolveErrorMessage(errors.gradeBreakdown);
  const classSettingsError = resolveErrorMessage(errors.classSettings);

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("SubjectForm.notFoundTitle")}
        subtitle={t("SubjectForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/subject"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SubjectForm.backToTable")}
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
      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("SubjectForm.subjectName")}
            requiredMark
            inputType="text"
            placeholder={t("SubjectForm.subjectNamePlaceholder")}
            error={errors.subjectName?.message}
            disabled={isSubmitting}
            {...register("subjectName")}
          />

          <Controller
            control={control}
            name="subjectType"
            render={({ field }) => (
              <Dropdown
                label={t("SubjectForm.subjectType")}
                value={field.value || undefined}
                onChange={field.onChange}
                options={subjectTypeOptions}
                placeholder={t("SubjectForm.selectSubjectType")}
                error={errors.subjectType?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="teacherIds"
          render={({ field }) => (
            <MultiSelectDropdown
              label={t("SubjectForm.teachers")}
              values={field.value ?? []}
              onChange={field.onChange}
              options={teacherOptions}
              placeholder={t("SubjectForm.selectTeachers")}
              searchable
              searchPlaceholder={t("SubjectForm.searchTeachers")}
              error={errors.teacherIds?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <div className="rounded-3xl border border-(--border-color) bg-[#F8FDFF] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0D3B52]">
                {t("SubjectForm.schoolClassSettings")}
              </h3>
              <p className="text-sm text-[#97A6B6]">
                {t("SubjectForm.schoolClassSettingsDescription")}
              </p>
            </div>

            <button
              type="button"
              onClick={addClassSetting}
              disabled={inputsDisabled}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t("SubjectForm.addClassSetting")}
            </button>
          </div>

          {!hasSchoolClassOptions ? (
            <div className="rounded-[20px] border border-(--border-color) bg-white px-4 py-3 text-sm font-medium text-(--muted-text)">
              {t("SubjectForm.noSchoolClassMessage")}
            </div>
          ) : null}

          <div className="space-y-4">
            {classSettingFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-[20px] border border-(--border-color) bg-white p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[#0D3B52]">
                    {t("SubjectForm.classSettingTitle", { index: index + 1 })}
                  </h4>
                  {classSettingFields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeClassSetting(index)}
                      disabled={isSubmitting}
                      className="text-sm font-semibold text-[#C25353] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {t("SubjectForm.remove")}
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Controller
                    control={control}
                    name={`classSettings.${index}.schoolClassId`}
                    render={({ field: fieldControl }) => (
                      <Dropdown
                        label={t("SubjectForm.schoolClass")}
                        value={fieldControl.value || undefined}
                        onChange={fieldControl.onChange}
                        options={schoolClassOptions}
                        placeholder={t("SubjectForm.selectSchoolClass")}
                        searchable
                        searchPlaceholder={t("SubjectForm.searchSchoolClass")}
                        error={errors.classSettings?.[index]?.schoolClassId?.message}
                        disabled={inputsDisabled}
                      />
                    )}
                  />

                  <Input
                    label={t("SubjectForm.weeklyPeriodsCount")}
                    requiredMark
                    inputType="number"
                    placeholder={t("SubjectForm.weeklyPeriodsCountPlaceholder")}
                    min={1}
                    max={20}
                    error={errors.classSettings?.[index]?.weeklyPeriodsCount?.message}
                    disabled={inputsDisabled}
                    {...register(`classSettings.${index}.weeklyPeriodsCount` as const, {
                      valueAsNumber: true,
                    })}
                  />

                  <Input
                    label={t("SubjectForm.periodDurationMinutes")}
                    requiredMark
                    inputType="number"
                    placeholder={t("SubjectForm.periodDurationMinutesPlaceholder")}
                    min={1}
                    max={180}
                    error={errors.classSettings?.[index]?.periodDurationMinutes?.message}
                    disabled={inputsDisabled}
                    {...register(`classSettings.${index}.periodDurationMinutes` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            ))}
          </div>

          <FormError>{classSettingsError}</FormError>
        </div>

        <div className="rounded-3xl border border-(--border-color) bg-[#F8FDFF] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0D3B52]">
                {t("SubjectForm.gradeBreakdown")}
              </h3>
              <p className="text-sm text-[#97A6B6]">
                {t("SubjectForm.gradeBreakdownDescription")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={[
                  "inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold",
                  isGradeBreakdownTotalValid
                    ? "bg-(--primary-soft) text-(--primary-strong)"
                    : "bg-red-500/10 text-red-500",
                ].join(" ")}
              >
                {t("SubjectForm.totalPercentage", { total: gradeBreakdownTotal })}
              </div>
              <button
                type="button"
                onClick={addGradeBreakdown}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {t("SubjectForm.addBreakdown")}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {gradeBreakdownFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-[20px] border border-(--border-color) bg-white p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[#0D3B52]">
                    {t("SubjectForm.activityTitle", { index: index + 1 })}
                  </h4>
                  {gradeBreakdownFields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeGradeBreakdown(index)}
                      disabled={isSubmitting}
                      className="text-sm font-semibold text-[#C25353] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {t("SubjectForm.remove")}
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={t("SubjectForm.activityName")}
                    requiredMark
                    inputType="text"
                    placeholder={t("SubjectForm.activityNamePlaceholder")}
                    error={errors.gradeBreakdown?.[index]?.activityName?.message}
                    disabled={isSubmitting}
                    {...register(`gradeBreakdown.${index}.activityName` as const)}
                  />

                  <Input
                    label={t("SubjectForm.percentage")}
                    requiredMark
                    inputType="number"
                    placeholder={t("SubjectForm.percentagePlaceholder")}
                    min={0}
                    max={100}
                    error={errors.gradeBreakdown?.[index]?.percentage?.message}
                    disabled={isSubmitting}
                    {...register(`gradeBreakdown.${index}.percentage` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            ))}
          </div>

          <FormError>{gradeBreakdownError}</FormError>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("SubjectForm.minimumPassingGrade")}
            requiredMark
            inputType="number"
            placeholder={t("SubjectForm.minimumPassingGradePlaceholder")}
            min={0}
            max={100}
            error={errors.minimumPassingGrade?.message}
            disabled={isSubmitting}
            {...register("minimumPassingGrade", { valueAsNumber: true })}
          />

          <Input
            label={t("SubjectForm.teachingLanguage")}
            requiredMark
            inputType="text"
            placeholder={t("SubjectForm.teachingLanguagePlaceholder")}
            error={errors.teachingLanguage?.message}
            disabled={isSubmitting}
            {...register("teachingLanguage")}
          />
        </div>

        <div>
          <p className="mb-3 text-[16px] font-semibold text-[#0E6B7A]">
            {t("SubjectForm.subjectToggles")}
          </p>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("countsTowardAverage")}
              />
              {t("SubjectForm.countsTowardAverage")}
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("requiresLab")}
              />
              {t("SubjectForm.requiresLab")}
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("hasQuestionBank")}
              />
              {t("SubjectForm.hasQuestionBank")}
            </label>
          </div>
        </div>

        {serverError ? <ServerError>{serverError}</ServerError> : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t("SubjectForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SubjectForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("SubjectForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};
