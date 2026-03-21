"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import Image from "next/image";
import Link from "next/link";
import { FiFileText } from "react-icons/fi";
import { useBasicInformationStore } from "../../store/useBasicInformationStore";
import type { BasicInformationAsset, BasicInformationRow } from "../../types";

type BasicInformationDetailsProps = {
  rowId: number;
};

const isImagePreviewUrl = (previewUrl?: string) =>
  Boolean(
    previewUrl &&
    (previewUrl.startsWith("data:image/") ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(previewUrl))
  );

const renderBooleanValue = (value: boolean) => (value ? "Enabled" : "Disabled");

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
    <p className="text-sm font-medium text-(--muted-text)">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-(--foreground)">{value}</p>
  </div>
);

const AssetPreview = ({
  title,
  asset,
}: {
  title: string;
  asset: BasicInformationAsset;
}) => (
  <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
    <p className="text-sm font-semibold text-[#0D3B52]">{title}</p>
    <div className="mt-4 flex min-h-32 items-center justify-center rounded-[18px] border border-dashed border-[#B8C9D8] bg-white px-4">
      {asset.previewUrl && isImagePreviewUrl(asset.previewUrl) ? (
        <div className="flex items-center gap-4">
          <Image
            src={asset.previewUrl}
            alt={asset.name}
            width={88}
            height={88}
            unoptimized
            className="object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-(--foreground)">
              {asset.name}
            </p>
            <p className="mt-1 text-xs text-(--muted-text)">Image file</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary-strong)">
            <FiFileText className="text-2xl" />
          </span>
          <p className="text-sm font-semibold text-(--foreground)">{asset.name}</p>
          {asset.previewUrl ? (
            <a
              href={asset.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-(--primary-strong) underline underline-offset-2"
            >
              Open preview
            </a>
          ) : (
            <p className="text-xs text-(--muted-text)">File uploaded</p>
          )}
        </div>
      )}
    </div>
  </div>
);

const toDetailFields = (row: BasicInformationRow) => [
  {
    label: "School Name (Arabic)",
    value: row.schoolNameArabic,
  },
  {
    label: "School Name (English)",
    value: row.schoolNameEnglish,
  },
  {
    label: "Year of Establishment",
    value: row.yearOfEstablishment,
  },
  {
    label: "Currency",
    value: row.currency,
  },
  {
    label: "Time Zone",
    value: row.timeZone,
  },
  {
    label: "Commercial Register Number",
    value: row.commercialRegisterNumber,
  },
  {
    label: "System Language",
    value: row.systemLanguage,
  },
  {
    label: "Allow Multiple Currencies",
    value: renderBooleanValue(row.allowMultipleCurrencies),
  },
  {
    label: "Show Logo on Invoices",
    value: renderBooleanValue(row.showLogoOnInvoices),
  },
  {
    label: "Enable Notifications",
    value: renderBooleanValue(row.notificationsEnabled),
  },
];

export const BasicInformationDetails = ({
  rowId,
}: BasicInformationDetailsProps) => {
  const row = useBasicInformationStore((state) =>
    state.rows.find((item) => item.id === rowId)
  );

  if (!row) {
    return (
      <DashboardCard
        title="Basic Information Not Found"
        subtitle="The requested record could not be found in the current session."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/basic-information"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Back to Table
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-260 space-y-6">
      <DashboardCard
        title={`Basic Information #${row.id}`}
        subtitle="Review the stored values for this basic-information record."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/settings/basic-information"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              Back
            </Link>
            <Link
              href={`/settings/basic-information/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              Edit
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toDetailFields(row).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetPreview title="School Logo" asset={row.schoolLogo} />
        <AssetPreview title="School Seal" asset={row.schoolSeal} />
      </div>
    </div>
  );
};

export default BasicInformationDetails;
