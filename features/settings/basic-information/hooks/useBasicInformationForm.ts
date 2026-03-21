"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { readFileAsDataUrl } from "../helpers";
import { useBasicInformationStore } from "../store/useBasicInformationStore";
import type { BasicInformationRow } from "../types";
import {
  addBasicInformationSchema,
  type AddBasicInformationFormValues,
} from "../validation/addBasicInformationSchema";

type UseAddBasicInformationFormOptions = {
  mode?: "create" | "edit";
  rowId?: number;
};

const getDefaultValues = (
  row?: BasicInformationRow,
): AddBasicInformationFormValues => ({
  schoolNameArabic: row?.schoolNameArabic ?? "",
  schoolNameEnglish: row?.schoolNameEnglish ?? "",
  yearOfEstablishment: row?.yearOfEstablishment ?? "",
  currency: row?.currency ?? "",
  timeZone: row?.timeZone ?? "",
  systemLanguage: row?.systemLanguage ?? "",
  commercialRegisterNumber: row?.commercialRegisterNumber ?? "",
  allowMultipleCurrencies: row?.allowMultipleCurrencies ?? false,
  showLogoOnInvoices: row?.showLogoOnInvoices ?? false,
  notificationsEnabled: row?.notificationsEnabled ?? false,
  schoolLogo: undefined,
  schoolSeal: undefined,
});

export const useBasicInformationForm = ({
  mode = "create",
  rowId,
}: UseAddBasicInformationFormOptions = {}) => {
  const router = useRouter();
  const rows = useBasicInformationStore((state) => state.rows);
  const addRow = useBasicInformationStore((state) => state.addRow);
  const updateRow = useBasicInformationStore((state) => state.updateRow);
  const existingRow = useBasicInformationStore((state) =>
    mode === "edit" && rowId
      ? state.rows.find((row) => row.id === rowId)
      : undefined,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AddBasicInformationFormValues>({
    resolver: zodResolver(addBasicInformationSchema),
    defaultValues: getDefaultValues(existingRow),
  });

  const schoolLogoFiles = useWatch({
    control,
    name: "schoolLogo",
  });
  const schoolSealFiles = useWatch({
    control,
    name: "schoolSeal",
  });
  const timeZone = useWatch({
    control,
    name: "timeZone",
  });
  const systemLanguage = useWatch({
    control,
    name: "systemLanguage",
  });

  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [sealPreviewUrl, setSealPreviewUrl] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !existingRow) {
      return;
    }

    reset(getDefaultValues(existingRow));
  }, [existingRow, mode, reset]);

  const logoFileName =
    schoolLogoFiles?.item?.(0)?.name ?? existingRow?.schoolLogo.name ?? "";
  const sealFileName =
    schoolSealFiles?.item?.(0)?.name ?? existingRow?.schoolSeal.name ?? "";

  const schoolLogoRegistration = register("schoolLogo", {
    onChange: async (event) => {
      const file = event.target.files?.[0];

      clearErrors("schoolLogo");

      if (!file) {
        setLogoPreviewUrl("");
        return;
      }

      try {
        const previewUrl = await readFileAsDataUrl(file);
        setLogoPreviewUrl(previewUrl);
      } catch {
        setLogoPreviewUrl("");
      }
    },
  });
  const schoolSealRegistration = register("schoolSeal", {
    onChange: async (event) => {
      const file = event.target.files?.[0];

      clearErrors("schoolSeal");

      if (!file) {
        setSealPreviewUrl("");
        return;
      }

      try {
        const previewUrl = await readFileAsDataUrl(file);
        setSealPreviewUrl(previewUrl);
      } catch {
        setSealPreviewUrl("");
      }
    },
  });

  const setTimeZone = (value: string) => {
    setValue("timeZone", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setSystemLanguage = (value: string) => {
    setValue("systemLanguage", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetForm = () => {
    setServerError(null);
    clearErrors();
    reset(getDefaultValues(existingRow));
    setLogoPreviewUrl("");
    setSealPreviewUrl("");
  };

  const onSubmit = async (values: AddBasicInformationFormValues) => {
    try {
      setServerError(null);
      clearErrors();

      if (mode === "edit" && !existingRow) {
        setServerError("Unable to find this basic information record.");
        return;
      }

      const selectedLogoFile = values.schoolLogo?.item?.(0);
      const selectedSealFile = values.schoolSeal?.item?.(0);

      if (mode === "create" && !selectedLogoFile) {
        setError("schoolLogo", {
          type: "manual",
          message: "School logo is required.",
        });
        return;
      }

      if (mode === "create" && !selectedSealFile) {
        setError("schoolSeal", {
          type: "manual",
          message: "School seal file is required.",
        });
        return;
      }

      const schoolLogo = selectedLogoFile
        ? {
            name: selectedLogoFile.name,
            previewUrl: await readFileAsDataUrl(selectedLogoFile),
          }
        : existingRow?.schoolLogo;

      const schoolSeal = selectedSealFile
        ? {
            name: selectedSealFile.name,
            previewUrl: await readFileAsDataUrl(selectedSealFile),
          }
        : existingRow?.schoolSeal;

      if (!schoolLogo) {
        setError("schoolLogo", {
          type: "manual",
          message: "School logo is required.",
        });
        return;
      }

      if (!schoolSeal) {
        setError("schoolSeal", {
          type: "manual",
          message: "School seal file is required.",
        });
        return;
      }

      const nextRow: BasicInformationRow = {
        id:
          mode === "edit" && existingRow
            ? existingRow.id
            : rows.reduce((highestId, row) => Math.max(highestId, row.id), 0) +
              1,
        schoolNameArabic: values.schoolNameArabic,
        schoolNameEnglish: values.schoolNameEnglish,
        yearOfEstablishment: values.yearOfEstablishment,
        currency: values.currency.toUpperCase(),
        timeZone: values.timeZone,
        commercialRegisterNumber: values.commercialRegisterNumber,
        systemLanguage: values.systemLanguage,
        allowMultipleCurrencies: values.allowMultipleCurrencies,
        showLogoOnInvoices: values.showLogoOnInvoices,
        notificationsEnabled: values.notificationsEnabled,
        schoolLogo,
        schoolSeal,
      };

      if (mode === "edit") {
        updateRow(nextRow);
        router.push(`/settings/basic-information/${nextRow.id}`);
        return;
      }

      addRow(nextRow);
      reset(getDefaultValues());
      setLogoPreviewUrl("");
      setSealPreviewUrl("");
      router.push("/settings/basic-information");
    } catch {
      setServerError("Unable to save the basic information. Please try again.");
    }
  };

  return {
    register,
    schoolLogoRegistration,
    schoolSealRegistration,
    timeZone,
    setTimeZone,
    systemLanguage,
    setSystemLanguage,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    logoFileName,
    sealFileName,
    logoPreviewUrl: logoPreviewUrl || existingRow?.schoolLogo.previewUrl || "",
    sealPreviewUrl: sealPreviewUrl || existingRow?.schoolSeal.previewUrl || "",
    existingRow,
    mode,
  };
};
