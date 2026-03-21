"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { useTranslation } from "react-i18next";
import type { AcademicYearStructureStageItem } from "../types";
import AcademicYearStructureStageCard from "./AcademicYearStructureStageCard";

type AcademicYearStructureTreeProps = {
  stageStructure: AcademicYearStructureStageItem[];
  selectedYearSemesterNames: string[];
  supervisorLabelMap: Map<string, string>;
  teacherLabelMap: Map<string, string>;
};

const AcademicYearStructureTree = ({
  stageStructure,
  selectedYearSemesterNames,
  supervisorLabelMap,
  teacherLabelMap,
}: AcademicYearStructureTreeProps) => {
  const { t } = useTranslation();

  if (!stageStructure.length) {
    return (
      <DashboardCard
        title={t("AcademicYearStructureExplorer.structureMap.title")}
        subtitle={t("AcademicYearStructureExplorer.structureMap.subtitle")}
      >
        <p className="text-sm text-(--muted-text)">
          {t("AcademicYearStructureExplorer.structureMap.description")}
        </p>
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-4">
      {stageStructure.map((stageItem) => (
        <AcademicYearStructureStageCard
          key={stageItem.stage.id}
          item={stageItem}
          selectedYearSemesterNames={selectedYearSemesterNames}
          supervisorLabelMap={supervisorLabelMap}
          teacherLabelMap={teacherLabelMap}
        />
      ))}
    </div>
  );
};

export default AcademicYearStructureTree;
