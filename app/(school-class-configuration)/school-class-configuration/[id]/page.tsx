import SchoolClassConfigurationDetails from "@/features/settings/school-class-configuration/components/details/SchoolClassConfigurationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SchoolClassConfigurationDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const schoolClassConfigurationId = Number(id);

  if (!Number.isFinite(schoolClassConfigurationId) || schoolClassConfigurationId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SchoolClassConfigurationDetails rowId={schoolClassConfigurationId} />
    </div>
  );
};

export default SchoolClassConfigurationDetailPage;
