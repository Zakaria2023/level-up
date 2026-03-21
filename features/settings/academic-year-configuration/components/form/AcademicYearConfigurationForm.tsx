"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { ACADEMIC_YEAR_SEMESTER_OPTIONS } from "../../constants";
import { useAcademicYearConfigurationForm } from "../../hooks/useAcademicYearConfigurationForm";

type AcademicYearConfigurationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const AcademicYearConfigurationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: AcademicYearConfigurationFormProps = {}) => {
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
  } = useAcademicYearConfigurationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? "Edit Academic Year Configuration"
      : "Add Academic Year Configuration");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected academic year configuration record."
      : "Create a new academic year configuration record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save Configuration");
  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/academic-year-configuration/${rowId}`
      : "/academic-year-configuration");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="Academic Year Configuration Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/academic-year-configuration"
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
            label="Academic Year Name"
            requiredMark
            inputType="text"
            placeholder="2025 / 2026"
            error={errors.academicYearName?.message}
            disabled={isSubmitting}
            {...register("academicYearName")}
          />

          <div>
            <input type="hidden" {...register("semesters")} />
            <MultiSelectDropdown
              label="Semesters"
              values={semesters}
              onChange={setSemesters}
              options={ACADEMIC_YEAR_SEMESTER_OPTIONS}
              placeholder="Select semesters"
              searchable
              searchPlaceholder="Search semesters"
              error={errors.semesters?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Start Date"
            requiredMark
            inputType="date"
            error={errors.startDate?.message}
            disabled={isSubmitting}
            {...register("startDate")}
          />

          <Input
            label="End Date"
            requiredMark
            inputType="date"
            error={errors.endDate?.message}
            disabled={isSubmitting}
            {...register("endDate")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Registration Start Date"
            requiredMark
            inputType="date"
            error={errors.registrationStartDate?.message}
            disabled={isSubmitting}
            {...register("registrationStartDate")}
          />

          <Input
            label="Registration End Date"
            requiredMark
            inputType="date"
            error={errors.registrationEndDate?.message}
            disabled={isSubmitting}
            {...register("registrationEndDate")}
          />
        </div>

        <div>
          <p className="mb-3 text-[16px] font-semibold text-[#0E6B7A]">
            Configuration Toggles
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("allowGradeEditingAfterEnd")}
              />
              Allow Grade Editing After End
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("allowStudentFileEditingAfterEnd")}
              />
              Allow Student File Editing After End
            </label>
          </div>
        </div>

        <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
          <p className="text-[16px] font-semibold text-[#0E6B7A]">Active</p>
          <label className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
              {...register("isActive")}
            />
            Active Academic Year
          </label>
          <p className="mt-3 text-sm leading-6 text-[#5D7B81]">
            This option allows you to register new students, create classes, and
            add financial installments for students.
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
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};
