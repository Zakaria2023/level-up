"use client";

import { useTranslation } from "react-i18next";
import type { AcademicYearStructureClassItem } from "../types";

type AcademicYearStructureClassCardProps = {
  item: AcademicYearStructureClassItem;
  selectedYearSemesterNames: string[];
  supervisorLabelMap: Map<string, string>;
  teacherLabelMap: Map<string, string>;
};

const countLabel = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => `${count} ${count === 1 ? singular : plural}`;

const AcademicYearStructureClassCard = ({
  item,
  selectedYearSemesterNames,
  supervisorLabelMap,
  teacherLabelMap,
}: AcademicYearStructureClassCardProps) => {
  const { t } = useTranslation();

  return (
    <details
      open
      className="rounded-[22px] border border-(--border-color) bg-[#F8FDFF] p-4"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-[#0D3B52]">
            {item.schoolClassLabel}
          </h4>
          <p className="mt-1 text-sm text-(--muted-text)">
            {t("AcademicYearStructureExplorer.class.minimumPassingGrade", {
              value: item.schoolClass.minimumPassingGrade,
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
            {countLabel(
              item.sections.length,
              t("AcademicYearStructureExplorer.counts.sectionSingular"),
              t("AcademicYearStructureExplorer.counts.sectionPlural"),
            )}
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
            {countLabel(
              item.subjects.length,
              t("AcademicYearStructureExplorer.counts.subjectSingular"),
              t("AcademicYearStructureExplorer.counts.subjectPlural"),
            )}
          </span>
        </div>
      </summary>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(260px,1fr)_minmax(320px,1.2fr)]">
        <div className="rounded-[20px] border border-(--border-color) bg-white p-4">
          <h5 className="text-sm font-semibold uppercase text-(--muted-text)">
            {t("AcademicYearStructureExplorer.sections.title")}
          </h5>
          <div className="mt-4 grid gap-3">
            {item.sections.length ? (
              item.sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-(--border-color) bg-[#F8FDFF] px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-(--foreground)">
                        {section.sectionName}
                      </p>
                      <p className="mt-1 text-xs text-(--muted-text)">
                        {t("AcademicYearStructureExplorer.sections.supervisor")}{" "}
                        {supervisorLabelMap.get(section.supervisorId) ??
                          t("AcademicYearStructureExplorer.common.notAssigned")}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-(--primary-strong)">
                      {t("AcademicYearStructureExplorer.sections.capacity", {
                        value: section.defaultCapacity,
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--muted-text)">
                {t("AcademicYearStructureExplorer.sections.empty")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[20px] border border-(--border-color) bg-white p-4">
          <h5 className="text-sm font-semibold uppercase text-(--muted-text)">
            {t("AcademicYearStructureExplorer.subjects.title")}
          </h5>
          <div className="mt-4 grid gap-3">
            {item.subjects.length ? (
              item.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-2xl border border-(--border-color) bg-[#F8FDFF] px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-(--foreground)">
                        {subject.subjectName}
                      </p>
                      <p className="mt-1 text-xs text-(--muted-text)">
                        {t("AcademicYearStructureExplorer.subjects.subjectMeta", {
                          subjectType: subject.subjectType,
                          teachingLanguage: subject.teachingLanguage,
                        })}
                      </p>
                      <p className="mt-2 text-xs text-(--muted-text)">
                        {t("AcademicYearStructureExplorer.subjects.teachers")}{" "}
                        {subject.teacherIds.length
                          ? subject.teacherIds
                              .map(
                                (teacherId) =>
                                  teacherLabelMap.get(teacherId) ??
                                  t(
                                    "AcademicYearStructureExplorer.common.unknownTeacher",
                                  ),
                              )
                              .join(", ")
                          : t("AcademicYearStructureExplorer.common.notAssigned")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subject.classSetting ? (
                        <>
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                            {t(
                              "AcademicYearStructureExplorer.subjects.weeklyPeriods",
                              {
                                value: subject.classSetting.weeklyPeriodsCount,
                              },
                            )}
                          </span>
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                            {t(
                              "AcademicYearStructureExplorer.subjects.periodDuration",
                              {
                                value: subject.classSetting.periodDurationMinutes,
                              },
                            )}
                          </span>
                        </>
                      ) : null}
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                        {t("AcademicYearStructureExplorer.subjects.passGrade", {
                          value: subject.minimumPassingGrade,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--muted-text)">
                {t("AcademicYearStructureExplorer.subjects.empty")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[20px] border border-(--border-color) bg-white p-4">
        <h5 className="text-sm font-semibold uppercase text-(--muted-text)">
          {t("AcademicYearStructureExplorer.alignment.title")}
        </h5>
        <p className="mt-3 text-sm text-(--muted-text)">
          {t("AcademicYearStructureExplorer.alignment.description")}{" "}
          <span className="font-semibold text-(--foreground)">
            {selectedYearSemesterNames.length
              ? selectedYearSemesterNames.join(", ")
              : t("AcademicYearStructureExplorer.alignment.noSemesterNames")}
          </span>
        </p>
      </div>
    </details>
  );
};

export default AcademicYearStructureClassCard;
