import { SemesterConfigurationForm } from "@/features/settings/semester-configuration/components/form/SemesterConfigurationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SemesterConfigurationEditPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const semesterConfigurationId = Number(id);

  if (!Number.isFinite(semesterConfigurationId) || semesterConfigurationId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SemesterConfigurationForm mode="edit" rowId={semesterConfigurationId} />
    </div>
  );
};

export default SemesterConfigurationEditPage;
