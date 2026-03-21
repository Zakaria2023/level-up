"use client";

import { logoutAction } from "@/lib/cookies/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  label: string;
};

const settingsLinks: NavItem[] = [
  { href: "/settings/basic-information", label: "Basic Information" },
  { href: "/settings/contact-information", label: "Contact Information" },
  { href: "/settings/study-period-settings", label: "Study Period Settings" },
];

const homeLink: NavItem = {
  href: "/",
  label: "Home",
};

const academicYearConfigurationLink: NavItem = {
  href: "/academic-year",
  label: "Academic Year",
};

const semesterConfigurationLink: NavItem = {
  href: "/semester",
  label: "Semester",
};

const academicYearStructureLink: NavItem = {
  href: "/academic-year-structure",
  label: "Academic Year Structure",
};

const educationalStageConfigurationLink: NavItem = {
  href: "/educational-stage-configuration",
  label: "Educational Stage Configuration",
};

const schoolClassConfigurationLink: NavItem = {
  href: "/school-class-configuration",
  label: "School Class Configuration",
};

const schoolSectionConfigurationLink: NavItem = {
  href: "/school-section-configuration",
  label: "School Section Configuration",
};

const subjectConfigurationLink: NavItem = {
  href: "/subject-configuration",
  label: "Subject Configuration",
};

const hallConfigurationLink: NavItem = {
  href: "/hall-configuration",
  label: "Hall Configuration",
};

const isRouteActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
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
}) => (
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
      <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-[#b9f1f6]" />
    ) : null}
    <span>{label}</span>
  </Link>
);

export const Sidebar = ({ onNavigate }: Props) => {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const homeActive = currentPath === "/";
  const academicYearConfigurationActive = isRouteActive(
    currentPath,
    academicYearConfigurationLink.href
  );
  const semesterConfigurationActive = isRouteActive(
    currentPath,
    semesterConfigurationLink.href
  );
  const academicYearStructureActive = isRouteActive(
    currentPath,
    academicYearStructureLink.href
  );
  const educationalStageConfigurationActive = isRouteActive(
    currentPath,
    educationalStageConfigurationLink.href
  );
  const schoolClassConfigurationActive = isRouteActive(
    currentPath,
    schoolClassConfigurationLink.href
  );
  const schoolSectionConfigurationActive = isRouteActive(
    currentPath,
    schoolSectionConfigurationLink.href
  );
  const subjectConfigurationActive = isRouteActive(
    currentPath,
    subjectConfigurationLink.href
  );
  const hallConfigurationActive = isRouteActive(
    currentPath,
    hallConfigurationLink.href
  );
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
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              homeActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span className={homeActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}>
              <FiHome size={16} />
            </span>
            <span>{homeLink.label}</span>
          </Link>

          <Link
            href={academicYearConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              academicYearConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                academicYearConfigurationActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiCalendar size={16} />
            </span>
            <span>{academicYearConfigurationLink.label}</span>
          </Link>

          <Link
            href={semesterConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              semesterConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                semesterConfigurationActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiBookOpen size={16} />
            </span>
            <span>{semesterConfigurationLink.label}</span>
          </Link>

          <Link
            href={academicYearStructureLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
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
            <span>{academicYearStructureLink.label}</span>
          </Link>

          <Link
            href={educationalStageConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              educationalStageConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                educationalStageConfigurationActive
                  ? "text-[#c9f8fc]"
                  : "text-[#8fdee7]"
              }
            >
              <FiLayers size={16} />
            </span>
            <span>{educationalStageConfigurationLink.label}</span>
          </Link>

          <Link
            href={schoolClassConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              schoolClassConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                schoolClassConfigurationActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiGrid size={16} />
            </span>
            <span>{schoolClassConfigurationLink.label}</span>
          </Link>

          <Link
            href={schoolSectionConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              schoolSectionConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                schoolSectionConfigurationActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiUsers size={16} />
            </span>
            <span>{schoolSectionConfigurationLink.label}</span>
          </Link>

          <Link
            href={subjectConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              subjectConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                subjectConfigurationActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiBook size={16} />
            </span>
            <span>{subjectConfigurationLink.label}</span>
          </Link>

          <Link
            href={hallConfigurationLink.href}
            onClick={onNavigate}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              hallConfigurationActive
                ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
            ].join(" ")}
          >
            <span
              className={
                hallConfigurationActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"
              }
            >
              <FiMapPin size={16} />
            </span>
            <span>{hallConfigurationLink.label}</span>
          </Link>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setSettingsOpen((current) => !current)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
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
              <span className="flex-1">Settings</span>
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
                    label={item.label}
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
          aria-label="Logout"
        >
          <FiLogOut size={17} />
          <span>Logout</span>
        </button>
      </form>
    </div>
  );
};
