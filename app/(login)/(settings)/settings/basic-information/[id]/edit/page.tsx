import { BasicInformationForm } from "@/features/settings/basic-information/components/form/BasicInformationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SettingBasicInformationEditPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const basicInformationId = Number(id);

  if (!Number.isFinite(basicInformationId) || basicInformationId <= 0) return notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <BasicInformationForm
        mode="edit"
        rowId={basicInformationId}
      />
    </div>
  )
}

export default SettingBasicInformationEditPage
