"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useHallConfigurationForm } from "../../hooks/useHallConfigurationForm";

type HallConfigurationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const HallConfigurationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: HallConfigurationFormProps = {}) => {
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
  } = useHallConfigurationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ?? (mode === "edit" ? "Edit Hall Configuration" : "Add Hall Configuration");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected hall configuration record."
      : "Create a new hall configuration record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save Configuration");
  const resolvedCancelHref =
    cancelHref ?? (mode === "edit" && rowId ? `/hall-configuration/${rowId}` : "/hall-configuration");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="Hall Configuration Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/hall-configuration"
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
            label="Hall Name"
            requiredMark
            inputType="text"
            placeholder="Science Lab A"
            error={errors.hallName?.message}
            disabled={isSubmitting}
            {...register("hallName")}
          />

          <Input
            label="Hall Number"
            requiredMark
            inputType="text"
            placeholder="LAB-101"
            error={errors.hallNumber?.message}
            disabled={isSubmitting}
            {...register("hallNumber")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Capacity"
            requiredMark
            inputType="number"
            placeholder="28"
            min={1}
            max={500}
            error={errors.capacity?.message}
            disabled={isSubmitting}
            {...register("capacity", { valueAsNumber: true })}
          />

          <div>
            <input type="hidden" {...register("hallType")} />
            <Dropdown
              label="Hall Type"
              value={hallType || undefined}
              onChange={setHallType}
              options={hallTypeOptions}
              placeholder="Select hall type"
              error={errors.hallType?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Building Name"
            requiredMark
            inputType="text"
            placeholder="Main Building"
            error={errors.buildingName?.message}
            disabled={isSubmitting}
            {...register("buildingName")}
          />

          <Input
            label="Floor Number"
            requiredMark
            inputType="number"
            placeholder="1"
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
