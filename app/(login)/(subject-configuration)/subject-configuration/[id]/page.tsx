import SubjectConfigurationDetails from "@/features/settings/subject-configuration/components/details/SubjectConfigurationDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SubjectConfigurationDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const subjectConfigurationId = Number(id);

  if (!Number.isFinite(subjectConfigurationId) || subjectConfigurationId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SubjectConfigurationDetails rowId={subjectConfigurationId} />
    </div>
  );
};

export default SubjectConfigurationDetailPage;
