"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import type { AcademicYearRow } from "@/features/academic-year/types";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type {
  AcademicYearStructureClassItem,
  AcademicYearStructureStageItem,
} from "../types";
import AcademicYearStructureFlowNode, {
  type AcademicYearStructureFlowGraphNode,
  type AcademicYearStructureFlowNodeData,
} from "./AcademicYearStructureFlowNode";

type AcademicYearStructureFlowProps = {
  academicYearOptions: {
    label: string;
    value: string;
  }[];
  selectedAcademicYear?: AcademicYearRow;
  selectedAcademicYearId: string;
  setSelectedAcademicYearId: (value: string) => void;
  selectedYearSemesterNames: string[];
  stageStructure: AcademicYearStructureStageItem[];
  supervisorLabelMap: Map<string, string>;
  teacherLabelMap: Map<string, string>;
};

const nodeTypes = {
  structureNode: AcademicYearStructureFlowNode,
} satisfies NodeTypes;

// These fixed layout values keep the flow readable without bringing in a separate graph layout library.
const NODE_HEIGHT = 188;
const HORIZONTAL_GAP = 320;
const VERTICAL_GAP = 48;
const ROOT_X = 40;

const countLabel = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => `${count} ${count === 1 ? singular : plural}`;

const getStackHeight = (count: number) =>
  count > 0 ? count * NODE_HEIGHT + (count - 1) * VERTICAL_GAP : 0;

const getClassSubtreeHeight = (item: AcademicYearStructureClassItem) => {
  const childCount = item.sections.length + item.subjects.length;

  return Math.max(NODE_HEIGHT, getStackHeight(childCount));
};

const getStageSubtreeHeight = (item: AcademicYearStructureStageItem) => {
  if (!item.classes.length) {
    return NODE_HEIGHT;
  }

  const classHeights = item.classes.map(getClassSubtreeHeight);
  const totalClassHeight =
    classHeights.reduce((total, height) => total + height, 0) +
    (classHeights.length - 1) * VERTICAL_GAP;

  return Math.max(NODE_HEIGHT, totalClassHeight);
};

const getTopFromCenter = (centerY: number) => centerY - NODE_HEIGHT / 2;

const summarizeSemesterBadges = (semesterNames: string[]) => {
  if (semesterNames.length <= 4) {
    return semesterNames;
  }

  return [...semesterNames.slice(0, 4), `+${semesterNames.length - 4}`];
};

const AcademicYearStructureFlow = ({
  academicYearOptions,
  selectedAcademicYear,
  selectedAcademicYearId,
  setSelectedAcademicYearId,
  selectedYearSemesterNames,
  stageStructure,
  supervisorLabelMap,
  teacherLabelMap,
}: AcademicYearStructureFlowProps) => {
  const { t } = useTranslation();

  const { nodes, edges } = useMemo(() => {
    if (!stageStructure.length || !selectedAcademicYear) {
      return {
        nodes: [] as AcademicYearStructureFlowGraphNode[],
        edges: [] as Edge[],
      };
    }

    const flowNodes: AcademicYearStructureFlowGraphNode[] = [];
    const flowEdges: Edge[] = [];

    const totalClasses = stageStructure.reduce(
      (total, stageItem) => total + stageItem.classes.length,
      0,
    );
    const totalSections = stageStructure.reduce(
      (total, stageItem) =>
        total +
        stageItem.classes.reduce(
          (classTotal, classItem) => classTotal + classItem.sections.length,
          0,
        ),
      0,
    );
    const totalSubjects = stageStructure.reduce(
      (total, stageItem) =>
        total +
        stageItem.classes.reduce(
          (classTotal, classItem) => classTotal + classItem.subjects.length,
          0,
        ),
      0,
    );

    const stageHeights = stageStructure.map(getStageSubtreeHeight);
    const totalStructureHeight =
      stageHeights.reduce((total, height) => total + height, 0) +
      (stageHeights.length - 1) * VERTICAL_GAP;
    const yearCenterY = totalStructureHeight / 2;
    const yearNodeId = `academic-year-${selectedAcademicYear.id}`;

    // The root node anchors the full graph and gives context for the chosen academic year.
    flowNodes.push({
      id: yearNodeId,
      type: "structureNode",
      position: {
        x: ROOT_X,
        y: getTopFromCenter(yearCenterY),
      },
      data: {
        category: t("AcademicYearStructureExplorer.centerCard.academicYear"),
        title: selectedAcademicYear.academicYearName,
        subtitle: t("AcademicYearStructureExplorer.range", {
          start: selectedAcademicYear.startDate,
          end: selectedAcademicYear.endDate,
        }),
        badges: summarizeSemesterBadges(selectedYearSemesterNames),
        lines: [
          t("AcademicYearStructureExplorer.range", {
            start: selectedAcademicYear.registrationStartDate,
            end: selectedAcademicYear.registrationEndDate,
          }),
          t("AcademicYearStructureExplorer.summaryValue", {
            semesters: countLabel(
              selectedYearSemesterNames.length,
              t("AcademicYearStructureExplorer.counts.semesterSingular"),
              t("AcademicYearStructureExplorer.counts.semesterPlural"),
            ),
            stages: countLabel(
              stageStructure.length,
              t("AcademicYearStructureExplorer.counts.stageSingular"),
              t("AcademicYearStructureExplorer.counts.stagePlural"),
            ),
            classes: countLabel(
              totalClasses,
              t("AcademicYearStructureExplorer.counts.classSingular"),
              t("AcademicYearStructureExplorer.counts.classPlural"),
            ),
          }),
          `${countLabel(
            totalSections,
            t("AcademicYearStructureExplorer.counts.sectionSingular"),
            t("AcademicYearStructureExplorer.counts.sectionPlural"),
          )}, ${countLabel(
            totalSubjects,
            t("AcademicYearStructureExplorer.counts.subjectSingular"),
            t("AcademicYearStructureExplorer.counts.subjectPlural"),
          )}`,
        ],
        tone: "academicYear",
        showTarget: false,
      },
    });

    let currentStageTop = 0;

    // Build the stage, class, section, and subject branches from left to right.
    stageStructure.forEach((stageItem, stageIndex) => {
      const stageHeight = stageHeights[stageIndex];
      const stageCenterY = currentStageTop + stageHeight / 2;
      const stageNodeId = `stage-${stageItem.stage.id}`;

      flowNodes.push({
        id: stageNodeId,
        type: "structureNode",
        position: {
          x: ROOT_X + HORIZONTAL_GAP,
          y: getTopFromCenter(stageCenterY),
        },
        data: {
          category: t("AcademicYearStructureExplorer.stage.educationalStage"),
          title: stageItem.stage.stageName,
          subtitle: stageItem.stageLabel,
          lines: [stageItem.stage.teachingLanguage],
          tone: "stage",
        },
      });

      flowEdges.push({
        id: `${yearNodeId}-${stageNodeId}`,
        source: yearNodeId,
        target: stageNodeId,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "var(--primary-strong)",
        },
        style: {
          stroke: "var(--primary-strong)",
          strokeWidth: 2,
        },
      });

      if (!stageItem.classes.length) {
        currentStageTop += stageHeight + VERTICAL_GAP;
        return;
      }

      const classHeights = stageItem.classes.map(getClassSubtreeHeight);
      const totalClassHeight =
        classHeights.reduce((total, height) => total + height, 0) +
        (classHeights.length - 1) * VERTICAL_GAP;
      let currentClassTop =
        currentStageTop + (stageHeight - totalClassHeight) / 2;

      stageItem.classes.forEach((classItem, classIndex) => {
        const classHeight = classHeights[classIndex];
        const classCenterY = currentClassTop + classHeight / 2;
        const classNodeId = `class-${classItem.schoolClass.id}`;

        flowNodes.push({
          id: classNodeId,
          type: "structureNode",
          position: {
            x: ROOT_X + HORIZONTAL_GAP * 2,
            y: getTopFromCenter(classCenterY),
          },
          data: {
            category: t("AcademicYearStructureExplorer.stats.schoolClasses"),
            title: classItem.schoolClass.className,
            subtitle: classItem.schoolClassLabel,
            lines: [
              t("AcademicYearStructureExplorer.class.minimumPassingGrade", {
                value: classItem.schoolClass.minimumPassingGrade,
              }),
            ],
            tone: "class",
          },
        });

        flowEdges.push({
          id: `${stageNodeId}-${classNodeId}`,
          source: stageNodeId,
          target: classNodeId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--primary-strong)",
          },
          style: {
            stroke: "var(--primary-strong)",
            strokeWidth: 2,
          },
        });

        const childItems = [
          ...classItem.sections.map((section) => ({
            id: `section-${section.id}`,
            tone: "section" as const,
            category: t("AcademicYearStructureExplorer.sections.title"),
            title: section.sectionName,
            subtitle: t("AcademicYearStructureExplorer.sections.capacity", {
              value: section.defaultCapacity,
            }),
            lines: [
              `${t("AcademicYearStructureExplorer.sections.supervisor")} ${
                supervisorLabelMap.get(section.supervisorId) ??
                t("AcademicYearStructureExplorer.common.notAssigned")
              }`,
            ],
          })),
          ...classItem.subjects.map((subject) => ({
            id: `subject-${subject.id}-${classItem.schoolClass.id}`,
            tone: "subject" as const,
            category: t("AcademicYearStructureExplorer.subjects.title"),
            title: subject.subjectName,
            subtitle: t("AcademicYearStructureExplorer.subjects.subjectMeta", {
              subjectType: subject.subjectType,
              teachingLanguage: subject.teachingLanguage,
            }),
            lines: [
              `${t("AcademicYearStructureExplorer.subjects.teachers")} ${
                subject.teacherIds.length
                  ? subject.teacherIds
                      .map(
                        (teacherId) =>
                          teacherLabelMap.get(teacherId) ??
                          t("AcademicYearStructureExplorer.common.unknownTeacher"),
                      )
                      .join(", ")
                  : t("AcademicYearStructureExplorer.common.notAssigned")
              }`,
              `${t("AcademicYearStructureExplorer.subjects.weeklyPeriods", {
                value: subject.classSetting?.weeklyPeriodsCount ?? 0,
              })} | ${t(
                "AcademicYearStructureExplorer.subjects.periodDuration",
                {
                  value: subject.classSetting?.periodDurationMinutes ?? 0,
                },
              )}`,
              t("AcademicYearStructureExplorer.subjects.passGrade", {
                value: subject.minimumPassingGrade,
              }),
            ],
          })),
        ];

        if (!childItems.length) {
          currentClassTop += classHeight + VERTICAL_GAP;
          return;
        }

        const totalChildHeight = getStackHeight(childItems.length);
        let currentChildTop =
          currentClassTop + (classHeight - totalChildHeight) / 2;

        childItems.forEach((child) => {
          flowNodes.push({
            id: child.id,
            type: "structureNode",
            position: {
              x: ROOT_X + HORIZONTAL_GAP * 3,
              y: currentChildTop,
            },
            data: {
              category: child.category,
              title: child.title,
              subtitle: child.subtitle,
              lines: child.lines,
              tone: child.tone,
              showSource: false,
            },
          });

          flowEdges.push({
            id: `${classNodeId}-${child.id}`,
            source: classNodeId,
            target: child.id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "var(--primary-strong)",
            },
            style: {
              stroke: "var(--primary-strong)",
              strokeWidth: 2,
            },
          });

          currentChildTop += NODE_HEIGHT + VERTICAL_GAP;
        });

        currentClassTop += classHeight + VERTICAL_GAP;
      });

      currentStageTop += stageHeight + VERTICAL_GAP;
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [
    selectedAcademicYear,
    selectedYearSemesterNames,
    stageStructure,
    supervisorLabelMap,
    teacherLabelMap,
    t,
  ]);

  // Stop early with the existing empty-state card when there is no structure to draw yet.
  if (!stageStructure.length || !selectedAcademicYear) {
    return (
      <DashboardCard
        title={t("AcademicYearStructureExplorer.structureMap.title")}
        subtitle={t("AcademicYearStructureExplorer.structureMap.subtitle")}
        action={
          <div className="min-w-70">
            {/* Keep the academic-year selector available even when no structure nodes are ready yet. */}
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
        }
      >
        <p className="text-sm text-(--muted-text)">
          {t("AcademicYearStructureExplorer.structureMap.description")}
        </p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title={t("AcademicYearStructureExplorer.title")}
      action={
        <div className="min-w-70">
          {/* Keep the academic-year selector in the card header so only the flow renders below it. */}
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
      }
    >
      {/* Wrap the canvas in a styled frame so the flow feels like part of the dashboard UI. */}
      <div className="rounded-[28px] border border-(--border-color) bg-[#F8FDFF] p-3">
        <div className="h-[820px] overflow-hidden rounded-[22px] border border-(--border-color) bg-white">
          {/* Render the graph as a read-only React Flow canvas that users can pan and zoom. */}
          <ReactFlow
            key={selectedAcademicYearId || "academic-year-structure-flow"}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnDoubleClick={false}
            panOnScroll
            className="bg-[#F8FDFF]"
          >
            {/* Add supporting canvas tools so the user can navigate the structure comfortably. */}
            <Background
              gap={24}
              size={1}
              color="rgba(41, 181, 197, 0.12)"
            />
            <MiniMap
              pannable
              zoomable
              className="!border !border-(--border-color) !bg-white"
              nodeColor={(node) => {
                const tone = (node.data as AcademicYearStructureFlowNodeData).tone;

                switch (tone) {
                  case "academicYear":
                    return "#157784";
                  case "stage":
                    return "#1B76A6";
                  case "class":
                    return "#A56A12";
                  case "section":
                    return "#2D8851";
                  case "subject":
                    return "#7A3FA6";
                  default:
                    return "#29B5C5";
                }
              }}
            />
            <Controls
              showInteractive={false}
              className="!border !border-(--border-color) !bg-white"
            />
          </ReactFlow>
        </div>
      </div>
    </DashboardCard>
  );
};

export default AcademicYearStructureFlow;
