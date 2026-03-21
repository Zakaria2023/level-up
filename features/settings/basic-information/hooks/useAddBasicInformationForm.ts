"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { readFileAsDataUrl } from "../helpers";
import { useBasicInformationStore } from "../store/useBasicInformationStore";
import type { BasicInformationRow } from "../types";
import {
  addBasicInformationSchema,
  type AddBasicInformationFormValues,
} from "../validation";

export const useAddBasicInformationForm = () => {
  const router = useRouter();
  const rows = useBasicInformationStore((state) => state.rows);
  const addRow = useBasicInformationStore((state) => state.addRow);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddBasicInformationFormValues>({
    resolver: zodResolver(addBasicInformationSchema),
    defaultValues: {
      schoolNameArabic: "",
      schoolNameEnglish: "",
      yearOfEstablishment: "",
      currency: "",
      timeZone: "",
      systemLanguage: "",
      commercialRegisterNumber: "",
      allowMultipleCurrencies: false,
      showLogoOnInvoices: false,
      notificationsEnabled: false,
    },
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

  const logoFileName = schoolLogoFiles?.item?.(0)?.name ?? "";
  const sealFileName = schoolSealFiles?.item?.(0)?.name ?? "";
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [sealPreviewUrl, setSealPreviewUrl] = useState("");
  const schoolLogoRegistration = register("schoolLogo", {
    onChange: async (event) => {
      const file = event.target.files?.[0];

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
    reset({
      schoolNameArabic: "",
      schoolNameEnglish: "",
      yearOfEstablishment: "",
      currency: "",
      timeZone: "",
      systemLanguage: "",
      commercialRegisterNumber: "",
      allowMultipleCurrencies: false,
      showLogoOnInvoices: false,
      notificationsEnabled: false,
      schoolLogo: undefined,
      schoolSeal: undefined,
    });
    setLogoPreviewUrl("");
    setSealPreviewUrl("");
  };

  const onSubmit = async (values: AddBasicInformationFormValues) => {
    try {
      setServerError(null);

      const schoolLogoFile = values.schoolLogo.item(0);
      const schoolSealFile = values.schoolSeal.item(0);

      if (!schoolLogoFile || !schoolSealFile) {
        setServerError("Please provide both the school logo and school seal.");
        return;
      }

      const schoolLogoPreviewUrl = await readFileAsDataUrl(schoolLogoFile);
      const schoolSealPreviewUrl = await readFileAsDataUrl(schoolSealFile);
      const nextId = rows.reduce(
        (highestId, row) => Math.max(highestId, row.id),
        0
      ) + 1;

      const newRow: BasicInformationRow = {
        id: nextId,
        schoolNameArabic: values.schoolNameArabic,
        schoolNameEnglish: values.schoolNameEnglish,
        yearOfEstablishment: values.yearOfEstablishment,
        currency: values.currency.toUpperCase(),
        commercialRegisterNumber: values.commercialRegisterNumber,
        systemLanguage: values.systemLanguage,
        allowMultipleCurrencies: values.allowMultipleCurrencies,
        showLogoOnInvoices: values.showLogoOnInvoices,
        schoolLogo: {
          name: schoolLogoFile.name,
          previewUrl: schoolLogoPreviewUrl,
        },
        schoolSeal: {
          name: schoolSealFile.name,
          previewUrl: schoolSealPreviewUrl,
        },
      };

      addRow(newRow);
      resetForm();
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
    logoPreviewUrl,
    sealPreviewUrl,
  };
};
