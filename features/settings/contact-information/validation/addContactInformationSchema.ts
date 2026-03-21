import { z } from "zod";

export const addContactInformationSchema = z.object({
  country: z.string().trim().min(1, "Country is required."),
  city: z.string().trim().min(1, "City is required."),
  detailedAddress: z.string().trim().min(1, "Detailed address is required."),
  primaryPhoneNumber: z
    .string()
    .trim()
    .min(1, "Primary phone number is required."),
  primaryEmail: z
    .string()
    .trim()
    .min(1, "Primary email is required.")
    .email("Please enter a valid email address."),
  website: z.string().trim().min(1, "Website is required."),
  socialMediaLinks: z
    .string()
    .trim()
    .min(1, "Social media links are required."),
});

export type AddContactInformationFormValues = z.infer<
  typeof addContactInformationSchema
>;
