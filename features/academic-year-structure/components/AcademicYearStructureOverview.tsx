"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import type { AcademicYearRow } from "@/features/academic-year/types";
import { useTranslation } from "react-i18next";
import type { AcademicYearStructureTimelineItem } from "../types";
import AcademicYearStructureDetailPill from "./AcademicYearStructureDetailPill";

type AcademicYearStructureOverviewProps = {
  academicYearOptions: {
    label: string;
    value: string;
  }[];
  selectedAcademicYearId: string;
  setSelectedAcademicYearId: (value: string) => void;
  selectedAcademicYear?: AcademicYearRow;
  semesterTimeline: AcademicYearStructureTimelineItem[];
  stageCount: number;
  totalClasses: number;
  totalSections: number;
  totalSubjects: number;
  filteredSemesterCount: number;
  showAcademicYearSelector?: boolean;
};

const countLabel = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => `${count} ${count === 1 ? singular : plural}`;

const AcademicYearStructureOverview = ({
  academicYearOptions,
  selectedAcademicYearId,
  setSelectedAcademicYearId,
  selectedAcademicYear,
  semesterTimeline,
  stageCount,
  totalClasses,
  totalSections,
  totalSubjects,
  filteredSemesterCount,
  showAcademicYearSelector = true,
}: AcademicYearStructureOverviewProps) => {
  const { t } = useTranslation();

  return (
    <DashboardCard
      title={t("AcademicYearStructureExplorer.title")}
      subtitle={
        showAcademicYearSelector
          ? t("AcademicYearStructureExplorer.subtitle")
          : undefined
      }
      action={
        showAcademicYearSelector ? (
          <div className="min-w-70">
            <Dropdown
              label={t("AcademicYearStructureExplorer.dropdownLabel")}
              value={selectedAcademicYearId || undefined}
              onChange={setSelectedAcademicYearId}
              options={academicYearOptions}
              placeholder={t("AcademicYearStructureExplorer.dropdownPlaceholder")}
              searchable
              searchPlaceholder={t(
                "AcademicYearStructureExplorer.dropdownSearchPlaceholder",
              )}
            />
          </div>
        ) : undefined
      }
    >
      {selectedAcademicYear ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.pills.selectedYear")}
              value={selectedAcademicYear.academicYearName}
            />
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.pills.timeline")}
              value={t("AcademicYearStructureExplorer.range", {
                start: selectedAcademicYear.startDate,
                end: selectedAcademicYear.endDate,
              })}
            />
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.pills.registration")}
              value={t("AcademicYearStructureExplorer.range", {
                start: selectedAcademicYear.registrationStartDate,
                end: selectedAcademicYear.registrationEndDate,
              })}
            />
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.pills.summary")}
              value={t("AcademicYearStructureExplorer.summaryValue", {
                semesters: countLabel(
                  filteredSemesterCount,
                  t("AcademicYearStructureExplorer.counts.semesterSingular"),
                  t("AcademicYearStructureExplorer.counts.semesterPlural"),
                ),
                stages: countLabel(
                  stageCount,
                  t("AcademicYearStructureExplorer.counts.stageSingular"),
                  t("AcademicYearStructureExplorer.counts.stagePlural"),
                ),
                classes: countLabel(
                  totalClasses,
                  t("AcademicYearStructureExplorer.counts.classSingular"),
                  t("AcademicYearStructureExplorer.counts.classPlural"),
                ),
              })}
            />
          </div>

          <div className="rounded-[28px] border border-(--border-color) bg-[#F8FDFF] p-5">
            <div className="flex flex-col items-center">
              <div className="rounded-3xl border border-(--border-color) bg-(--sidebar-bg) px-6 py-5 text-center shadow-[0_20px_50px_rgba(7,57,64,0.12)]">
                <p className="text-xs font-semibold uppercase text-[#8fdee7]">
                  {t("AcademicYearStructureExplorer.centerCard.academicYear")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {selectedAcademicYear.academicYearName}
                </h3>
                <p className="mt-2 text-sm text-[#d3f4f7]">
                  {t("AcademicYearStructureExplorer.range", {
                    start: selectedAcademicYear.startDate,
                    end: selectedAcademicYear.endDate,
                  })}
                </p>
              </div>

              <div className="h-8 w-px bg-(--sidebar-border)" />

              <div className="scrollbar-soft w-full overflow-x-auto pb-2">
                <div className="mx-auto grid min-w-max gap-4 md:auto-cols-fr md:grid-flow-col">
                  {semesterTimeline.length ? (
                    semesterTimeline.map(({ key, label, semester }) => (
                      <div
                        key={key}
                        className="min-w-60 rounded-[22px] border border-(--border-color) bg-white p-4 shadow-[0_14px_36px_rgba(11,86,95,0.08)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-base font-semibold text-[#0D3B52]">
                            {label}
                          </h4>
                          {semester ? (
                            <span className="inline-flex rounded-full bg-(--primary-soft) px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                              {semester.evaluationType}
                            </span>
                          ) : null}
                        </div>
                        {semester ? (
                          <>
                            <p className="mt-3 text-sm text-(--muted-text)">
                              {t("AcademicYearStructureExplorer.range", {
                                start: semester.semesterStartDate,
                                end: semester.semesterEndDate,
                              })}
                            </p>
                            <div className="mt-4 grid gap-3">
                              <AcademicYearStructureDetailPill
                                label={t(
                                  "AcademicYearStructureExplorer.timeline.lessons",
                                )}
                                value={t("AcademicYearStructureExplorer.range", {
                                  start: semester.actualLessonsStartDate,
                                  end: semester.actualLessonsEndDate,
                                })}
                              />
                              <AcademicYearStructureDetailPill
                                label={t(
                                  "AcademicYearStructureExplorer.timeline.finalExam",
                                )}
                                value={semester.finalExamDate}
                              />
                            </div>
                          </>
                        ) : (
                          <p className="mt-3 text-sm text-(--muted-text)">
                            {t(
                              "AcademicYearStructureExplorer.timeline.missingSemester",
                            )}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="min-w-60 rounded-[22px] border border-dashed border-(--border-color) bg-white p-5 text-sm text-(--muted-text)">
                      {t("AcademicYearStructureExplorer.timeline.empty")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.stats.educationalStages")}
              value={String(stageCount)}
            />
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.stats.schoolClasses")}
              value={String(totalClasses)}
            />
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.stats.schoolSections")}
              value={String(totalSections)}
            />
            <AcademicYearStructureDetailPill
              label={t("AcademicYearStructureExplorer.stats.subjects")}
              value={String(totalSubjects)}
            />
          </div>
        </div>
      ) : null}
    </DashboardCard>
  );
};

export default AcademicYearStructureOverview;
