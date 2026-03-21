export type BasicInformationAsset = {
  name: string;
  previewUrl?: string;
};

export type BasicInformationRow = {
  id: number;
  schoolNameArabic: string;
  schoolNameEnglish: string;
  yearOfEstablishment: string;
  currency: string;
  timeZone: string;
  commercialRegisterNumber: string;
  systemLanguage: string;
  allowMultipleCurrencies: boolean;
  showLogoOnInvoices: boolean;
  notificationsEnabled: boolean;
  schoolLogo: BasicInformationAsset;
  schoolSeal: BasicInformationAsset;
};
