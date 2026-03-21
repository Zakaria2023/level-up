import AcademicYearConfigurationDetails from "@/features/settings/academic-year-configuration/components/details/AcademicYearConfigurationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const AcademicYearConfigurationDetailPage = async ({
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
      <AcademicYearConfigurationDetails rowId={academicYearId} />
    </div>
  );
};

export default AcademicYearConfigurationDetailPage;
