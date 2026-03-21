import { HallForm } from "@/features/hall/components/form/HallForm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const EditHallPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const hallId = Number(id);

  if (
    !Number.isFinite(hallId) ||
    hallId <= 0
  ) {
    return notFound();
  }

  return <HallForm mode="edit" rowId={hallId} />;
};

export default EditHallPage;
