import HallConfigurationDetails from "@/features/settings/hall-configuration/components/details/HallConfigurationDetails";

type HallConfigurationDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const HallConfigurationDetailsPage = async ({
  params,
}: HallConfigurationDetailsPageProps) => {
  const { id } = await params;
  const rowId = Number(id);

  return <HallConfigurationDetails rowId={rowId} />;
};

export default HallConfigurationDetailsPage;
