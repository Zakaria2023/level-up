"use client";

import { logoutAction } from "@/lib/cookies/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiLogOut
} from "react-icons/fi";
import { SlSettings } from "react-icons/sl";

interface Props {
  onNavigate?: () => void;
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const mainLinks: NavItem[] = [
  { href: "/settings", label: "Settings", icon: <SlSettings size={16} /> },
];

const isRouteActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
};

const SidebarNavLink = ({
  label,
  item,
  active,
  onNavigate,
}: {
  label: string;
  item: Omit<NavItem, "label"> & { label?: never };
  active: boolean;
  onNavigate?: () => void;
}) => (
  <Link
    href={item.href}
    onClick={onNavigate}
    className={[
      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
      active
        ? "bg-[#157784] text-white shadow-[0_14px_28px_rgba(7,57,64,0.22)]"
        : "text-[#d3f4f7] hover:bg-[#136f7b] hover:text-white",
    ].join(" ")}
  >
    {active ? (
      <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-[#b9f1f6]" />
    ) : null}
    <span className={active ? "text-[#c9f8fc]" : "text-[#8fdee7]"}>{item.icon}</span>
    <span>{label}</span>
  </Link>
);

export const Sidebar = ({ onNavigate }: Props) => {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";

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
          {mainLinks.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={{ href: item.href, icon: item.icon }}
              label={item.label}
              active={isRouteActive(currentPath, item.href)}
              onNavigate={onNavigate}
            />
          ))}
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
