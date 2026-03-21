"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import { useAcademicYearStore } from "@/features/academic-year/store/useAcademicYearStore";
import {
  formatEducationalStageLabel,
  resolveAcademicYearLabel,
} from "@/features/settings/educational-stage-configuration/constants";
import { useEducationalStageConfigurationStore } from "@/features/settings/educational-stage-configuration/store/useEducationalStageConfigurationStore";
import { formatSchoolClassLabel } from "@/features/settings/school-class-configuration/constants";
import { useSchoolClassConfigurationStore } from "@/features/settings/school-class-configuration/store/useSchoolClassConfigurationStore";
import { SECTION_SUPERVISOR_OPTIONS } from "@/features/settings/school-section-configuration/constants";
import { useSchoolSectionConfigurationStore } from "@/features/settings/school-section-configuration/store/useSchoolSectionConfigurationStore";
import { useSemesterStore } from "@/features/settings/semester/store/useSemesterStore";
import { SUBJECT_TEACHER_OPTIONS } from "@/features/settings/subject-configuration/constants";
import { useSubjectConfigurationStore } from "@/features/settings/subject-configuration/store/useSubjectConfigurationStore";
import { Cairo } from "next/font/google";
import { useMemo, useState } from "react";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
});

const countLabel = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const DetailPill = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-(--border-color) bg-white px-4 py-3">
    <p className="text-xs font-semibold uppercase text-(--muted-text)">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-(--foreground)">{value}</p>
  </div>
);

export default function AcademicYearStructureExplorer() {
  const academicYears = useAcademicYearStore((state) => state.rows);
  const semesters = useSemesterStore((state) => state.rows);
  const educationalStages = useEducationalStageConfigurationStore((state) => state.rows);
  const schoolClasses = useSchoolClassConfigurationStore((state) => state.rows);
  const schoolSections = useSchoolSectionConfigurationStore((state) => state.rows);
  const subjects = useSubjectConfigurationStore((state) => state.rows);

  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");

  const resolvedSelectedAcademicYearId =
    selectedAcademicYearId &&
      academicYears.some((row) => String(row.id) === selectedAcademicYearId)
      ? selectedAcademicYearId
      : academicYears[0]
        ? String(academicYears[0].id)
        : "";

  const academicYearOptions = useMemo(
    () =>
      academicYears.map((row) => ({
        label: row.academicYearName,
        value: String(row.id),
      })),
    [academicYears],
  );

  const selectedAcademicYear = academicYears.find(
    (row) => String(row.id) === resolvedSelectedAcademicYearId,
  );

  const filteredSemesters = useMemo(() => {
    if (!selectedAcademicYear) {
      return [];
    }

    return semesters.filter((row) => row.academicYearId === selectedAcademicYear.id);
  }, [semesters, selectedAcademicYear]);

  const selectedYearSemesterNames = useMemo(
    () =>
      selectedAcademicYear?.semesters
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? [],
    [selectedAcademicYear],
  );

  const semesterMap = useMemo(
    () => new Map(filteredSemesters.map((semester) => [semester.semesterName, semester])),
    [filteredSemesters],
  );

  const supervisorLabelMap = useMemo(
    () => new Map(SECTION_SUPERVISOR_OPTIONS.map((option) => [option.value, option.label])),
    [],
  );

  const teacherLabelMap = useMemo(
    () => new Map(SUBJECT_TEACHER_OPTIONS.map((option) => [option.value, option.label])),
    [],
  );

  const semesterTimeline = useMemo(() => {
    if (selectedYearSemesterNames.length) {
      return selectedYearSemesterNames.map((semesterName, index) => ({
        key: `${semesterName}-${index}`,
        label: semesterName,
        semester: semesterMap.get(semesterName),
      }));
    }

    return filteredSemesters.map((semester) => ({
      key: String(semester.id),
      label: semester.semesterName,
      semester,
    }));
  }, [filteredSemesters, selectedYearSemesterNames, semesterMap]);

  const academicYearNameMap = useMemo(
    () => new Map(academicYears.map((row) => [row.id, row.academicYearName])),
    [academicYears],
  );

  const stageStructure = useMemo(
    () =>
      educationalStages
        .filter((stage) => stage.academicYearId === selectedAcademicYear?.id)
        .map((stage) => {
          const classes = schoolClasses.filter(
            (schoolClass) => schoolClass.educationalStageId === stage.id,
          );

          return {
            stage,
            stageLabel: formatEducationalStageLabel(
              stage.stageName,
              resolveAcademicYearLabel(academicYearNameMap.get(stage.academicYearId)),
            ),
            classes: classes.map((schoolClass) => {
              const sections = schoolSections.filter(
                (section) => section.schoolClassId === schoolClass.id,
              );
              const classSubjects = subjects.filter((subject) =>
                subject.classSettings.some(
                  (classSetting) => classSetting.schoolClassId === schoolClass.id,
                ),
              );

              return {
                schoolClass,
                schoolClassLabel: formatSchoolClassLabel(
                  schoolClass.className,
                  formatEducationalStageLabel(
                    stage.stageName,
                    resolveAcademicYearLabel(academicYearNameMap.get(stage.academicYearId)),
                  ),
                ),
                sections,
                subjects: classSubjects.map((subject) => ({
                  ...subject,
                  classSetting: subject.classSettings.find(
                    (setting) => setting.schoolClassId === schoolClass.id,
                  ),
                })),
              };
            }),
          };
        }),
    [academicYearNameMap, educationalStages, schoolClasses, schoolSections, selectedAcademicYear?.id, subjects],
  );

  const totalClasses = useMemo(
    () => stageStructure.reduce((total, stage) => total + stage.classes.length, 0),
    [stageStructure],
  );
  const totalSections = useMemo(
    () =>
      stageStructure.reduce(
        (total, stage) =>
          total + stage.classes.reduce((classTotal, item) => classTotal + item.sections.length, 0),
        0,
      ),
    [stageStructure],
  );
  const totalSubjects = useMemo(
    () =>
      stageStructure.reduce(
        (total, stage) =>
          total +
          stage.classes.reduce((classTotal, item) => classTotal + item.subjects.length, 0),
        0,
      ),
    [stageStructure],
  );

  if (!academicYears.length) {
    return (
      <div className={cairo.className}>
        <DashboardCard
          title="Academic Year Structure"
          subtitle="Add at least one academic year configuration record to explore the structure."
          className="max-w-180"
        >
          <p className="text-sm text-(--muted-text)">
            The academic year structure page needs academic years, semesters, stages,
            classes, sections, and subjects to build the diagram.
          </p>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className={`${cairo.className} mx-auto flex w-full max-w-360 flex-col gap-6`}>
      <DashboardCard
        title="Academic Year Structure"
        subtitle="Select an academic year to explore its timeline and the current school configuration map."
        action={
          <div className="min-w-70">
            <Dropdown
              label="Academic Year"
              value={resolvedSelectedAcademicYearId || undefined}
              onChange={setSelectedAcademicYearId}
              options={academicYearOptions}
              placeholder="Select academic year"
              searchable
              searchPlaceholder="Search academic year"
            />
          </div>
        }
      >
        {selectedAcademicYear ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailPill label="Selected Year" value={selectedAcademicYear.academicYearName} />
              <DetailPill
                label="Timeline"
                value={`${selectedAcademicYear.startDate} to ${selectedAcademicYear.endDate}`}
              />
              <DetailPill
                label="Registration"
                value={`${selectedAcademicYear.registrationStartDate} to ${selectedAcademicYear.registrationEndDate}`}
              />
              <DetailPill
                label="Summary"
                value={`${countLabel(filteredSemesters.length, "semester")}, ${countLabel(stageStructure.length, "stage")}, ${countLabel(totalClasses, "class")}`}
              />
            </div>

            <div className="rounded-[28px] border border-(--border-color) bg-[#F8FDFF] p-5">
              <div className="flex flex-col items-center">
                <div className="rounded-3xl border border-(--border-color) bg-(--sidebar-bg) px-6 py-5 text-center shadow-[0_20px_50px_rgba(7,57,64,0.12)]">
                  <p className="text-xs font-semibold uppercase text-[#8fdee7]">
                    Academic Year
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {selectedAcademicYear.academicYearName}
                  </h3>
                  <p className="mt-2 text-sm text-[#d3f4f7]">
                    {selectedAcademicYear.startDate} to {selectedAcademicYear.endDate}
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
                                {semester.semesterStartDate} to {semester.semesterEndDate}
                              </p>
                              <div className="mt-4 grid gap-3">
                                <DetailPill
                                  label="Lessons"
                                  value={`${semester.actualLessonsStartDate} to ${semester.actualLessonsEndDate}`}
                                />
                                <DetailPill label="Final Exam" value={semester.finalExamDate} />
                              </div>
                            </>
                          ) : (
                            <p className="mt-3 text-sm text-(--muted-text)">
                              This semester is listed in the academic year record but does not
                              have a semester configuration entry yet.
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="min-w-60 rounded-[22px] border border-dashed border-(--border-color) bg-white p-5 text-sm text-(--muted-text)">
                        No semester configuration is linked to this academic year yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailPill label="Educational Stages" value={String(stageStructure.length)} />
              <DetailPill label="School Classes" value={String(totalClasses)} />
              <DetailPill label="School Sections" value={String(totalSections)} />
              <DetailPill label="Subjects" value={String(totalSubjects)} />
            </div>
          </div>
        ) : null}
      </DashboardCard>

      <div className="grid gap-4">
        {stageStructure.length ? (
          stageStructure.map(({ stage, stageLabel, classes }) => (
            <details
              key={stage.id}
              open
              className="rounded-[28px] border border-(--border-color) bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-(--muted-text)">
                    Educational Stage
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#0D3B52]">
                    {stageLabel}
                  </h3>
                </div>
                <div className="inline-flex rounded-full bg-(--primary-soft) px-4 py-2 text-sm font-semibold text-(--primary-strong)">
                  {countLabel(classes.length, "class")}
                </div>
              </summary>

              <div className="mt-5 space-y-4">
                {classes.length ? (
                  classes.map(({ schoolClass, schoolClassLabel, sections, subjects: classSubjects }) => (
                    <details
                      key={schoolClass.id}
                      open
                      className="rounded-[22px] border border-(--border-color) bg-[#F8FDFF] p-4"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <div>
                          <h4 className="text-base font-semibold text-[#0D3B52]">
                            {schoolClassLabel}
                          </h4>
                          <p className="mt-1 text-sm text-(--muted-text)">
                            Minimum passing grade: {schoolClass.minimumPassingGrade}%
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                            {countLabel(sections.length, "section")}
                          </span>
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                            {countLabel(classSubjects.length, "subject")}
                          </span>
                        </div>
                      </summary>

                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(260px,1fr)_minmax(320px,1.2fr)]">
                        <div className="rounded-[20px] border border-(--border-color) bg-white p-4">
                          <h5 className="text-sm font-semibold uppercase text-(--muted-text)">
                            Sections
                          </h5>
                          <div className="mt-4 grid gap-3">
                            {sections.length ? (
                              sections.map((section) => (
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
                                        Supervisor:{" "}
                                        {supervisorLabelMap.get(section.supervisorId) ??
                                          "Not assigned"}
                                      </p>
                                    </div>
                                    <span className="text-xs font-semibold text-(--primary-strong)">
                                      Capacity {section.defaultCapacity}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-(--muted-text)">
                                No sections are linked to this class yet.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="rounded-[20px] border border-(--border-color) bg-white p-4">
                          <h5 className="text-sm font-semibold uppercase text-(--muted-text)">
                            Subjects
                          </h5>
                          <div className="mt-4 grid gap-3">
                            {classSubjects.length ? (
                              classSubjects.map((subject) => (
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
                                        {subject.subjectType} subject, {subject.teachingLanguage}
                                      </p>
                                      <p className="mt-2 text-xs text-(--muted-text)">
                                        Teachers:{" "}
                                        {subject.teacherIds.length
                                          ? subject.teacherIds
                                            .map(
                                              (teacherId) =>
                                                teacherLabelMap.get(teacherId) ??
                                                "Unknown teacher",
                                            )
                                            .join(", ")
                                          : "Not assigned"}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {subject.classSetting ? (
                                        <>
                                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                                            {subject.classSetting.weeklyPeriodsCount}/week
                                          </span>
                                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                                            {subject.classSetting.periodDurationMinutes} min
                                          </span>
                                        </>
                                      ) : null}
                                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--primary-strong)">
                                        Pass {subject.minimumPassingGrade}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-(--muted-text)">
                                No subjects are linked to this class yet.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-[20px] border border-(--border-color) bg-white p-4">
                        <h5 className="text-sm font-semibold uppercase text-(--muted-text)">
                          Academic-Year Alignment
                        </h5>
                        <p className="mt-3 text-sm text-(--muted-text)">
                          This class uses the current structure configured for the selected
                          academic year. Related semesters:{" "}
                          <span className="font-semibold text-(--foreground)">
                            {selectedYearSemesterNames.length
                              ? selectedYearSemesterNames.join(", ")
                              : "No semester names linked yet"}
                          </span>
                        </p>
                      </div>
                    </details>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-(--border-color) bg-[#F8FDFF] px-4 py-5 text-sm text-(--muted-text)">
                    No school classes are linked to this stage yet.
                  </div>
                )}
              </div>
            </details>
          ))
        ) : (
          <DashboardCard
            title="Structure Map"
            subtitle="No educational stages are configured yet."
          >
            <p className="text-sm text-(--muted-text)">
              Add educational stages, classes, sections, and subjects to build the
              academic year structure tree.
            </p>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
