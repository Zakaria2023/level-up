"use client";

import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import MobileSidebarDrawer from "./MobileSidebarDrawer";

const pageTitleMap: Record<string, string> = {
  settings: "Settings",
};

const toTitleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const resolveTitleKeyOrFallback = (pathname: string | null) => {
  if (!pathname || pathname === "/") {
    return "Dashboard";
  }

  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const pageTitle = pageTitleMap[segment];

  if (pageTitle) {
    return pageTitle;
  }

  return toTitleCase(segment);
};

export const Navbar = () => {
  const pathname = usePathname();
  const pageTitle = resolveTitleKeyOrFallback(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-(--sidebar-border) bg-(--sidebar-bg) px-3 py-3 shadow-[0_14px_30px_rgba(7,57,64,0.12)] sm:px-5 md:px-6">
      <div className="mx-auto flex items-center">
        <MobileSidebarDrawer>
          <div className="flex w-full items-center gap-3">
            <MobileSidebarDrawer.Trigger>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--sidebar-border) bg-(--sidebar-panel) text-[#effdff] transition hover:bg-[#136f7b] lg:hidden"
                aria-label="Open navigation menu"
              >
                <FiMenu size={20} />
              </button>
            </MobileSidebarDrawer.Trigger>

            <h1 className="text-xl font-bold text-[#f8f9fc] md:text-[1.7rem]">
              {pageTitle}
            </h1>
          </div>

          <MobileSidebarDrawer.Content />
        </MobileSidebarDrawer>
      </div>
    </header>
  );
};
