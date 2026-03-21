"use client";

import { useTranslation } from "react-i18next";
import type { AcademicYearStructureStageItem } from "../types";
import AcademicYearStructureClassCard from "./AcademicYearStructureClassCard";

type AcademicYearStructureStageCardProps = {
  item: AcademicYearStructureStageItem;
  selectedYearSemesterNames: string[];
  supervisorLabelMap: Map<string, string>;
  teacherLabelMap: Map<string, string>;
};

const countLabel = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => `${count} ${count === 1 ? singular : plural}`;

const AcademicYearStructureStageCard = ({
  item,
  selectedYearSemesterNames,
  supervisorLabelMap,
  teacherLabelMap,
}: AcademicYearStructureStageCardProps) => {
  const { t } = useTranslation();

  return (
    <details
      open
      className="rounded-[28px] border border-(--border-color) bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-(--muted-text)">
            {t("AcademicYearStructureExplorer.stage.educationalStage")}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#0D3B52]">
            {item.stageLabel}
          </h3>
        </div>
        <div className="inline-flex rounded-full bg-(--primary-soft) px-4 py-2 text-sm font-semibold text-(--primary-strong)">
          {countLabel(
            item.classes.length,
            t("AcademicYearStructureExplorer.counts.classSingular"),
            t("AcademicYearStructureExplorer.counts.classPlural"),
          )}
        </div>
      </summary>

      <div className="mt-5 space-y-4">
        {item.classes.length ? (
          item.classes.map((classItem) => (
            <AcademicYearStructureClassCard
              key={classItem.schoolClass.id}
              item={classItem}
              selectedYearSemesterNames={selectedYearSemesterNames}
              supervisorLabelMap={supervisorLabelMap}
              teacherLabelMap={teacherLabelMap}
            />
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-(--border-color) bg-[#F8FDFF] px-4 py-5 text-sm text-(--muted-text)">
            {t("AcademicYearStructureExplorer.class.empty")}
          </div>
        )}
      </div>
    </details>
  );
};

export default AcademicYearStructureStageCard;
