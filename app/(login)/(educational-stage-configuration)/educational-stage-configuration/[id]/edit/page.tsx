import { EducationalStageConfigurationForm } from "@/features/settings/educational-stage-configuration/components/form/EducationalStageConfigurationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const EducationalStageConfigurationEditPage = async ({
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <EducationalStageConfigurationForm
        mode="edit"
        rowId={educationalStageConfigurationId}
      />
    </div>
  );
};

export default EducationalStageConfigurationEditPage;
