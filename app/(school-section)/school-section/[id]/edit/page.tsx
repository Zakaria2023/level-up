import { SchoolSectionForm } from "@/features/school-section/components/form/SchoolSectionForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SchoolSectionEditPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const schoolSectionId = Number(id);

  if (!Number.isFinite(schoolSectionId) || schoolSectionId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SchoolSectionForm mode="edit" rowId={schoolSectionId} />
    </div>
  );
};

export default SchoolSectionEditPage;
