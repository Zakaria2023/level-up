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
    t,
  } = useBasicInformationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("BasicInformationForm.editTitle")
      : t("BasicInformationForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("BasicInformationForm.editSubtitle")
      : t("BasicInformationForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ??
    (mode === "edit"
      ? t("BasicInformationForm.saveChanges")
      : t("BasicInformationForm.saveBasicInformation"));

  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/settings/basic-information/${rowId}`
      : "/settings/basic-information");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("BasicInformationForm.notFoundTitle")}
        subtitle={t("BasicInformationForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/basic-information"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("BasicInformationForm.backToTable")}
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
            label={t("BasicInformationForm.schoolNameArabic")}
            requiredMark
            inputType="text"
            placeholder={t("BasicInformationForm.schoolNameArabicPlaceholder")}
            error={errors.schoolNameArabic?.message}
            disabled={isSubmitting}
            {...register("schoolNameArabic")}
          />

          <Input
            label={t("BasicInformationForm.schoolNameEnglish")}
            requiredMark
            inputType="text"
            placeholder={t("BasicInformationForm.schoolNameEnglishPlaceholder")}
            error={errors.schoolNameEnglish?.message}
            disabled={isSubmitting}
            {...register("schoolNameEnglish")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("BasicInformationForm.yearOfEstablishment")}
            requiredMark
            inputType="number"
            placeholder={t("BasicInformationForm.yearOfEstablishmentPlaceholder")}
            error={errors.yearOfEstablishment?.message}
            disabled={isSubmitting}
            {...register("yearOfEstablishment")}
          />

          <Input
            label={t("BasicInformationForm.currency")}
            requiredMark
            inputType="text"
            placeholder={t("BasicInformationForm.currencyPlaceholder")}
            error={errors.currency?.message}
            disabled={isSubmitting}
            {...register("currency")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input type="hidden" {...register("timeZone")} />
          <Dropdown
            label={t("BasicInformationForm.timeZone")}
            value={timeZone || undefined}
            onChange={setTimeZone}
            options={TIME_ZONE_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            placeholder={t("BasicInformationForm.selectTimeZone")}
            searchable
            searchPlaceholder={t("BasicInformationForm.searchTimeZone")}
            error={errors.timeZone?.message}
            disabled={isSubmitting}
          />

          <div>
            <input type="hidden" {...register("systemLanguage")} />
            <Dropdown
              label={t("BasicInformationForm.systemLanguage")}
              value={systemLanguage || undefined}
              onChange={setSystemLanguage}
              options={SYSTEM_LANGUAGE_OPTIONS}
              placeholder={t("BasicInformationForm.selectSystemLanguage")}
              error={errors.systemLanguage?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("BasicInformationForm.commercialRegisterNumber")}
            requiredMark
            inputType="text"
            placeholder={t("BasicInformationForm.commercialRegisterNumberPlaceholder")}
            error={errors.commercialRegisterNumber?.message}
            disabled={isSubmitting}
            {...register("commercialRegisterNumber")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PreviewCard
            title={t("BasicInformationForm.logoPreview")}
            previewUrl={logoPreviewUrl}
            fileName={logoFileName}
            emptyText={t("BasicInformationForm.logoPreviewEmpty")}
          />

          <PreviewCard
            title={t("BasicInformationForm.schoolSealPreview")}
            previewUrl={sealPreviewUrl}
            fileName={sealFileName}
            emptyText={t("BasicInformationForm.schoolSealPreviewEmpty")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label={t("BasicInformationForm.schoolLogo")}
            accept="image/*"
            fileName={logoFileName}
            error={errors.schoolLogo?.message as string | undefined}
            disabled={isSubmitting}
            {...schoolLogoRegistration}
          />

          <FileField
            label={t("BasicInformationForm.schoolSeal")}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            fileName={sealFileName}
            error={errors.schoolSeal?.message as string | undefined}
            disabled={isSubmitting}
            {...schoolSealRegistration}
          />
        </div>

        <div>
          <p className="mb-3 text-[16px] font-semibold text-[#0E6B7A]">
            {t("BasicInformationForm.configurationToggles")}
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("allowMultipleCurrencies")}
              />
              {t("BasicInformationForm.allowMultipleCurrencies")}
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("showLogoOnInvoices")}
              />
              {t("BasicInformationForm.showLogoOnInvoices")}
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("notificationsEnabled")}
              />
              {t("BasicInformationForm.enableNotifications")}
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
            {t("BasicInformationForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("BasicInformationForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("BasicInformationForm.saving") : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};