import { Position, type Edge } from "@xyflow/react";
import dagre from "dagre";
import {
  AcademicYearStructureClassItem,
  AcademicYearStructureFlowGraphNode,
  AcademicYearStructureHierarchyNode,
  AcademicYearStructureNodeKind,
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

export const toneClassMap: Record<
  AcademicYearStructureNodeKind,
  {
    headerClassName: string;
    badgeClassName: string;
    statClassName: string;
    footerButtonClassName: string;
  }
> = {
  academicYear: {
    headerClassName: "bg-[#875A7B]",
    badgeClassName: "bg-[#F4E8EF] text-[#875A7B]",
    statClassName: "bg-[#FBF5F8] text-[#875A7B]",
    footerButtonClassName: "border-[#D9C0CF] text-[#875A7B] hover:bg-[#FAF2F6]",
  },
  stage: {
    headerClassName: "bg-[#29B5C5]",
    badgeClassName: "bg-[#E6FAFD] text-[#157784]",
    statClassName: "bg-[#F3FCFD] text-[#157784]",
    footerButtonClassName: "border-[#BEEAF0] text-[#157784] hover:bg-[#F2FBFD]",
  },
  grade: {
    headerClassName: "bg-[#7C7BAD]",
    badgeClassName: "bg-[#EFEEFB] text-[#5A5891]",
    statClassName: "bg-[#F7F7FD] text-[#5A5891]",
    footerButtonClassName: "border-[#D7D4EE] text-[#5A5891] hover:bg-[#F6F5FD]",
  },
  class: {
    headerClassName: "bg-[#E5C76B]",
    badgeClassName: "bg-[#FFF8DD] text-[#8A6E12]",
    statClassName: "bg-[#FFFCEF] text-[#8A6E12]",
    footerButtonClassName: "border-[#F0DFA5] text-[#8A6E12] hover:bg-[#FFFCF0]",
  },
  section: {
    headerClassName: "bg-[#6CB98D]",
    badgeClassName: "bg-[#ECF8F1] text-[#2F7C4F]",
    statClassName: "bg-[#F5FBF7] text-[#2F7C4F]",
    footerButtonClassName: "border-[#CBE7D5] text-[#2F7C4F] hover:bg-[#F4FBF6]",
  },
};

export const getAvatarLabel = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
