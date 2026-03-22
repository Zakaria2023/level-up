"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toDetailFields } from "../../constants";
import { useAcademicYearStore } from "../../store/useAcademicYearStore";

type AcademicYearDetailsProps = {
  rowId: number;
};

export const AcademicYearDetails = ({
  rowId,
}: AcademicYearDetailsProps) => {
  const { t } = useTranslation();

  const row = useAcademicYearStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );

  if (!row) {
    return (
      <DashboardCard
        title={t("AcademicYearDetails.notFoundTitle")}
        subtitle={t("AcademicYearDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/academic-year"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("AcademicYearDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-220 space-y-6">
      <DashboardCard
        title={t("AcademicYearDetails.title", { id: row.id })}
        subtitle={t("AcademicYearDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/academic-year"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("AcademicYearDetails.back")}
            </Link>
            <Link
              href={`/academic-year/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("AcademicYearDetails.edit")}
            </Link>
          </div>
        }
      >
        {/* Keep the detail page limited to the stored academic-year fields. */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toDetailFields(row, t).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default AcademicYearDetails;
