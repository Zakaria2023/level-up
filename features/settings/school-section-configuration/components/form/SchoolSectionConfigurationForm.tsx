"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useSchoolSectionConfigurationForm } from "../../hooks/useSchoolSectionConfigurationForm";

type SchoolSectionConfigurationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const SchoolSectionConfigurationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: SchoolSectionConfigurationFormProps = {}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    schoolClassId,
    setSchoolClassId,
    supervisorId,
    setSupervisorId,
    schoolClassOptions,
    supervisorOptions,
    hasSchoolClassOptions,
  } = useSchoolSectionConfigurationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? "Edit School Section Configuration"
      : "Add School Section Configuration");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected school section configuration record."
      : "Create a new school section configuration record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save Configuration");
  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/school-section-configuration/${rowId}`
      : "/school-section-configuration");
  const inputsDisabled = isSubmitting || !hasSchoolClassOptions;

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="School Section Configuration Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/school-section-configuration"
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
            label="Section Name"
            requiredMark
            inputType="text"
            placeholder="Section A"
            error={errors.sectionName?.message}
            disabled={inputsDisabled}
            {...register("sectionName")}
          />

          <div>
            <input type="hidden" {...register("schoolClassId")} />
            <Dropdown
              label="Parent School Class"
              value={schoolClassId || undefined}
              onChange={setSchoolClassId}
              options={schoolClassOptions}
              placeholder="Select school class"
              searchable
              searchPlaceholder="Search school class"
              error={errors.schoolClassId?.message}
              disabled={inputsDisabled}
            />
          </div>
        </div>

        {!hasSchoolClassOptions ? (
          <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] px-4 py-3 text-sm font-medium text-(--muted-text)">
            Add a school class configuration first so you can link a school section
            to it.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Default Capacity"
            requiredMark
            inputType="number"
            placeholder="30"
            min={1}
            max={100}
            error={errors.defaultCapacity?.message}
            disabled={inputsDisabled}
            {...register("defaultCapacity", { valueAsNumber: true })}
          />

          <div>
            <input type="hidden" {...register("supervisorId")} />
            <Dropdown
              label="Section Supervisor"
              value={supervisorId || undefined}
              onChange={setSupervisorId}
              options={supervisorOptions}
              placeholder="Select supervisor"
              searchable
              searchPlaceholder="Search supervisor"
              error={errors.supervisorId?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
          <p className="text-[16px] font-semibold text-[#0E6B7A]">Activation</p>
          <label className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
              {...register("isActive")}
            />
            Active Section
          </label>
          <p className="mt-3 text-sm leading-6 text-[#5D7B81]">
            This option allows you to register new students and add financial
            installments for students.
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
