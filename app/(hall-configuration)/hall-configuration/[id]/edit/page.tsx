import { HallConfigurationForm } from "@/features/settings/hall-configuration/components/form/HallConfigurationForm";

type EditHallConfigurationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditHallConfigurationPage = async ({
  params,
}: EditHallConfigurationPageProps) => {
  const { id } = await params;
  const rowId = Number(id);

  return <HallConfigurationForm mode="edit" rowId={rowId} />;
};

export default EditHallConfigurationPage;
