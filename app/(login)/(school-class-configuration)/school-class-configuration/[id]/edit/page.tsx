import { SchoolClassConfigurationForm } from "@/features/settings/school-class-configuration/components/form/SchoolClassConfigurationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SchoolClassConfigurationEditPage = async ({
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SchoolClassConfigurationForm mode="edit" rowId={schoolClassConfigurationId} />
    </div>
  );
};

export default SchoolClassConfigurationEditPage;
