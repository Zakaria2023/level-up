"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useSemesterForm } from "../../hooks/useSemesterForm";

type SemesterFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const SemesterForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: SemesterFormProps = {}) => {
  const {
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
    evaluationTypeOptions,
    hasAcademicYearOptions,
    t,
  } = useSemesterForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("SemesterForm.editTitle")
      : t("SemesterForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("SemesterForm.editSubtitle")
      : t("SemesterForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ??
    (mode === "edit"
      ? t("SemesterForm.saveChanges")
      : t("SemesterForm.save"));

  const resolvedCancelHref =
    cancelHref ?? (mode === "edit" && rowId ? `/semester/${rowId}` : "/semester");

  const inputsDisabled = isSubmitting || !hasAcademicYearOptions;

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("SemesterForm.notFoundTitle")}
        subtitle={t("SemesterForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/semester"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SemesterForm.backToTable")}
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
            label={t("SemesterForm.semesterName")}
            requiredMark
            inputType="text"
            placeholder={t("SemesterForm.semesterNamePlaceholder")}
            error={errors.semesterName?.message}
            disabled={inputsDisabled}
            {...register("semesterName")}
          />

          <div>
            <input type="hidden" {...register("academicYearId")} />
            <Dropdown
              label={t("SemesterForm.academicYear")}
              value={academicYearId || undefined}
              onChange={setAcademicYearId}
              options={academicYearOptions}
              placeholder={t("SemesterForm.selectAcademicYear")}
              searchable
              searchPlaceholder={t("SemesterForm.searchAcademicYear")}
              error={errors.academicYearId?.message}
              disabled={inputsDisabled}
            />
          </div>
        </div>

        {!hasAcademicYearOptions ? (
          <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] px-4 py-3 text-sm font-medium text-(--muted-text)">
            {t("SemesterForm.noAcademicYearMessage")}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("SemesterForm.semesterStartDate")}
            requiredMark
            inputType="date"
            error={errors.semesterStartDate?.message}
            disabled={inputsDisabled}
            {...register("semesterStartDate")}
          />

          <Input
            label={t("SemesterForm.semesterEndDate")}
            requiredMark
            inputType="date"
            error={errors.semesterEndDate?.message}
            disabled={inputsDisabled}
            {...register("semesterEndDate")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("SemesterForm.actualLessonsStartDate")}
            requiredMark
            inputType="date"
            error={errors.actualLessonsStartDate?.message}
            disabled={inputsDisabled}
            {...register("actualLessonsStartDate")}
          />

          <Input
            label={t("SemesterForm.actualLessonsEndDate")}
            requiredMark
            inputType="date"
            error={errors.actualLessonsEndDate?.message}
            disabled={inputsDisabled}
            {...register("actualLessonsEndDate")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("SemesterForm.finalExamDate")}
            requiredMark
            inputType="date"
            error={errors.finalExamDate?.message}
            disabled={inputsDisabled}
            {...register("finalExamDate")}
          />

          <div>
            <input type="hidden" {...register("evaluationType")} />
            <Dropdown
              label={t("SemesterForm.evaluationType")}
              value={evaluationType || undefined}
              onChange={setEvaluationType}
              options={evaluationTypeOptions}
              placeholder={t("SemesterForm.selectEvaluationType")}
              error={errors.evaluationType?.message}
              disabled={inputsDisabled}
            />
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
            {t("SemesterForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SemesterForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={inputsDisabled}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("SemesterForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};