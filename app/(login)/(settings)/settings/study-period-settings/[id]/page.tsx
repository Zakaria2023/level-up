import StudyPeriodSettingsDetails from "@/features/settings/study-period-settings/components/details/StudyPeriodSettingsDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

const SettingsStudyPeriodSettingsDetailPage = async ({
  params,
}: {
  params: Params;
}) => {
  const { id } = await params;
  const studyPeriodSettingsId = Number(id);

  if (!Number.isFinite(studyPeriodSettingsId) || studyPeriodSettingsId <= 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F6F8FB] px-4 py-10 sm:px-6">
      <StudyPeriodSettingsDetails rowId={studyPeriodSettingsId} />
    </div>
  );
};

export default SettingsStudyPeriodSettingsDetailPage;
