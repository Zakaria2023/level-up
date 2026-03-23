"use client";

import { AcademicYearRow } from "@/features/academic-year/types";
import { type Edge, type ReactFlowInstance } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  buildFlowLayout,
  collectVisibleHierarchy,
  countStageSections,
  countStageSubjects,
  countTotalCapacity,
  countUniqueSupervisors,
} from "../helpers";
import {
  AcademicYearStructureStageItem,
  type AcademicYearStructureDetailItem,
  type AcademicYearStructureFlowGraphNode,
  type AcademicYearStructureHierarchyNode,
  type HierarchyEdge,
} from "../types";

export const useAcademicYearStructureFlow = (
  stageStructure: AcademicYearStructureStageItem[],
  supervisorLabelMap: Map<string, string>,
  selectedYearSemesterNames: string[],
  selectedAcademicYearId: string,
  selectedAcademicYear?: AcademicYearRow | undefined,
) => {
  const { t } = useTranslation();
  const [expandedNodeIdsByYear, setExpandedNodeIdsByYear] = useState<
    Record<string, string[]>
  >({});
  const [fitViewVersion, setFitViewVersion] = useState(0);
  const [lastToggleMode, setLastToggleMode] = useState<
    "initial" | "expand" | "collapse"
  >("initial");
  const [isMobile, setIsMobile] = useState(false);
  const [viewportVersion, setViewportVersion] = useState(0);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const previousAcademicYearIdRef = useRef("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleViewportChange = () => {
      setIsMobile(mediaQuery.matches);
    };
    const handleResize = () => {
      handleViewportChange();
      setViewportVersion((currentVersion) => currentVersion + 1);
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const hierarchyRoot = useMemo<
    AcademicYearStructureHierarchyNode | undefined
  >(() => {
    if (!selectedAcademicYear) {
      return undefined;
    }

    const yearNodeId = `academic-year-${selectedAcademicYear.id}`;
    const totalStages = stageStructure.length;
    const totalGrades = stageStructure.reduce(
      (total, stageItem) => total + stageItem.classes.length,
      0,
    );
    const totalClasses = totalGrades;
    const totalSections = stageStructure.reduce(
      (total, stageItem) => total + countStageSections(stageItem),
      0,
    );

    const stageNodes: AcademicYearStructureHierarchyNode[] = stageStructure.map(
      (stageItem) => {
        const stageNodeId = `stage-${stageItem.stage.id}`;
        const stageSectionsCount = countStageSections(stageItem);
        const stageSubjectsCount = countStageSubjects(stageItem);

        const gradeNodes: AcademicYearStructureHierarchyNode[] =
          stageItem.classes.map((classItem) => {
            const gradeNodeId = `grade-${classItem.schoolClass.id}`;
            const classNodeId = `class-${classItem.schoolClass.id}`;
            const uniqueSupervisors = countUniqueSupervisors(classItem);
            const classCapacity = countTotalCapacity(classItem);

            const sectionNodes: AcademicYearStructureHierarchyNode[] =
              classItem.sections.map((section) => ({
                id: `section-${section.id}`,
                parentId: classNodeId,
                kind: "section" as const,
                kindLabel: t("AcademicYearStructureExplorer.hierarchy.section"),
                childrenLabel: t("AcademicYearStructureExplorer.childrenLabel"),
                title: section.sectionName,
                subtitle:
                  supervisorLabelMap.get(section.supervisorId) ??
                  t("AcademicYearStructureExplorer.common.notAssigned"),
                status: section.isActive
                  ? t("AcademicYearStructureExplorer.statuses.active")
                  : t("AcademicYearStructureExplorer.statuses.inactive"),
                expandLabel: t("AcademicYearStructureExplorer.actions.expand"),
                collapseLabel: t(
                  "AcademicYearStructureExplorer.actions.collapse",
                ),
                childrenCount: 0,
                quickStats: [
                  {
                    label: t("AcademicYearStructureExplorer.stats.capacity"),
                    value: String(section.defaultCapacity),
                  },
                  {
                    label: t("AcademicYearStructureExplorer.stats.supervisor"),
                    value:
                      supervisorLabelMap.get(section.supervisorId) ??
                      t("AcademicYearStructureExplorer.common.notAssigned"),
                  },
                ],
                detailItems: [
                  {
                    label: t(
                      "AcademicYearStructureExplorer.details.sectionName",
                    ),
                    value: section.sectionName,
                  },
                  {
                    label: t(
                      "AcademicYearStructureExplorer.details.parentClass",
                    ),
                    value: classItem.schoolClass.className,
                  },
                  {
                    label: t(
                      "AcademicYearStructureExplorer.details.supervisor",
                    ),
                    value:
                      supervisorLabelMap.get(section.supervisorId) ??
                      t("AcademicYearStructureExplorer.common.notAssigned"),
                  },
                  {
                    label: t(
                      "AcademicYearStructureExplorer.details.defaultCapacity",
                    ),
                    value: String(section.defaultCapacity),
                    valueDir: "ltr" as const,
                  },
                ],
                children: [],
              }));

            const gradeDetailItems: AcademicYearStructureDetailItem[] = [
              {
                label: t("AcademicYearStructureExplorer.details.parentStage"),
                value: stageItem.stage.stageName,
              },
              {
                label: t(
                  "AcademicYearStructureExplorer.details.minimumPassingGrade",
                ),
                value: `${classItem.schoolClass.minimumPassingGrade}%`,
                valueDir: "ltr",
              },
              {
                label: t(
                  "AcademicYearStructureExplorer.details.linkedSections",
                ),
                value: String(sectionNodes.length),
                valueDir: "ltr",
              },
              {
                label: t(
                  "AcademicYearStructureExplorer.details.linkedSubjects",
                ),
                value: String(classItem.subjects.length),
                valueDir: "ltr",
              },
            ];

            const classNode: AcademicYearStructureHierarchyNode = {
              id: classNodeId,
              parentId: gradeNodeId,
              kind: "class",
              kindLabel: t("AcademicYearStructureExplorer.hierarchy.class"),
              childrenLabel: t("AcademicYearStructureExplorer.childrenLabel"),
              title: t("AcademicYearStructureExplorer.generatedClass.title"),
              subtitle: classItem.schoolClass.className,
              status: sectionNodes.length
                ? t("AcademicYearStructureExplorer.statuses.ready")
                : t("AcademicYearStructureExplorer.statuses.empty"),
              expandLabel: t("AcademicYearStructureExplorer.actions.expand"),
              collapseLabel: t(
                "AcademicYearStructureExplorer.actions.collapse",
              ),
              childrenCount: sectionNodes.length,
              quickStats: [
                {
                  label: t("AcademicYearStructureExplorer.stats.sections"),
                  value: String(sectionNodes.length),
                },
                {
                  label: t("AcademicYearStructureExplorer.stats.capacity"),
                  value: String(classCapacity),
                },
                {
                  label: t("AcademicYearStructureExplorer.stats.supervisors"),
                  value: String(uniqueSupervisors),
                },
              ],
              detailItems: [
                {
                  label: t("AcademicYearStructureExplorer.details.parentGrade"),
                  value: classItem.schoolClass.className,
                },
                {
                  label: t("AcademicYearStructureExplorer.details.classRollup"),
                  value: t(
                    "AcademicYearStructureExplorer.generatedClass.description",
                  ),
                },
                {
                  label: t(
                    "AcademicYearStructureExplorer.details.linkedSections",
                  ),
                  value: String(sectionNodes.length),
                  valueDir: "ltr" as const,
                },
                {
                  label: t(
                    "AcademicYearStructureExplorer.details.linkedSubjects",
                  ),
                  value: String(classItem.subjects.length),
                  valueDir: "ltr" as const,
                },
              ],
              children: sectionNodes,
            };

            return {
              id: gradeNodeId,
              parentId: stageNodeId,
              kind: "grade" as const,
              kindLabel: t("AcademicYearStructureExplorer.hierarchy.grade"),
              childrenLabel: t("AcademicYearStructureExplorer.childrenLabel"),
              title: classItem.schoolClass.className,
              subtitle: stageItem.stage.stageName,
              status: classItem.schoolClass.isActive
                ? t("AcademicYearStructureExplorer.statuses.active")
                : t("AcademicYearStructureExplorer.statuses.inactive"),
              expandLabel: t("AcademicYearStructureExplorer.actions.expand"),
              collapseLabel: t(
                "AcademicYearStructureExplorer.actions.collapse",
              ),
              childrenCount: 1,
              quickStats: [
                {
                  label: t("AcademicYearStructureExplorer.stats.passGrade"),
                  value: `${classItem.schoolClass.minimumPassingGrade}%`,
                },
                {
                  label: t("AcademicYearStructureExplorer.stats.sections"),
                  value: String(sectionNodes.length),
                },
                {
                  label: t("AcademicYearStructureExplorer.stats.subjects"),
                  value: String(classItem.subjects.length),
                },
              ],
              detailItems: gradeDetailItems,
              children: [classNode],
            };
          });

        return {
          id: stageNodeId,
          parentId: yearNodeId,
          kind: "stage" as const,
          kindLabel: t("AcademicYearStructureExplorer.hierarchy.stage"),
          childrenLabel: t("AcademicYearStructureExplorer.childrenLabel"),
          title: stageItem.stage.stageName,
          subtitle: stageItem.stage.teachingLanguage,
          status: t("AcademicYearStructureExplorer.statuses.configured"),
          expandLabel: t("AcademicYearStructureExplorer.actions.expand"),
          collapseLabel: t("AcademicYearStructureExplorer.actions.collapse"),
          childrenCount: gradeNodes.length,
          quickStats: [
            {
              label: t("AcademicYearStructureExplorer.stats.grades"),
              value: String(gradeNodes.length),
            },
            {
              label: t("AcademicYearStructureExplorer.stats.sections"),
              value: String(stageSectionsCount),
            },
            {
              label: t("AcademicYearStructureExplorer.stats.subjects"),
              value: String(stageSubjectsCount),
            },
          ],
          detailItems: [
            {
              label: t("AcademicYearStructureExplorer.details.academicYear"),
              value: selectedAcademicYear.academicYearName,
            },
            {
              label: t(
                "AcademicYearStructureExplorer.details.teachingLanguage",
              ),
              value: stageItem.stage.teachingLanguage,
            },
            {
              label: t(
                "AcademicYearStructureExplorer.details.requiredEnrollmentAge",
              ),
              value: String(stageItem.stage.requiredEnrollmentAge),
              valueDir: "ltr" as const,
            },
            {
              label: t("AcademicYearStructureExplorer.details.mixedStage"),
              value: stageItem.stage.isMixedStage
                ? t("AcademicYearStructureExplorer.common.yes")
                : t("AcademicYearStructureExplorer.common.no"),
            },
          ],
          children: gradeNodes,
        };
      },
    );

    return {
      id: yearNodeId,
      kind: "academicYear",
      kindLabel: t("AcademicYearStructureExplorer.hierarchy.academicYear"),
      childrenLabel: t("AcademicYearStructureExplorer.childrenLabel"),
      title: selectedAcademicYear.academicYearName,
      subtitle: `${selectedAcademicYear.startDate} - ${selectedAcademicYear.endDate}`,
      status: selectedAcademicYear.isActive
        ? t("AcademicYearStructureExplorer.statuses.active")
        : t("AcademicYearStructureExplorer.statuses.inactive"),
      expandLabel: t("AcademicYearStructureExplorer.actions.expand"),
      collapseLabel: t("AcademicYearStructureExplorer.actions.collapse"),
      childrenCount: stageNodes.length,
      quickStats: [
        {
          label: t("AcademicYearStructureExplorer.stats.semesters"),
          value: String(selectedYearSemesterNames.length),
        },
        {
          label: t("AcademicYearStructureExplorer.stats.stages"),
          value: String(totalStages),
        },
        {
          label: t("AcademicYearStructureExplorer.stats.sections"),
          value: String(totalSections),
        },
      ],
      detailItems: [
        {
          label: t("AcademicYearStructureExplorer.details.academicYearRange"),
          value: t("AcademicYearStructureExplorer.range", {
            start: selectedAcademicYear.startDate,
            end: selectedAcademicYear.endDate,
          }),
          valueDir: "ltr" as const,
        },
        {
          label: t("AcademicYearStructureExplorer.details.registrationRange"),
          value: t("AcademicYearStructureExplorer.range", {
            start: selectedAcademicYear.registrationStartDate,
            end: selectedAcademicYear.registrationEndDate,
          }),
          valueDir: "ltr" as const,
        },
        {
          label: t("AcademicYearStructureExplorer.details.linkedSemesters"),
          value:
            selectedYearSemesterNames.join(", ") ||
            t("AcademicYearStructureExplorer.common.notAssigned"),
        },
        {
          label: t("AcademicYearStructureExplorer.details.hierarchyDepth"),
          value: `${totalStages} / ${totalGrades} / ${totalClasses} / ${totalSections}`,
          valueDir: "ltr" as const,
        },
      ],
      children: stageNodes,
    };
  }, [
    selectedAcademicYear,
    selectedYearSemesterNames,
    stageStructure,
    supervisorLabelMap,
    t,
  ]);

  const defaultExpandedNodeIds = useMemo(() => [] as string[], []);

  const yearScopedExpandedNodeIds = useMemo(() => {
    if (!hierarchyRoot || !selectedAcademicYearId) {
      return [];
    }

    return Object.prototype.hasOwnProperty.call(
      expandedNodeIdsByYear,
      selectedAcademicYearId,
    )
      ? expandedNodeIdsByYear[selectedAcademicYearId]
      : defaultExpandedNodeIds;
  }, [
    defaultExpandedNodeIds,
    expandedNodeIdsByYear,
    hierarchyRoot,
    selectedAcademicYearId,
  ]);

  const handleToggle = useCallback(
    (nodeId: string) => {
      if (!selectedAcademicYearId) {
        return;
      }

      const isCollapsing = yearScopedExpandedNodeIds.includes(nodeId);
      const shouldAutoFit =
        !isCollapsing || (hierarchyRoot ? nodeId === hierarchyRoot.id : false);

      setExpandedNodeIdsByYear((currentState) => {
        const currentIds = Object.prototype.hasOwnProperty.call(
          currentState,
          selectedAcademicYearId,
        )
          ? currentState[selectedAcademicYearId]
          : defaultExpandedNodeIds;

        return {
          ...currentState,
          [selectedAcademicYearId]: currentIds.includes(nodeId)
            ? currentIds.filter((currentId) => currentId !== nodeId)
            : [...currentIds, nodeId],
        };
      });

      if (shouldAutoFit) {
        setLastToggleMode("expand");
        setFitViewVersion((currentVersion) => currentVersion + 1);
      } else {
        setLastToggleMode("collapse");
      }
    },
    [
      defaultExpandedNodeIds,
      hierarchyRoot,
      selectedAcademicYearId,
      yearScopedExpandedNodeIds,
    ],
  );

  const { nodes, edges, layoutHeight } = useMemo(() => {
    if (!hierarchyRoot) {
      return {
        nodes: [] as AcademicYearStructureFlowGraphNode[],
        edges: [] as Edge[],
        layoutHeight: 0,
      };
    }

    const visibleHierarchyNodes: AcademicYearStructureHierarchyNode[] = [];
    const visibleHierarchyEdges: HierarchyEdge[] = [];
    const expandedNodeIds = new Set(yearScopedExpandedNodeIds);

    collectVisibleHierarchy(
      hierarchyRoot,
      expandedNodeIds,
      visibleHierarchyNodes,
      visibleHierarchyEdges,
    );

    return buildFlowLayout({
      visibleNodes: visibleHierarchyNodes,
      visibleEdges: visibleHierarchyEdges,
      expandedNodeIds,
      isCompact: isMobile,
      onToggle: handleToggle,
    });
  }, [handleToggle, hierarchyRoot, isMobile, yearScopedExpandedNodeIds]);

  const fitViewConfig = useMemo(
    () =>
      isMobile
        ? {
            padding: 0.01,
            minZoom: 0.2,
            maxZoom: 1,
          }
        : {
            padding: 0.05,
            minZoom: 0.55,
            maxZoom: 1.35,
          },
    [isMobile],
  );

  const flowHeight = useMemo(
    () => Math.max(isMobile ? 460 : 620, layoutHeight + (isMobile ? 48 : 80)),
    [isMobile, layoutHeight],
  );

  useEffect(() => {
    const yearChanged =
      previousAcademicYearIdRef.current !== selectedAcademicYearId;

    previousAcademicYearIdRef.current = selectedAcademicYearId;

    if (!reactFlowInstance || !nodes.length) {
      return;
    }

    if (!yearChanged && lastToggleMode === "collapse") {
      return;
    }

    let innerFrameId = 0;
    const frameId = window.requestAnimationFrame(() => {
      innerFrameId = window.requestAnimationFrame(() => {
        reactFlowInstance.fitView({
          duration: 260,
          padding: fitViewConfig.padding,
          minZoom: fitViewConfig.minZoom,
          maxZoom: fitViewConfig.maxZoom,
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(innerFrameId);
    };
  }, [
    fitViewVersion,
    fitViewConfig,
    lastToggleMode,
    nodes.length,
    reactFlowInstance,
    selectedAcademicYearId,
  ]);

  useEffect(() => {
    if (!viewportVersion || !reactFlowInstance || !nodes.length) {
      return;
    }

    let innerFrameId = 0;
    const frameId = window.requestAnimationFrame(() => {
      innerFrameId = window.requestAnimationFrame(() => {
        reactFlowInstance.fitView({
          duration: 220,
          padding: fitViewConfig.padding,
          minZoom: fitViewConfig.minZoom,
          maxZoom: fitViewConfig.maxZoom,
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(innerFrameId);
    };
  }, [fitViewConfig, nodes.length, reactFlowInstance, viewportVersion]);

  return {
    t,
    hierarchyRoot,
    flowHeight,
    nodes,
    edges,
    isMobile,
    fitViewConfig,
    setReactFlowInstance,
  };
};
