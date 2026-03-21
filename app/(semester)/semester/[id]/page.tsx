import SemesterDetails from "@/features/settings/semester/components/details/SemesterDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SemesterDetailPage = async ({
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
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <SemesterDetails rowId={semesterId} />
    </div>
  );
};

export default SemesterDetailPage;
