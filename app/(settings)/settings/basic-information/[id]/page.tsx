import { notFound } from "next/navigation";
import BasicInformationDetails from "@/features/settings/basic-information/components/details/BasicInformationDetails";

type Params = Promise<{ id: string }>;

const SettingBasicInformationDetailPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const basicInformationId = Number(id);

  if (!Number.isFinite(basicInformationId) || basicInformationId <= 0) return notFound();

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <BasicInformationDetails rowId={basicInformationId} />
    </div>
  )
}

export default SettingBasicInformationDetailPage
