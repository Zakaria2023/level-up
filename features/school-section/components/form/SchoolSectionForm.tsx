"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useSchoolSectionForm } from "../../hooks/useSchoolSectionForm";

type SchoolSectionFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const SchoolSectionForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: SchoolSectionFormProps = {}) => {
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
    t,
  } = useSchoolSectionForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("SchoolSectionForm.editTitle")
      : t("SchoolSectionForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("SchoolSectionForm.editSubtitle")
      : t("SchoolSectionForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ??
    (mode === "edit"
      ? t("SchoolSectionForm.saveChanges")
      : t("SchoolSectionForm.save"));

  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/school-section/${rowId}`
      : "/school-section");

  const inputsDisabled = isSubmitting || !hasSchoolClassOptions;

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("SchoolSectionForm.notFoundTitle")}
        subtitle={t("SchoolSectionForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/school-section"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SchoolSectionForm.backToTable")}
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
            label={t("SchoolSectionForm.sectionName")}
            requiredMark
            inputType="text"
            placeholder={t("SchoolSectionForm.sectionNamePlaceholder")}
            error={errors.sectionName?.message}
            disabled={inputsDisabled}
            {...register("sectionName")}
          />

          <div>
            <input type="hidden" {...register("schoolClassId")} />
            <Dropdown
              label={t("SchoolSectionForm.parentSchoolClass")}
              value={schoolClassId || undefined}
              onChange={setSchoolClassId}
              options={schoolClassOptions}
              placeholder={t("SchoolSectionForm.selectSchoolClass")}
              searchable
              searchPlaceholder={t("SchoolSectionForm.searchSchoolClass")}
              error={errors.schoolClassId?.message}
              disabled={inputsDisabled}
            />
          </div>
        </div>

        {!hasSchoolClassOptions ? (
          <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] px-4 py-3 text-sm font-medium text-(--muted-text)">
            {t("SchoolSectionForm.noSchoolClassMessage")}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("SchoolSectionForm.defaultCapacity")}
            requiredMark
            inputType="number"
            placeholder={t("SchoolSectionForm.defaultCapacityPlaceholder")}
            min={1}
            max={100}
            error={errors.defaultCapacity?.message}
            disabled={inputsDisabled}
            {...register("defaultCapacity", { valueAsNumber: true })}
          />

          <div>
            <input type="hidden" {...register("supervisorId")} />
            <Dropdown
              label={t("SchoolSectionForm.sectionSupervisor")}
              value={supervisorId || undefined}
              onChange={setSupervisorId}
              options={supervisorOptions}
              placeholder={t("SchoolSectionForm.selectSupervisor")}
              searchable
              searchPlaceholder={t("SchoolSectionForm.searchSupervisor")}
              error={errors.supervisorId?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
          <p className="text-[16px] font-semibold text-[#0E6B7A]">
            {t("SchoolSectionForm.activation")}
          </p>
          <label className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
              {...register("isActive")}
            />
            {t("SchoolSectionForm.activeSection")}
          </label>
          <p className="mt-3 text-sm leading-6 text-[#5D7B81]">
            {t("SchoolSectionForm.activeDescription")}
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
            {t("SchoolSectionForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SchoolSectionForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={inputsDisabled}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("SchoolSectionForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};