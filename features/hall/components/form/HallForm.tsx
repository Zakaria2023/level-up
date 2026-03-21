"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useHallForm } from "../../hooks/useHallForm";

type HallFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const HallForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: HallFormProps = {}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    hallType,
    setHallType,
    hallTypeOptions,
    t,
  } = useHallForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ?? (mode === "edit" ? t("HallForm.editTitle") : t("HallForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("HallForm.editSubtitle")
      : t("HallForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? t("HallForm.saveChanges") : t("HallForm.save"));

  const resolvedCancelHref =
    cancelHref ?? (mode === "edit" && rowId ? `/hall/${rowId}` : "/hall");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("HallForm.notFoundTitle")}
        subtitle={t("HallForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/hall"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("HallForm.backToTable")}
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
            label={t("HallForm.hallName")}
            requiredMark
            inputType="text"
            placeholder={t("HallForm.hallNamePlaceholder")}
            error={errors.hallName?.message}
            disabled={isSubmitting}
            {...register("hallName")}
          />

          <Input
            label={t("HallForm.hallNumber")}
            requiredMark
            inputType="text"
            placeholder={t("HallForm.hallNumberPlaceholder")}
            error={errors.hallNumber?.message}
            disabled={isSubmitting}
            {...register("hallNumber")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("HallForm.capacity")}
            requiredMark
            inputType="number"
            placeholder={t("HallForm.capacityPlaceholder")}
            min={1}
            max={500}
            error={errors.capacity?.message}
            disabled={isSubmitting}
            {...register("capacity", { valueAsNumber: true })}
          />

          <div>
            <input type="hidden" {...register("hallType")} />
            <Dropdown
              label={t("HallForm.hallType")}
              value={hallType || undefined}
              onChange={setHallType}
              options={hallTypeOptions}
              placeholder={t("HallForm.selectHallType")}
              error={errors.hallType?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("HallForm.buildingName")}
            requiredMark
            inputType="text"
            placeholder={t("HallForm.buildingNamePlaceholder")}
            error={errors.buildingName?.message}
            disabled={isSubmitting}
            {...register("buildingName")}
          />

          <Input
            label={t("HallForm.floorNumber")}
            requiredMark
            inputType="number"
            placeholder={t("HallForm.floorNumberPlaceholder")}
            min={0}
            max={100}
            error={errors.floorNumber?.message}
            disabled={isSubmitting}
            {...register("floorNumber", { valueAsNumber: true })}
          />
        </div>

        {serverError ? <ServerError>{serverError}</ServerError> : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t("HallForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("HallForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("HallForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};