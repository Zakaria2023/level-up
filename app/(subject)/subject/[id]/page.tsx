import SubjectDetails from "@/features/subject/components/details/SubjectDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SubjectDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const subjectId = Number(id);

  if (!Number.isFinite(subjectId) || subjectId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SubjectDetails rowId={subjectId} />
    </div>
  );
};

export default SubjectDetailPage;
