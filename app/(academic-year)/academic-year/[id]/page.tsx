import AcademicYearDetails from "@/features/academic-year/components/details/AcademicYearDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const AcademicYearDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const academicYearId = Number(id);

  if (!Number.isFinite(academicYearId) || academicYearId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <AcademicYearDetails rowId={academicYearId} />
    </div>
  );
};

export default AcademicYearDetailPage;
