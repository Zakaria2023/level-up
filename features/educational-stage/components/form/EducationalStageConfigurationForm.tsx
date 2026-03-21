"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useEducationalStageConfigurationForm } from "../../hooks/useEducationalStageConfigurationForm";

type EducationalStageConfigurationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const EducationalStageConfigurationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: EducationalStageConfigurationFormProps = {}) => {
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
    academicYearOptions,
    hasAcademicYearOptions,
  } = useEducationalStageConfigurationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? "Edit Educational Stage"
      : "Add Educational Stage");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected educational stage record."
      : "Create a new educational stage record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save");
  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/educational-stage/${rowId}`
      : "/educational-stage");
  const inputsDisabled = isSubmitting || !hasAcademicYearOptions;

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="Educational Stage Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/educational-stage"
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

          <Input
            label="Stage Name"
            requiredMark
            inputType="text"
            placeholder="Primary Stage"
            error={errors.stageName?.message}
            disabled={inputsDisabled}
            {...register("stageName")}
          />
        </div>

        {!hasAcademicYearOptions ? (
          <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] px-4 py-3 text-sm font-medium text-(--muted-text)">
            Add an academic year first so you can link an educational
            stage to it.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Required Enrollment Age"
            requiredMark
            inputType="number"
            placeholder="6"
            min={3}
            max={25}
            error={errors.requiredEnrollmentAge?.message}
            disabled={inputsDisabled}
            {...register("requiredEnrollmentAge", { valueAsNumber: true })}
          />

          <Input
            label="Teaching Language"
            requiredMark
            inputType="text"
            placeholder="English"
            error={errors.teachingLanguage?.message}
            disabled={inputsDisabled}
            {...register("teachingLanguage")}
          />
        </div>

        <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
          <p className="text-[16px] font-semibold text-[#0E6B7A]">Stage Type</p>
          <label className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
            <input
              type="checkbox"
              disabled={inputsDisabled}
              className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
              {...register("isMixedStage")}
            />
            Mixed Stage
          </label>
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
