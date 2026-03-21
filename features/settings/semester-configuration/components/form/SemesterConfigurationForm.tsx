"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useSemesterConfigurationForm } from "../../hooks/useSemesterConfigurationForm";

type SemesterConfigurationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const SemesterConfigurationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: SemesterConfigurationFormProps = {}) => {
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
  } = useSemesterConfigurationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit" ? "Edit Semester" : "Add Semester");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected semester record."
      : "Create a new semester record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save");
  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/semester/${rowId}`
      : "/semester");
  const inputsDisabled = isSubmitting || !hasAcademicYearOptions;

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="Semester Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/semester"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Back to Table
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
            label="Semester Name"
            requiredMark
            inputType="text"
            placeholder="First Semester"
            error={errors.semesterName?.message}
            disabled={inputsDisabled}
            {...register("semesterName")}
          />

          <div>
            <input type="hidden" {...register("academicYearId")} />
            <Dropdown
              label="Academic Year"
              value={academicYearId || undefined}
              onChange={setAcademicYearId}
              options={academicYearOptions}
              placeholder="Select academic year"
              searchable
              searchPlaceholder="Search academic year"
              error={errors.academicYearId?.message}
              disabled={inputsDisabled}
            />
          </div>
        </div>

        {!hasAcademicYearOptions ? (
          <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] px-4 py-3 text-sm font-medium text-(--muted-text)">
            Add an academic year first so you can link a semester to
            it.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Semester Start Date"
            requiredMark
            inputType="date"
            error={errors.semesterStartDate?.message}
            disabled={inputsDisabled}
            {...register("semesterStartDate")}
          />

          <Input
            label="Semester End Date"
            requiredMark
            inputType="date"
            error={errors.semesterEndDate?.message}
            disabled={inputsDisabled}
            {...register("semesterEndDate")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Actual Lessons Start Date"
            requiredMark
            inputType="date"
            error={errors.actualLessonsStartDate?.message}
            disabled={inputsDisabled}
            {...register("actualLessonsStartDate")}
          />

          <Input
            label="Actual Lessons End Date"
            requiredMark
            inputType="date"
            error={errors.actualLessonsEndDate?.message}
            disabled={inputsDisabled}
            {...register("actualLessonsEndDate")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Final Exam Date"
            requiredMark
            inputType="date"
            error={errors.finalExamDate?.message}
            disabled={inputsDisabled}
            {...register("finalExamDate")}
          />

          <div>
            <input type="hidden" {...register("evaluationType")} />
            <Dropdown
              label="Evaluation Type"
              value={evaluationType || undefined}
              onChange={setEvaluationType}
              options={evaluationTypeOptions}
              placeholder="Select evaluation type"
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
            Reset
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={inputsDisabled}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};
