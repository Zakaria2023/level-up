import { Position, type Edge } from "@xyflow/react";
import dagre from "dagre";
import {
  AcademicYearStructureClassItem,
  AcademicYearStructureFlowGraphNode,
  AcademicYearStructureHierarchyNode,
  AcademicYearStructureStageItem,
  HierarchyEdge,
} from "../types";

export const countStageSections = (stageItem: AcademicYearStructureStageItem) =>
  stageItem.classes.reduce(
    (total, classItem) => total + classItem.sections.length,
    0,
  );

export const countStageSubjects = (stageItem: AcademicYearStructureStageItem) =>
  stageItem.classes.reduce(
    (total, classItem) => total + classItem.subjects.length,
    0,
  );

export const countUniqueSupervisors = (
  classItem: AcademicYearStructureClassItem,
) =>
  new Set(
    classItem.sections.map((section) => section.supervisorId).filter(Boolean),
  ).size;

export const countTotalCapacity = (classItem: AcademicYearStructureClassItem) =>
  classItem.sections.reduce(
    (total, section) => total + section.defaultCapacity,
    0,
  );

export const collectVisibleHierarchy = (
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

export const buildFlowLayout = ({
  visibleNodes,
  visibleEdges,
  expandedNodeIds,
  isCompact,
  onToggle,
}: {
  visibleNodes: AcademicYearStructureHierarchyNode[];
  visibleEdges: HierarchyEdge[];
  expandedNodeIds: Set<string>;
  isCompact: boolean;
  onToggle: (nodeId: string) => void;
}) => {
  const DESKTOP_NODE_WIDTH = 268;
  const DESKTOP_NODE_HEIGHT = 228;
  const MOBILE_NODE_WIDTH = 208;
  const MOBILE_NODE_HEIGHT = 196;

  const graph = new dagre.graphlib.Graph();
  const nodeWidth = isCompact ? MOBILE_NODE_WIDTH : DESKTOP_NODE_WIDTH;
  const nodeHeight = isCompact ? MOBILE_NODE_HEIGHT : DESKTOP_NODE_HEIGHT;

  graph.setGraph({
    rankdir: "TB",
    ranker: "tight-tree",
    ranksep: isCompact ? 34 : 56,
    nodesep: isCompact ? 18 : 42,
    marginx: isCompact ? 12 : 24,
    marginy: isCompact ? 16 : 24,
  });
  // It avoids issues if no edge label is explicitly provided.
  graph.setDefaultEdgeLabel(() => ({}));

  visibleNodes.forEach((node) => {
    graph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  visibleEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const graphMetrics = graph.graph();

  return {
    // This maps your hierarchy nodes into React Flow nodes.
    nodes: visibleNodes.map<AcademicYearStructureFlowGraphNode>((node) => {
      const dagreNode = graph.node(node.id);

      return {
        id: node.id,
        type: "structureNode",
        position: {
          x: dagreNode.x - nodeWidth / 2,
          y: dagreNode.y - nodeHeight / 2,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        data: {
          hierarchyNode: node,
          isExpanded: expandedNodeIds.has(node.id),
          isCompact,
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
        borderRadius: isCompact ? 8 : 10,
        offset: isCompact ? 10 : 18,
      },
      style: {
        stroke: "#CDD7DF",
        strokeWidth: isCompact ? 1.2 : 1.4,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    })),
    layoutHeight: Math.ceil((graphMetrics.height ?? 0) + 48),
  };
};
