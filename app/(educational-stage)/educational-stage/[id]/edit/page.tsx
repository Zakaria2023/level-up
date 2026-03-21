import { EducationalStageConfigurationForm } from "@/features/educational-stage/components/form/EducationalStageConfigurationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const EducationalStageEditPage = async ({
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <EducationalStageConfigurationForm
        mode="edit"
        rowId={educationalStageId}
      />
    </div>
  );
};

export default EducationalStageEditPage;
