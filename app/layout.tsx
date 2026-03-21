import DashboardShell from "@/components/layout/DashboardShell";
import I18nProvider from "@/providers/I18NextProvider";
import { LangLoadingProvider } from "@/providers/LangLoadingProvider";
import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Level Up Academy",
  description: "Level Up Academy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        style={{ fontFamily: "Cairo, sans-serif" }}
        className="min-h-full flex flex-col">
        <I18nProvider initialLang={lang}>
          <LangLoadingProvider>
            <main>
              <DashboardShell initialLang={lang}>
                {children}
              </DashboardShell>
            </main>
          </LangLoadingProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
