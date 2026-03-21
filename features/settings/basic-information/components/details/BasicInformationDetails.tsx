"use client";

import { AssetPreview } from "@/components/ui/AssetPreview";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import useCurrentLang from "@/hooks/useCurrentLang";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toDetailFields } from "../../constants";
import { useBasicInformationStore } from "../../store/useBasicInformationStore";

type BasicInformationDetailsProps = {
  rowId: number;
};

export const BasicInformationDetails = ({
  rowId,
}: BasicInformationDetailsProps) => {
  const { t } = useTranslation();
  const lang = useCurrentLang();

  const row = useBasicInformationStore((state) =>
    state.rows.find((item) => item.id === rowId)
  );

  if (!row) {
    return (
      <DashboardCard
        title={t("BasicInformationDetails.notFoundTitle")}
        subtitle={t("BasicInformationDetails.notFoundSubtitle")}
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/basic-information"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            {t("BasicInformationDetails.backToTable")}
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-260 space-y-6">
      <DashboardCard
        title={t("BasicInformationDetails.title", { id: row.id })}
        subtitle={t("BasicInformationDetails.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/settings/basic-information"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              {t("BasicInformationDetails.back")}
            </Link>
            <Link
              href={`/settings/basic-information/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              {t("BasicInformationDetails.edit")}
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toDetailFields(row, t, lang).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetPreview
          title={t("BasicInformationDetails.schoolLogo")}
          asset={row.schoolLogo}
        />
        <AssetPreview
          title={t("BasicInformationDetails.schoolSeal")}
          asset={row.schoolSeal}
        />
      </div>
    </div>
  );
};

export default BasicInformationDetails;