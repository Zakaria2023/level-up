import { ContactInformationForm } from "@/features/settings/contact-information/components/form/ContactInformationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SettingContactInformationEditPage = async ({
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <ContactInformationForm
        mode="edit"
        rowId={contactInformationId}
      />
    </div>
  );
};

export default SettingContactInformationEditPage;
