"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { useTranslation } from "react-i18next";

const AcademicYearStructureEmptyState = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard
      title={t("AcademicYearStructureExplorer.emptyState.title")}
      subtitle={t("AcademicYearStructureExplorer.emptyState.subtitle")}
      className="max-w-180"
    >
      <p className="text-sm text-(--muted-text)">
        {t("AcademicYearStructureExplorer.emptyState.description")}
      </p>
    </DashboardCard>
  );
};

export default AcademicYearStructureEmptyState;
