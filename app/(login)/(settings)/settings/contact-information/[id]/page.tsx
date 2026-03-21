import ContactInformationDetails from "@/features/settings/contact-information/components/details/ContactInformationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SettingContactInformationDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const contactInformationId = Number(id);

  if (!Number.isFinite(contactInformationId) || contactInformationId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <ContactInformationDetails rowId={contactInformationId} />
    </div>
  );
};

export default SettingContactInformationDetailPage;
