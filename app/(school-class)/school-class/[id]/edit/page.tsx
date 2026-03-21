import { SchoolClassConfigurationForm } from "@/features/school-class/components/form/SchoolClassConfigurationForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SchoolClassEditPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const schoolClassId = Number(id);

  if (!Number.isFinite(schoolClassId) || schoolClassId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SchoolClassConfigurationForm mode="edit" rowId={schoolClassId} />
    </div>
  );
};

export default SchoolClassEditPage;
