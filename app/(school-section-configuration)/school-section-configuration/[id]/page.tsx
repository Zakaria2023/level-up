import SchoolSectionConfigurationDetails from "@/features/settings/school-section-configuration/components/details/SchoolSectionConfigurationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SchoolSectionConfigurationDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const schoolSectionConfigurationId = Number(id);

  if (!Number.isFinite(schoolSectionConfigurationId) || schoolSectionConfigurationId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SchoolSectionConfigurationDetails rowId={schoolSectionConfigurationId} />
    </div>
  );
};

export default SchoolSectionConfigurationDetailPage;
