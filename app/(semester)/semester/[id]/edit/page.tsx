import { SemesterForm } from "@/features/semester/components/form/SemesterForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SemesterEditPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const semesterId = Number(id);

  if (!Number.isFinite(semesterId) || semesterId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SemesterForm mode="edit" rowId={semesterId} />
    </div>
  );
};

export default SemesterEditPage;
