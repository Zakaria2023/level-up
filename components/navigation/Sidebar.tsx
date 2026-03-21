"use client";

import { logoutAction } from "@/lib/cookies/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiChevronDown, FiHome, FiLogOut } from "react-icons/fi";
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
];

const homeLink: NavItem = {
  href: "/",
  label: "Home",
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
  const settingsActive = currentPath.startsWith("/settings");
  const [settingsOpen, setSettingsOpen] = useState(settingsActive);
  const isSettingsOpen = settingsOpen || settingsActive;

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

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setSettingsOpen((current) => !current)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                settingsActive
                  ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
                  : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
              ].join(" ")}
              aria-expanded={isSettingsOpen}
              aria-controls="settings-submenu"
            >
              <span className={settingsActive ? "text-[#c9f8fc]" : "text-[#8fdee7]"}>
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
