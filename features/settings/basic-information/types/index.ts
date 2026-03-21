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
  commercialRegisterNumber: string;
  systemLanguage: string;
  allowMultipleCurrencies: boolean;
  showLogoOnInvoices: boolean;
  schoolLogo: BasicInformationAsset;
  schoolSeal: BasicInformationAsset;
};
