import { AcademicYearForm } from "@/features/academic-year/components/form/AcademicYearForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const AcademicYearEditPage = async ({
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <AcademicYearForm mode="edit" rowId={academicYearId} />
    </div>
  );
};

export default AcademicYearEditPage;
