import { renderBooleanValue } from "@/lib/utils/helpers";
import { TFunction } from "i18next";
import type { BasicInformationRow } from "../types";

const supportedTimeZones =
  typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : ["UTC"];

export const TIME_ZONE_OPTIONS = supportedTimeZones.map((timeZone) => ({
  label: timeZone.replaceAll("_", " "),
  value: timeZone,
}));

export const SYSTEM_LANGUAGE_OPTIONS = [
  {
    label: "English",
    value: "English",
  },
  {
    label: "Arabic",
    value: "Arabic",
  },
];

export const BASIC_INFORMATION_ROWS: BasicInformationRow[] = [
  {
    id: 1,
    schoolNameArabic: "Level Up School AR",
    schoolNameEnglish: "Level Up School",
    yearOfEstablishment: "2014",
    currency: "USD",
    timeZone: "Asia/Damascus",
    commercialRegisterNumber: "CR-20458-EDU",
    systemLanguage: "English",
    allowMultipleCurrencies: true,
    showLogoOnInvoices: true,
    notificationsEnabled: true,
    schoolLogo: {
      name: "level-up-logo.webp",
      previewUrl: "/logo.webp",
    },
    schoolSeal: {
      name: "school-seal.pdf",
    },
  },
];

export const toDetailFields = (
  row: BasicInformationRow,
  t: TFunction,
  lang: string,
) => [
  {
    label: t("BasicInformationDetails.fields.schoolName"),
    value: lang === "ar" ? row.schoolNameArabic : row.schoolNameEnglish,
  },
  {
    label: t("BasicInformationDetails.fields.yearOfEstablishment"),
    value: row.yearOfEstablishment,
  },
  {
    label: t("BasicInformationDetails.fields.currency"),
    value: row.currency,
  },
  {
    label: t("BasicInformationDetails.fields.timeZone"),
    value: row.timeZone,
  },
  {
    label: t("BasicInformationDetails.fields.commercialRegisterNumber"),
    value: row.commercialRegisterNumber,
  },
  {
    label: t("BasicInformationDetails.fields.systemLanguage"),
    value: row.systemLanguage,
  },
  {
    label: t("BasicInformationDetails.fields.allowMultipleCurrencies"),
    value: renderBooleanValue(row.allowMultipleCurrencies),
  },
  {
    label: t("BasicInformationDetails.fields.showLogoOnInvoices"),
    value: renderBooleanValue(row.showLogoOnInvoices),
  },
  {
    label: t("BasicInformationDetails.fields.enableNotifications"),
    value: renderBooleanValue(row.notificationsEnabled),
  },
];
