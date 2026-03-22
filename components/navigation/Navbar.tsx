"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi";
import LangToggle from "./LangToggle";
import MobileSidebarDrawer from "./MobileSidebarDrawer";

const pageTitleKeyMap: Record<string, string> = {
  settings: "Navbar.pageTitles.settings",
  "settings/basic-information": "Navbar.pageTitles.basicInformation",
  "settings/contact-information": "Navbar.pageTitles.contactInformation",
  "settings/study-period-settings": "Navbar.pageTitles.studyPeriodSettings",
  "academic-year": "Navbar.pageTitles.academicYear",
  semester: "Navbar.pageTitles.semester",
  "academic-year-structure": "Navbar.pageTitles.academicYearStructure",
  "educational-stage": "Navbar.pageTitles.educationalStage",
  "school-class": "Navbar.pageTitles.schoolClass",
  "school-section": "Navbar.pageTitles.schoolSection",
  subject: "Navbar.pageTitles.subject",
  hall: "Navbar.pageTitles.hall",
};

const toTitleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const resolveTitle = (
  pathname: string | null,
  t: (key: string) => string,
) => {
  if (!pathname || pathname === "/") {
    return t("Navbar.pageTitles.dashboard");
  }

  const segments = pathname.split("/").filter(Boolean);
  const nestedPath = segments.slice(0, 2).join("/");
  const pageTitleKey =
    pageTitleKeyMap[nestedPath] ?? pageTitleKeyMap[segments[0] ?? ""];

  if (pageTitleKey) {
    return t(pageTitleKey);
  }

  return toTitleCase(segments.at(-1) ?? "");
};

type NavbarProps = {
  initialLang?: string;
};

export const Navbar = ({ initialLang = "en" }: NavbarProps) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const pageTitle = resolveTitle(pathname, t);

  return (
    <header className="sticky top-0 z-30 border-b border-(--sidebar-border) bg-(--sidebar-bg) px-3 py-3 shadow-[0_14px_30px_rgba(7,57,64,0.12)] sm:px-5 md:px-6">
      <div className="mx-auto flex items-center">
        <MobileSidebarDrawer>
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileSidebarDrawer.Trigger>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--sidebar-border) bg-(--sidebar-panel) text-[#effdff] transition hover:bg-[#136f7b] lg:hidden"
                  aria-label={t("Navbar.openNavigationMenu")}
                >
                  <FiMenu size={20} />
                </button>
              </MobileSidebarDrawer.Trigger>

              <h1 className="text-xl font-bold text-[#f8f9fc] md:text-[1.7rem]">
                {pageTitle}
              </h1>
            </div>

            <LangToggle initialLang={initialLang} />
          </div>

          <MobileSidebarDrawer.Content />
        </MobileSidebarDrawer>
      </div>
    </header>
  );
};
