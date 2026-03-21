"use client";

import i18n from "@/lib/i18n/i18nextClient";
import { ReactNode, useEffect, useMemo } from "react";
import { I18nextProvider } from "react-i18next";

type I18nProviderProps = {
  children: ReactNode;
  initialLang: string;
};

const I18nProvider = ({ children, initialLang }: I18nProviderProps) => {
  const resolvedInitialLang = initialLang === "ar" ? "ar" : "en";
  const i18nInstance = useMemo(() => {
    const instance = i18n.cloneInstance({
      lng: resolvedInitialLang,
    });

    if (instance.language !== resolvedInitialLang) {
      void instance.changeLanguage(resolvedInitialLang);
    }

    return instance;
  }, [resolvedInitialLang]);

  useEffect(() => {
    document.documentElement.lang = resolvedInitialLang;
    document.documentElement.dir = resolvedInitialLang === "ar" ? "rtl" : "ltr";
  }, [resolvedInitialLang]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nProvider;
