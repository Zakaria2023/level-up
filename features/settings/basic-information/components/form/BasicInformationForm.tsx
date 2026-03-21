"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import { FileField } from "@/components/ui/FileField";
import Input from "@/components/ui/Input";
import { PreviewCard } from "@/components/ui/PreviewCard";
import Link from "next/link";
import { SYSTEM_LANGUAGE_OPTIONS, TIME_ZONE_OPTIONS } from "../../constants";
import { useBasicInformationForm } from "../../hooks/useBasicInformationForm";

type AddBasicInformationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const BasicInformationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: AddBasicInformationFormProps = {}) => {
  const {
    register,
    schoolLogoRegistration,
    schoolSealRegistration,
    timeZone,
    setTimeZone,
    systemLanguage,
    setSystemLanguage,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    logoFileName,
    sealFileName,
    logoPreviewUrl,
    sealPreviewUrl,
    existingRow,
  } = useBasicInformationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ?? (mode === "edit" ? "Edit Basic Information" : "Add Basic Information");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected basic-information record."
      : "Create a new basic-information record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save Basic Information");
  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/settings/basic-information/${rowId}`
      : "/settings/basic-information");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="Basic Information Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/basic-information"
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
            label="School Name (Arabic)"
            requiredMark
            inputType="text"
            placeholder="Level Up School AR"
            error={errors.schoolNameArabic?.message}
            disabled={isSubmitting}
            {...register("schoolNameArabic")}
          />

          <Input
            label="School Name (English)"
            requiredMark
            inputType="text"
            placeholder="Level Up School"
            error={errors.schoolNameEnglish?.message}
            disabled={isSubmitting}
            {...register("schoolNameEnglish")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Year of Establishment"
            requiredMark
            inputType="number"
            placeholder="2014"
            error={errors.yearOfEstablishment?.message}
            disabled={isSubmitting}
            {...register("yearOfEstablishment")}
          />

          <Input
            label="Currency"
            requiredMark
            inputType="text"
            placeholder="USD"
            error={errors.currency?.message}
            disabled={isSubmitting}
            {...register("currency")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input type="hidden" {...register("timeZone")} />
          <Dropdown
            label="Time Zone"
            value={timeZone || undefined}
            onChange={setTimeZone}
            options={TIME_ZONE_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            placeholder="Select time zone"
            searchable
            searchPlaceholder="Search time zone"
            error={errors.timeZone?.message}
            disabled={isSubmitting}
          />

          <div>
            <input type="hidden" {...register("systemLanguage")} />
            <Dropdown
              label="System Language"
              value={systemLanguage || undefined}
              onChange={setSystemLanguage}
              options={SYSTEM_LANGUAGE_OPTIONS}
              placeholder="Select system language"
              error={errors.systemLanguage?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Commercial Register Number"
            requiredMark
            inputType="text"
            placeholder="CR-20458-EDU"
            error={errors.commercialRegisterNumber?.message}
            disabled={isSubmitting}
            {...register("commercialRegisterNumber")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PreviewCard
            title="Logo Preview"
            previewUrl={logoPreviewUrl}
            fileName={logoFileName}
            emptyText="Select a school logo to preview it here."
          />

          <PreviewCard
            title="School Seal Preview"
            previewUrl={sealPreviewUrl}
            fileName={sealFileName}
            emptyText="Select a school seal to preview it here."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label="School Logo"
            accept="image/*"
            fileName={logoFileName}
            error={errors.schoolLogo?.message as string | undefined}
            disabled={isSubmitting}
            {...schoolLogoRegistration}
          />

          <FileField
            label="School Seal"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            fileName={sealFileName}
            error={errors.schoolSeal?.message as string | undefined}
            disabled={isSubmitting}
            {...schoolSealRegistration}
          />
        </div>

        <div>
          <p className="mb-3 text-[16px] font-semibold text-[#0E6B7A]">
            Configuration Toggles
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("allowMultipleCurrencies")}
              />
              Allow Multiple Currencies
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("showLogoOnInvoices")}
              />
              Show Logo On Invoices
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("notificationsEnabled")}
              />
              Enable Notifications
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
