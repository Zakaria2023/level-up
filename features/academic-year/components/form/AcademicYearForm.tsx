"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Input from "@/components/ui/Input";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Link from "next/link";
import { ACADEMIC_YEAR_SEMESTER_OPTIONS } from "../../constants";
import { useAcademicYearForm } from "../../hooks/useAcademicYearForm";

type AcademicYearFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const AcademicYearForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: AcademicYearFormProps = {}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    semesters,
    setSemesters,
    t,
  } = useAcademicYearForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("AcademicYearForm.editTitle")
      : t("AcademicYearForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("AcademicYearForm.editSubtitle")
      : t("AcademicYearForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? t("AcademicYearForm.saveChanges") : t("AcademicYearForm.save"));

  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId ? `/academic-year/${rowId}` : "/academic-year");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("AcademicYearForm.notFoundTitle")}
        subtitle={t("AcademicYearForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/academic-year"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("AcademicYearForm.backToTable")}
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
            label={t("AcademicYearForm.academicYearName")}
            requiredMark
            inputType="text"
            placeholder={t("AcademicYearForm.academicYearNamePlaceholder")}
            error={errors.academicYearName?.message}
            disabled={isSubmitting}
            {...register("academicYearName")}
          />

          <div>
            <input type="hidden" {...register("semesters")} />
            <MultiSelectDropdown
              label={t("AcademicYearForm.semesters")}
              values={semesters}
              onChange={setSemesters}
              options={ACADEMIC_YEAR_SEMESTER_OPTIONS}
              placeholder={t("AcademicYearForm.selectSemesters")}
              searchable
              searchPlaceholder={t("AcademicYearForm.searchSemesters")}
              error={errors.semesters?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("AcademicYearForm.startDate")}
            requiredMark
            inputType="date"
            error={errors.startDate?.message}
            disabled={isSubmitting}
            {...register("startDate")}
          />

          <Input
            label={t("AcademicYearForm.endDate")}
            requiredMark
            inputType="date"
            error={errors.endDate?.message}
            disabled={isSubmitting}
            {...register("endDate")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("AcademicYearForm.registrationStartDate")}
            requiredMark
            inputType="date"
            error={errors.registrationStartDate?.message}
            disabled={isSubmitting}
            {...register("registrationStartDate")}
          />

          <Input
            label={t("AcademicYearForm.registrationEndDate")}
            requiredMark
            inputType="date"
            error={errors.registrationEndDate?.message}
            disabled={isSubmitting}
            {...register("registrationEndDate")}
          />
        </div>

        <div>
          <p className="mb-3 text-[16px] font-semibold text-[#0E6B7A]">
            {t("AcademicYearForm.toggles")}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("allowGradeEditingAfterEnd")}
              />
              {t("AcademicYearForm.allowGradeEditingAfterEnd")}
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("allowStudentFileEditingAfterEnd")}
              />
              {t("AcademicYearForm.allowStudentFileEditingAfterEnd")}
            </label>
          </div>
        </div>

        <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
          <p className="text-[16px] font-semibold text-[#0E6B7A]">
            {t("AcademicYearForm.active")}
          </p>
          <label className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
              {...register("isActive")}
            />
            {t("AcademicYearForm.activeAcademicYear")}
          </label>
          <p className="mt-3 text-sm leading-6 text-[#5D7B81]">
            {t("AcademicYearForm.activeDescription")}
          </p>
        </div>

        {serverError ? <ServerError>{serverError}</ServerError> : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t("AcademicYearForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("AcademicYearForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("AcademicYearForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};