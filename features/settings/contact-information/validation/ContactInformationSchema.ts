"use client";

import { z } from "zod";

export const createContactInformationSchema = (t: (key: string) => string) =>
  z.object({
    country: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.countryRequired")),

    city: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.cityRequired")),

    detailedAddress: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.detailedAddressRequired")),

    primaryPhoneNumber: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.primaryPhoneNumberRequired")),

    primaryEmail: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.primaryEmailRequired"))
      .email(t("ContactInformationSchema.errors.primaryEmailInvalid")),

    website: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.websiteRequired")),

    socialMediaLinks: z
      .string()
      .trim()
      .min(1, t("ContactInformationSchema.errors.socialMediaLinksRequired")),
  });

export type ContactInformationFormValues = z.infer<
  ReturnType<typeof createContactInformationSchema>
>;

export type ContactInformationInput = z.input<
  ReturnType<typeof createContactInformationSchema>
>;
