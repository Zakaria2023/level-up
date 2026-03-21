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

export const toDetailFields = (row: ContactInformationRow) => [
  {
    label: "Country",
    value: row.country,
  },
  {
    label: "City",
    value: row.city,
  },
  {
    label: "Detailed Address",
    value: row.detailedAddress,
  },
  {
    label: "Primary Phone Number",
    value: row.primaryPhoneNumber,
  },
  {
    label: "Primary Email",
    value: row.primaryEmail,
  },
  {
    label: "Website",
    value: row.website,
  },
  {
    label: "Social Media Links",
    value: row.socialMediaLinks,
  },
];
