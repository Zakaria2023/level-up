import { TFunction } from "i18next";
import type { ContactInformationRow } from "../types";

export const CONTACT_INFORMATION_ROWS: ContactInformationRow[] = [
  {
    id: 1,
    country: "Syria",
    city: "Damascus",
    detailedAddress: "Al Mazzeh, West Villas, Building 12",
    primaryPhoneNumber: "+963 11 123 4567",
    primaryEmail: "info@levelup.edu",
    website: "https://levelup.edu",
    socialMediaLinks: "https://facebook.com/levelupschool",
  },
];

export const toDetailFields = (row: ContactInformationRow, t: TFunction) => [
  {
    label: t("ContactInformationDetails.fields.country"),
    value: row.country,
  },
  {
    label: t("ContactInformationDetails.fields.city"),
    value: row.city,
  },
  {
    label: t("ContactInformationDetails.fields.detailedAddress"),
    value: row.detailedAddress,
  },
  {
    label: t("ContactInformationDetails.fields.primaryPhoneNumber"),
    value: row.primaryPhoneNumber,
  },
  {
    label: t("ContactInformationDetails.fields.primaryEmail"),
    value: row.primaryEmail,
  },
  {
    label: t("ContactInformationDetails.fields.website"),
    value: row.website,
  },
  {
    label: t("ContactInformationDetails.fields.socialMediaLinks"),
    value: row.socialMediaLinks,
  },
];
