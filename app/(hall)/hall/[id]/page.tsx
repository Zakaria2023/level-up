import HallDetails from "@/features/hall/components/details/HallDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const HallDetailsPage = async ({
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

  return <HallDetails rowId={hallId} />;
};

export default HallDetailsPage;
