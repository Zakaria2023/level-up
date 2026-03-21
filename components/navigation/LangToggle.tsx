"use client";

import DropdownMenuContainer from "@/components/navigation/DropdownMenuContainer";
import useClickOutside from "@/hooks/useClickOutside";
import { useLangLoading } from "@/providers/LangLoadingProvider";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import Flag from "react-world-flags";

const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
type SupportedLang = (typeof SUPPORTED_LANGUAGES)[number];

const flagMap: Record<SupportedLang, string> = {
  en: "US",
  ar: "AE",
};

const normalizeLang = (value: string | null | undefined): SupportedLang => {
  if (!value) return "en";
  const normalized = value.toLowerCase() as SupportedLang;
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : "en";
};

type LangToggleProps = {
  initialLang?: string;
};

const LangToggle = ({ initialLang = "en" }: LangToggleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const { i18n } = useTranslation();
  const { setLangLoading } = useLangLoading();

  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLang>(() =>
    normalizeLang(initialLang)
  );

  const closeMenu = () => setIsOpen(false);
  useClickOutside(ref, closeMenu, isOpen);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const changeLanguage = (lang: SupportedLang) => {
    if (lang === currentLang) {
      setIsOpen(false);
      return;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);

    setLangLoading(true);
    setIsOpen(false);
    setCurrentLang(lang);

    timerRef.current = window.setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  useEffect(() => {
    i18n.changeLanguage(currentLang);

    if (typeof window !== "undefined") {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
      document.cookie = `lang=${currentLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
      window.localStorage.setItem("lang", currentLang);
    }
  }, [currentLang, i18n]);

  useEffect(() => {
    setCurrentLang(normalizeLang(initialLang));
  }, [initialLang]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div ref={ref} className="relative">

      <button
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center gap-2 rounded-lg border border-(--sidebar-border) bg-(--sidebar-panel) px-3 py-2 text-xs font-semibold uppercase text-[#f8f9fc] transition hover:border-(--primary) hover:text-white"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Choose language"
      >
        <Flag code={flagMap[currentLang]} className="h-4 w-6 rounded-sm" />
        <span>{currentLang}</span>
        <FaChevronDown className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContainer className="w-28">
            {SUPPORTED_LANGUAGES.map((item) => (
              <li
                key={item}
                role="menuitem"
                onClick={() => changeLanguage(item)}
                className={clsx(
                  "flex cursor-pointer items-center gap-2 px-4 py-2 transition-colors",
                  currentLang === item
                    ? "bg-(--surface-muted) text-(--foreground)"
                    : "text-(--muted-text) hover:bg-(--surface-muted)"
                )}
              >
                <Flag code={flagMap[item]} className="h-3 w-5 rounded-sm" />
                <span className="uppercase">{item}</span>
              </li>
            ))}
          </DropdownMenuContainer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LangToggle;
