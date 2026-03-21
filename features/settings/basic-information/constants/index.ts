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
    commercialRegisterNumber: "CR-20458-EDU",
    systemLanguage: "English",
    allowMultipleCurrencies: true,
    showLogoOnInvoices: true,
    schoolLogo: {
      name: "level-up-logo.webp",
      previewUrl: "/logo.webp",
    },
    schoolSeal: {
      name: "school-seal.pdf",
    },
  },
];
