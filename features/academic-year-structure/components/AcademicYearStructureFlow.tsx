"use client";

import Dropdown from "@/components/ui/Dropdown";
import type { AcademicYearRow } from "@/features/academic-year/types";
import {
  Position,
  ReactFlow,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import dagre from "dagre";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  AcademicYearStructureClassItem,
  AcademicYearStructureDetailItem,
  AcademicYearStructureFlowGraphNode,
  AcademicYearStructureHierarchyNode,
  AcademicYearStructureStageItem,
} from "../types";
import AcademicYearStructureFlowNode from "./AcademicYearStructureFlowNode";

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
};

type HierarchyEdge = {
  source: string;
  target: string;
};

const FLOW_NODE_WIDTH = 268;
const FLOW_NODE_HEIGHT = 228;

const nodeTypes = {
  structureNode: AcademicYearStructureFlowNode,
} satisfies NodeTypes;

const countStageSections = (stageItem: AcademicYearStructureStageItem) =>
  stageItem.classes.reduce(
    (total, classItem) => total + classItem.sections.length,
    0,
  );

const countStageSubjects = (stageItem: AcademicYearStructureStageItem) =>
  stageItem.classes.reduce(
    (total, classItem) => total + classItem.subjects.length,
    0,
  );

const countUniqueSupervisors = (classItem: AcademicYearStructureClassItem) =>
  new Set(
    classItem.sections
      .map((section) => section.supervisorId)
      .filter(Boolean),
  ).size;

const countTotalCapacity = (classItem: AcademicYearStructureClassItem) =>
  classItem.sections.reduce(
    (total, section) => total + section.defaultCapacity,
    0,
  );

const collectVisibleHierarchy = (
  node: AcademicYearStructureHierarchyNode,
  expandedNodeIds: Set<string>,
  nodes: AcademicYearStructureHierarchyNode[],
  edges: HierarchyEdge[],
) => {
  nodes.push(node);

  if (!expandedNodeIds.has(node.id)) {
    return;
  }

  node.children.forEach((childNode) => {
    edges.push({
      source: node.id,
      target: childNode.id,
    });

    collectVisibleHierarchy(childNode, expandedNodeIds, nodes, edges);
  });
};

const buildFlowLayout = ({
  visibleNodes,
  visibleEdges,
  expandedNodeIds,
  onToggle,
}: {
  visibleNodes: AcademicYearStructureHierarchyNode[];
  visibleEdges: HierarchyEdge[];
  expandedNodeIds: Set<string>;
  onToggle: (nodeId: string) => void;
}) => {
  const graph = new dagre.graphlib.Graph();

  graph.setGraph({
    rankdir: "TB",
    ranker: "tight-tree",
    ranksep: 56,
    nodesep: 42,
    marginx: 24,
    marginy: 24,
  });
  graph.setDefaultEdgeLabel(() => ({}));

  visibleNodes.forEach((node) => {
    graph.setNode(node.id, {
      width: FLOW_NODE_WIDTH,
      height: FLOW_NODE_HEIGHT,
    });
  });

  visibleEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const graphMetrics = graph.graph();

  return {
    nodes: visibleNodes.map<AcademicYearStructureFlowGraphNode>((node) => {
      const dagreNode = graph.node(node.id);

      return {
        id: node.id,
        type: "structureNode",
        position: {
          x: dagreNode.x - FLOW_NODE_WIDTH / 2,
          y: dagreNode.y - FLOW_NODE_HEIGHT / 2,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        data: {
          hierarchyNode: node,
          isExpanded: expandedNodeIds.has(node.id),
          onToggle,
        },
      };
    }),
    edges: visibleEdges.map<Edge>((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      selectable: false,
      focusable: false,
      animated: false,
      interactionWidth: 0,
      pathOptions: {
        borderRadius: 10,
        offset: 18,
      },
      style: {
        stroke: "#CDD7DF",
        strokeWidth: 1.4,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    })),
    layoutHeight: Math.ceil((graphMetrics.height ?? 0) + 48),
  };
};

const AcademicYearStructureFlow = ({
  academicYearOptions,
  selectedAcademicYear,
  selectedAcademicYearId,
  setSelectedAcademicYearId,
  selectedYearSemesterNames,
  stageStructure,
  supervisorLabelMap,
}: AcademicYearStructureFlowProps) => {
  const { t } = useTranslation();
  const [expandedNodeIdsByYear, setExpandedNodeIdsByYear] = useState<
    Record<string, string[]>
  >({});
  const [fitViewVersion, setFitViewVersion] = useState(0);
  const [lastToggleMode, setLastToggleMode] = useState<
    "initial" | "expand" | "collapse"
  >("initial");
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const previousAcademicYearIdRef = useRef("");

  const hierarchyRoot = useMemo<AcademicYearStructureHierarchyNode | undefined>(
    () => {
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
                  label: t("AcademicYearStructureExplorer.details.linkedSections"),
                  value: String(sectionNodes.length),
                  valueDir: "ltr",
                },
                {
                  label: t("AcademicYearStructureExplorer.details.linkedSubjects"),
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
                    label: t("AcademicYearStructureExplorer.details.linkedSections"),
                    value: String(sectionNodes.length),
                    valueDir: "ltr" as const,
                  },
                  {
                    label: t("AcademicYearStructureExplorer.details.linkedSubjects"),
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
                label: t("AcademicYearStructureExplorer.details.teachingLanguage"),
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
    },
    [
      selectedAcademicYear,
      selectedYearSemesterNames,
      stageStructure,
      supervisorLabelMap,
      t,
    ],
  );

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
      onToggle: handleToggle,
    });
  }, [handleToggle, hierarchyRoot, yearScopedExpandedNodeIds]);

  const flowHeight = useMemo(
    () => Math.max(620, layoutHeight + 80),
    [layoutHeight],
  );

  useEffect(() => {
    const yearChanged = previousAcademicYearIdRef.current !== selectedAcademicYearId;

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
          padding: 0.05,
          minZoom: 0.55,
          maxZoom: 1.35,
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(innerFrameId);
    };
  }, [
    fitViewVersion,
    lastToggleMode,
    nodes.length,
    reactFlowInstance,
    selectedAcademicYearId,
  ]);

  return (
    <div className="w-full space-y-5">
      <div className="max-w-80">
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

      {!stageStructure.length || !selectedAcademicYear || !hierarchyRoot ? (
        <p className="text-sm text-(--muted-text)">
          {t("AcademicYearStructureExplorer.structureMap.description")}
        </p>
      ) : (
        <div
          className="w-full"
          style={{ height: `${flowHeight}px`, minHeight: "620px" }}
        >
          <ReactFlow
            key={selectedAcademicYearId || "academic-year-structure-flow"}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.05, minZoom: 0.55, maxZoom: 1.35 }}
            onInit={setReactFlowInstance}
            proOptions={{ hideAttribution: true }}
            minZoom={0.45}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            selectionOnDrag={false}
            nodesFocusable={false}
            edgesFocusable={false}
            preventScrolling={false}
            className="bg-transparent"
          />
        </div>
      )}
    </div>
  );
};

export default AcademicYearStructureFlow;
