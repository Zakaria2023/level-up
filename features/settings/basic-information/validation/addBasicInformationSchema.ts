import { z } from "zod";

const hasSelectedFile = (value: unknown) =>
  Boolean(
    value &&
      typeof value === "object" &&
      "length" in value &&
      typeof value.length === "number" &&
      value.length > 0
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

export const addBasicInformationSchema = z.object({
  schoolNameArabic: z
    .string()
    .trim()
    .min(1, "Arabic school name is required."),
  schoolNameEnglish: z
    .string()
    .trim()
    .min(1, "English school name is required."),
  yearOfEstablishment: z
    .string()
    .trim()
    .min(1, "Year of establishment is required.")
    .regex(/^\d{4}$/, "Year of establishment must be a 4-digit year."),
  currency: z.string().trim().min(1, "Currency is required."),
  timeZone: z.string().trim().min(1, "Time zone is required."),
  systemLanguage: z.string().trim().min(1, "System language is required."),
  commercialRegisterNumber: z
    .string()
    .trim()
    .min(1, "Commercial register number is required."),
  allowMultipleCurrencies: z.boolean(),
  showLogoOnInvoices: z.boolean(),
  notificationsEnabled: z.boolean(),
  schoolLogo: z
    .any()
    .optional()
    .refine(hasOptionalImageFile, "School logo must be an image."),
  schoolSeal: z.any().optional(),
});

export type AddBasicInformationFormValues = z.infer<
  typeof addBasicInformationSchema
>;
