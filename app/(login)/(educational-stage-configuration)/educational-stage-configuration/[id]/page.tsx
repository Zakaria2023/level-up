import EducationalStageConfigurationDetails from "@/features/settings/educational-stage-configuration/components/details/EducationalStageConfigurationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const EducationalStageConfigurationDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const educationalStageConfigurationId = Number(id);

  if (
    !Number.isFinite(educationalStageConfigurationId) ||
    educationalStageConfigurationId <= 0
  ) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <EducationalStageConfigurationDetails
        rowId={educationalStageConfigurationId}
      />
    </div>
  );
};

export default EducationalStageConfigurationDetailPage;
