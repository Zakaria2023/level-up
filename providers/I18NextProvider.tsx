"use client";

import i18n from "@/lib/i18n/i18nextClient";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

const I18nContext = createContext<{ t: (key: string) => string } | null>(null);

type I18nProviderProps = {
  children: ReactNode;
  initialLang: string;
};

const I18nProvider = ({ children, initialLang }: I18nProviderProps) => {
  useEffect(() => {
    if (i18n.language !== initialLang) {
      void i18n.changeLanguage(initialLang);
    }
  }, [initialLang]);

  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = initialLang;
    document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
  }, [initialLang]);

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>
    </I18nextProvider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18nContext must be used within an I18nProvider");
  return context.t;
};

export default I18nProvider;
