"use client";

import useCurrentLang from "@/hooks/useCurrentLang";
import { logoutAction } from "@/lib/cookies/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiChevronDown,
  FiGitBranch,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { SlSettings } from "react-icons/sl";

interface Props {
  onNavigate?: () => void;
}

type NavItem = {
  href: string;
  labelKey: string;
};

const settingsLinks: NavItem[] = [
  { href: "/settings/basic-information", labelKey: "Sidebar.basicInformation" },
  { href: "/settings/contact-information", labelKey: "Sidebar.contactInformation" },
  { href: "/settings/study-period-settings", labelKey: "Sidebar.studyPeriodSettings" },
];

const homeLink: NavItem = {
  href: "/",
  labelKey: "Sidebar.home",
};

const academicYearLink: NavItem = {
  href: "/academic-year",
  labelKey: "Sidebar.academicYear",
};

const semesterLink: NavItem = {
  href: "/semester",
  labelKey: "Sidebar.semester",
};

const academicYearStructureLink: NavItem = {
  href: "/academic-year-structure",
  labelKey: "Sidebar.academicYearStructure",
};

const educationalStageLink: NavItem = {
  href: "/educational-stage",
  labelKey: "Sidebar.educationalStage",
};

const schoolClassLink: NavItem = {
  href: "/school-class",
  labelKey: "Sidebar.schoolClass",
};

const schoolSectionLink: NavItem = {
  href: "/school-section",
  labelKey: "Sidebar.schoolSection",
};

const subjectLink: NavItem = {
  href: "/subject",
  labelKey: "Sidebar.subject",
};

const hallLink: NavItem = {
  href: "/hall",
  labelKey: "Sidebar.hall",
};

const normalizeRoute = (value: string) =>
  value !== "/" && value.endsWith("/") ? value.slice(0, -1) : value;

const isRouteActive = (pathname: string, href: string) => {
  const normalizedPathname = normalizeRoute(pathname);
  const normalizedHref = normalizeRoute(href);

  if (normalizedHref === "/") {
    return normalizedPathname === "/";
  }

  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
};

const SidebarSubLink = ({
  label,
  href,
  active,
  onNavigate,
}: {
  label: string;
  href: string;
  active: boolean;
  onNavigate?: () => void;
}) => {
  const lang = useCurrentLang()

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "relative ml-4 flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
          : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
      ].join(" ")}
    >
      {active ? (
        <span className={`absolute bottom-2 ${lang === "ar" ? "right-0" : "left-0"} top-2 w-0.5 rounded-full bg-[#b9f1f6]`} />
      ) : null}
      <span>{label}</span>
    </Link>
  )
}

export const Sidebar = ({ onNavigate }: Props) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const lang = useCurrentLang();

  const currentPath = pathname ?? "/";
  const homeActive = currentPath === "/";
  const academicYearActive = isRouteActive(currentPath, academicYearLink.href);
  const semesterActive = isRouteActive(currentPath, semesterLink.href);
  const academicYearStructureActive = isRouteActive(
    currentPath,
    academicYearStructureLink.href
  );
  const educationalStageActive = isRouteActive(
    currentPath,
    educationalStageLink.href
  );
  const schoolClassActive = isRouteActive(currentPath, schoolClassLink.href);
  const schoolSectionActive = isRouteActive(currentPath, schoolSectionLink.href);
  const subjectActive = isRouteActive(currentPath, subjectLink.href);
  const hallActive = isRouteActive(currentPath, hallLink.href);
  const settingsSectionActive = settingsLinks.some((item) =>
    isRouteActive(currentPath, item.href)
  );
  const [settingsOpen, setSettingsOpen] = useState(settingsSectionActive);
  const isSettingsOpen = settingsSectionActive || settingsOpen;

  return (
    <div className="flex h-full flex-col bg-(--sidebar-bg) text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">
            <span className="text-[#f8f9fc]">Level</span>
            <span className="text-(--primary)">Up</span>
          </h2>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <div className="space-y-1.5">
          <Link
            href={homeLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              homeActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span className={homeActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}>
              <FiHome size={16} />
            </span>
            <span>{t(homeLink.labelKey)}</span>
          </Link>

          <Link
            href={academicYearLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              academicYearActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                academicYearActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiCalendar size={16} />
            </span>
            <span>{t(academicYearLink.labelKey)}</span>
          </Link>

          <Link
            href={semesterLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              semesterActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={semesterActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}
            >
              <FiBookOpen size={16} />
            </span>
            <span>{t(semesterLink.labelKey)}</span>
          </Link>

          <Link
            href={academicYearStructureLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              academicYearStructureActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                academicYearStructureActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiGitBranch size={16} />
            </span>
            <span>{t(academicYearStructureLink.labelKey)}</span>
          </Link>

          <Link
            href={educationalStageLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              educationalStageActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                educationalStageActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiLayers size={16} />
            </span>
            <span>{t(educationalStageLink.labelKey)}</span>
          </Link>

          <Link
            href={schoolClassLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              schoolClassActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                schoolClassActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiGrid size={16} />
            </span>
            <span>{t(schoolClassLink.labelKey)}</span>
          </Link>

          <Link
            href={schoolSectionLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              schoolSectionActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                schoolSectionActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiUsers size={16} />
            </span>
            <span>{t(schoolSectionLink.labelKey)}</span>
          </Link>

          <Link
            href={subjectLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              subjectActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={subjectActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}
            >
              <FiBook size={16} />
            </span>
            <span>{t(subjectLink.labelKey)}</span>
          </Link>

          <Link
            href={hallLink.href}
            onClick={onNavigate}
            className={[
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
              hallActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span className={hallActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}>
              <FiMapPin size={16} />
            </span>
            <span>{t(hallLink.labelKey)}</span>
          </Link>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setSettingsOpen((current) => !current)}
              className={[
                `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${lang === "ar" ? "text-right" : "text-left"} text-sm font-medium transition`,
                settingsSectionActive
                  ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                  : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
              ].join(" ")}
              aria-expanded={isSettingsOpen}
              aria-controls="settings-submenu"
            >
              <span
                className={settingsSectionActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}
              >
                <SlSettings size={16} />
              </span>
              <span className="flex-1">{t("Sidebar.settings")}</span>
              <FiChevronDown
                size={16}
                className={[
                  "transition-transform duration-200",
                  isSettingsOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {isSettingsOpen ? (
              <div id="settings-submenu" className="space-y-1.5">
                {settingsLinks.map((item) => (
                  <SidebarSubLink
                    key={item.href}
                    href={item.href}
                    label={t(item.labelKey)}
                    active={isRouteActive(currentPath, item.href)}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      <form action={logoutAction} className="border-t border-white/10 p-4">
        <button
          type="submit"
          onClick={onNavigate}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#d3f4f7] transition hover:bg-[#136f7b] hover:text-white"
          aria-label={t("Sidebar.logout")}
        >
          <FiLogOut size={17} />
          <span>{t("Sidebar.logout")}</span>
        </button>
      </form>
    </div>
  );
};