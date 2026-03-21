"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "../navigation/Navbar";
import { Sidebar } from "../navigation/Sidebar";

const CHROMELESS_PATHS = ["/login"];

interface Props {
  children: ReactNode
  initialLang?: string
}

export default function DashboardShell({
  children,
  initialLang = "en",
}: Props) {
  const pathname = usePathname();

  const hideChrome = pathname
    ? CHROMELESS_PATHS.some((route) => pathname.startsWith(route))
    : false;

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-(--background) lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="hidden lg:block border-r border-(--sidebar-border) bg-(--sidebar-bg) lg:sticky lg:top-0 lg:h-screen">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-col lg:min-h-screen">
        <Navbar initialLang={initialLang} />
        <main className="flex-1 overflow-auto bg-(--background) p-4 text-(--foreground) md:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
