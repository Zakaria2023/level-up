"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { DetailField } from "@/components/ui/DetailField";
import Link from "next/link";
import { toDetailFields } from "../../constants";
import { useContactInformationStore } from "../../store/useContactInformationStore";

type ContactInformationDetailsProps = {
  rowId: number;
};

export const ContactInformationDetails = ({
  rowId,
}: ContactInformationDetailsProps) => {
  const row = useContactInformationStore((state) =>
    state.rows.find((item) => item.id === rowId)
  );

  if (!row) {
    return (
      <DashboardCard
        title="Contact Information Not Found"
        subtitle="The requested record could not be found in the current session."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/settings/contact-information"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Back to Table
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="w-full max-w-220 space-y-6">
      <DashboardCard
        title={`Contact Information #${row.id}`}
        subtitle="Review the stored values for this contact-information record."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/settings/contact-information"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F3F5F8] px-5 text-sm font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
            >
              Back
            </Link>
            <Link
              href={`/settings/contact-information/${row.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
            >
              Edit
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {toDetailFields(row).map((field) => (
            <DetailField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default ContactInformationDetails;
