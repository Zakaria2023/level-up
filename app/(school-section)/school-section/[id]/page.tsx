import SchoolSectionDetails from "@/features/school-section/components/details/SchoolSectionDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SchoolSectionDetailPage = async ({
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
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SchoolSectionDetails rowId={schoolSectionId} />
    </div>
  );
};

export default SchoolSectionDetailPage;
