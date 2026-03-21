import { SubjectForm } from "@/features/subject/components/form/SubjectForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SubjectEditPage = async ({
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SubjectForm mode="edit" rowId={subjectId} />
    </div>
  );
};

export default SubjectEditPage;
