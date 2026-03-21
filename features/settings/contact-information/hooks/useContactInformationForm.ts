"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useContactInformationStore } from "../store/useContactInformationStore";
import type { ContactInformationRow } from "../types";
import {
  ContactInformationFormValues,
  createContactInformationSchema,
} from "../validation/ContactInformationSchema";

type UseContactInformationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: ContactInformationRow,
): ContactInformationFormValues => ({
  country: row?.country ?? "",
  city: row?.city ?? "",
  detailedAddress: row?.detailedAddress ?? "",
  primaryPhoneNumber: row?.primaryPhoneNumber ?? "",
  primaryEmail: row?.primaryEmail ?? "",
  website: row?.website ?? "",
  socialMediaLinks: row?.socialMediaLinks ?? "",
});

export const useContactInformationForm = ({
  mode = "create",
  rowId,
}: UseContactInformationFormOptions = {}) => {
  const { t } = useTranslation();

  const router = useRouter();
  const rows = useContactInformationStore((state) => state.rows);
  const addRow = useContactInformationStore((state) => state.addRow);
  const updateRow = useContactInformationStore((state) => state.updateRow);
  const existingRow = useContactInformationStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const contactInformationSchema = createContactInformationSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInformationFormValues>({
    resolver: zodResolver(contactInformationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const resetForm = () => {
    setServerError(null);
    reset(getDefaultValues(existingRow));
  };

  const onSubmit = async (values: ContactInformationFormValues) => {
    try {
      setServerError(null);

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this contact information record.");
        return;
      }

      const nextRow: ContactInformationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        country: values.country,
        city: values.city,
        detailedAddress: values.detailedAddress,
        primaryPhoneNumber: values.primaryPhoneNumber,
        primaryEmail: values.primaryEmail,
        website: values.website,
        socialMediaLinks: values.socialMediaLinks,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/settings/contact-information/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      router.push("/settings/contact-information");
    } catch {
      setServerError(
        "Unable to save the contact information. Please try again.",
      );
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    mode,
    t,
  };
};
