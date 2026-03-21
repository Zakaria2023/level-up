import { renderBooleanValue } from "@/lib/utils/helpers";
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

export const toDetailFields = (row: BasicInformationRow) => [
  {
    label: "School Name (Arabic)",
    value: row.schoolNameArabic,
  },
  {
    label: "School Name (English)",
    value: row.schoolNameEnglish,
  },
  {
    label: "Year of Establishment",
    value: row.yearOfEstablishment,
  },
  {
    label: "Currency",
    value: row.currency,
  },
  {
    label: "Time Zone",
    value: row.timeZone,
  },
  {
    label: "Commercial Register Number",
    value: row.commercialRegisterNumber,
  },
  {
    label: "System Language",
    value: row.systemLanguage,
  },
  {
    label: "Allow Multiple Currencies",
    value: renderBooleanValue(row.allowMultipleCurrencies),
  },
  {
    label: "Show Logo on Invoices",
    value: renderBooleanValue(row.showLogoOnInvoices),
  },
  {
    label: "Enable Notifications",
    value: renderBooleanValue(row.notificationsEnabled),
  },
];
