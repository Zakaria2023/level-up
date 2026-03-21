"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAcademicYearStore } from "../../../../academic-year/store/useAcademicYearStore";
import { toDetailFields } from "../../constants";
import { useSemesterStore } from "../../store/useSemesterStore";

type SemesterDetailsProps = {
  rowId: number;
};

export const SemesterDetails = ({
  rowId,
}: SemesterDetailsProps) => {
  const { t } = useTranslation();

  const row = useSemesterStore((state) =>
    state.rows.find((item) => item.id === rowId),
  );

  const academicYearName = useAcademicYearStore((state) =>
    row
      ? state.rows.find((item) => item.id === row.academicYearId)?.academicYearName
      : undefined,
  );

  if (!row) {
    return (
      <DashboardCard
        title={t("SemesterDetails.notFoundTitle")}
        subtitle={t("SemesterDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/semester"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("SemesterDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-220 space-y-6">
      <DashboardCard
        title={t("SemesterDetails.title", { id: row.id })}
        subtitle={t("SemesterDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/semester"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("SemesterDetails.back")}
            </Link>
            <Link
              href={`/semester/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("SemesterDetails.edit")}
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toDetailFields(row, t, academicYearName).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default SemesterDetails;