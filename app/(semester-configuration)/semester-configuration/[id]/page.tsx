import SemesterConfigurationDetails from "@/features/settings/semester-configuration/components/details/SemesterConfigurationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SemesterConfigurationDetailPage = async ({
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
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SemesterConfigurationDetails rowId={semesterConfigurationId} />
    </div>
  );
};

export default SemesterConfigurationDetailPage;
