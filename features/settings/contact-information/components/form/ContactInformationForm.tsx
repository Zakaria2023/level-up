"use client";

import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useContactInformationForm } from "../../hooks/useContactInformationForm";

type ContactInformationFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const ContactInformationForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: ContactInformationFormProps = {}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    t,
  } = useContactInformationForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ??
    (mode === "edit"
      ? t("ContactInformationForm.editTitle")
      : t("ContactInformationForm.createTitle"));

  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? t("ContactInformationForm.editSubtitle")
      : t("ContactInformationForm.createSubtitle"));

  const resolvedSubmitLabel =
    submitLabel ??
    (mode === "edit"
      ? t("ContactInformationForm.saveChanges")
      : t("ContactInformationForm.saveContactInformation"));

  const resolvedCancelHref =
    cancelHref ??
    (mode === "edit" && rowId
      ? `/settings/contact-information/${rowId}`
      : "/settings/contact-information");

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title={t("ContactInformationForm.notFoundTitle")}
        subtitle={t("ContactInformationForm.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/contact-information"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("ContactInformationForm.backToTable")}
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
            label={t("ContactInformationForm.country")}
            requiredMark
            inputType="text"
            placeholder={t("ContactInformationForm.countryPlaceholder")}
            error={errors.country?.message}
            disabled={isSubmitting}
            {...register("country")}
          />

          <Input
            label={t("ContactInformationForm.city")}
            requiredMark
            inputType="text"
            placeholder={t("ContactInformationForm.cityPlaceholder")}
            error={errors.city?.message}
            disabled={isSubmitting}
            {...register("city")}
          />
        </div>

        <Input
          label={t("ContactInformationForm.detailedAddress")}
          requiredMark
          as="textarea"
          inputType="text"
          placeholder={t("ContactInformationForm.detailedAddressPlaceholder")}
          error={errors.detailedAddress?.message}
          disabled={isSubmitting}
          {...register("detailedAddress")}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t("ContactInformationForm.primaryPhoneNumber")}
            requiredMark
            inputType="tel"
            placeholder={t("ContactInformationForm.primaryPhoneNumberPlaceholder")}
            error={errors.primaryPhoneNumber?.message}
            disabled={isSubmitting}
            {...register("primaryPhoneNumber")}
          />

          <Input
            label={t("ContactInformationForm.primaryEmail")}
            requiredMark
            inputType="email"
            placeholder={t("ContactInformationForm.primaryEmailPlaceholder")}
            error={errors.primaryEmail?.message}
            disabled={isSubmitting}
            {...register("primaryEmail")}
          />
        </div>

        <div className="space-y-4">
          <Input
            label={t("ContactInformationForm.website")}
            requiredMark
            inputType="text"
            placeholder={t("ContactInformationForm.websitePlaceholder")}
            error={errors.website?.message}
            disabled={isSubmitting}
            {...register("website")}
          />

          <Input
            label={t("ContactInformationForm.socialMediaLinks")}
            requiredMark
            as="textarea"
            inputType="text"
            placeholder={t("ContactInformationForm.socialMediaLinksPlaceholder")}
            error={errors.socialMediaLinks?.message}
            disabled={isSubmitting}
            rows={5}
            {...register("socialMediaLinks")}
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
            {t("ContactInformationForm.reset")}
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("ContactInformationForm.cancel")}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? t("ContactInformationForm.saving")
              : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};