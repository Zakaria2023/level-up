import EducationalStageDetails from "@/features/educational-stage/components/details/EducationalStageDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const EducationalStageDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const educationalStageId = Number(id);

  if (
    !Number.isFinite(educationalStageId) ||
    educationalStageId <= 0
  ) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <EducationalStageDetails
        rowId={educationalStageId}
      />
    </div>
  );
};

export default EducationalStageDetailPage;
