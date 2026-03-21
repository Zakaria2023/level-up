import ar from "@/lang/ar.json";
import en from "@/lang/en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
