"use client";

import { z } from "zod";

const hasSelectedFile = (value: unknown) =>
  Boolean(
    value &&
    typeof value === "object" &&
    "length" in value &&
    typeof value.length === "number" &&
    value.length > 0,
  );

const hasImageFile = (value: unknown) => {
  if (!hasSelectedFile(value) || !("item" in (value as object))) {
    return false;
  }

  const file = (value as FileList).item(0);
  return Boolean(file && file.type.startsWith("image/"));
};

const hasOptionalImageFile = (value: unknown) =>
  !hasSelectedFile(value) || hasImageFile(value);

export const createBasicInformationSchema = (t: (key: string) => string) =>
  z.object({
    schoolNameArabic: z
      .string()
      .trim()
      .min(1, t("AddBasicInformationSchema.errors.schoolNameArabicRequired")),

    schoolNameEnglish: z
      .string()
      .trim()
      .min(1, t("AddBasicInformationSchema.errors.schoolNameEnglishRequired")),

    yearOfEstablishment: z
      .string()
      .trim()
      .min(1, t("AddBasicInformationSchema.errors.yearOfEstablishmentRequired"))
      .regex(
        /^\d{4}$/,
        t("AddBasicInformationSchema.errors.yearOfEstablishmentInvalid"),
      ),

    currency: z
      .string()
      .trim()
      .min(1, t("AddBasicInformationSchema.errors.currencyRequired")),

    timeZone: z
      .string()
      .trim()
      .min(1, t("AddBasicInformationSchema.errors.timeZoneRequired")),

    systemLanguage: z
      .string()
      .trim()
      .min(1, t("AddBasicInformationSchema.errors.systemLanguageRequired")),

    commercialRegisterNumber: z
      .string()
      .trim()
      .min(
        1,
        t("AddBasicInformationSchema.errors.commercialRegisterNumberRequired"),
      ),

    allowMultipleCurrencies: z.boolean(),

    showLogoOnInvoices: z.boolean(),

    notificationsEnabled: z.boolean(),

    schoolLogo: z
      .any()
      .optional()
      .refine(
        hasOptionalImageFile,
        t("AddBasicInformationSchema.errors.schoolLogoMustBeImage"),
      ),

    schoolSeal: z.any().optional(),
  });

export type BasicInformationFormValues = z.infer<
  ReturnType<typeof createBasicInformationSchema>
>;

export type BasicInformationInput = z.input<
  ReturnType<typeof createBasicInformationSchema>
>;
