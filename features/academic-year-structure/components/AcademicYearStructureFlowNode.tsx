"use client";

import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

export type AcademicYearStructureFlowNodeTone =
  | "academicYear"
  | "stage"
  | "class"
  | "section"
  | "subject";

export type AcademicYearStructureFlowNodeData = {
  category: string;
  title: string;
  subtitle?: string;
  badges?: string[];
  lines?: string[];
  tone: AcademicYearStructureFlowNodeTone;
  showTarget?: boolean;
  showSource?: boolean;
};

export type AcademicYearStructureFlowGraphNode = Node<
  AcademicYearStructureFlowNodeData,
  "structureNode"
>;

const toneClassMap: Record<
  AcademicYearStructureFlowNodeTone,
  {
    badgeClassName: string;
    ringClassName: string;
  }
> = {
  academicYear: {
    badgeClassName: "bg-(--sidebar-panel) text-white",
    ringClassName: "shadow-[0_18px_36px_rgba(15,95,107,0.18)]",
  },
  stage: {
    badgeClassName: "bg-[#E0F4FF] text-[#1B76A6]",
    ringClassName: "shadow-[0_18px_36px_rgba(27,118,166,0.12)]",
  },
  class: {
    badgeClassName: "bg-[#FFF2DB] text-[#A56A12]",
    ringClassName: "shadow-[0_18px_36px_rgba(165,106,18,0.12)]",
  },
  section: {
    badgeClassName: "bg-[#E8F6E8] text-[#2D8851]",
    ringClassName: "shadow-[0_18px_36px_rgba(45,136,81,0.12)]",
  },
  subject: {
    badgeClassName: "bg-[#F4E9FF] text-[#7A3FA6]",
    ringClassName: "shadow-[0_18px_36px_rgba(122,63,166,0.12)]",
  },
};

const AcademicYearStructureFlowNode = ({
  data,
}: NodeProps<AcademicYearStructureFlowGraphNode>) => {
  const toneClasses = toneClassMap[data.tone];

  return (
    <div
      className={[
        "w-65 rounded-3xl border border-(--border-color) bg-white p-4",
        toneClasses.ringClassName,
      ].join(" ")}
    >
      {/* Show the incoming connection handle for every node except the academic-year root node. */}
      {data.showTarget !== false ? (
        <Handle
          type="target"
          position={Position.Left}
          className="h-3! w-3! border-2! border-white! bg-(--primary-strong)!"
        />
      ) : null}

      {/* Keep the node header consistent so each graph level is easy to scan at a glance. */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold",
                toneClasses.badgeClassName,
              ].join(" ")}
            >
              {data.category}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-[#0D3B52]">
                {data.title}
              </h3>
              {data.subtitle ? (
                <p className="mt-1 text-xs text-(--muted-text)">
                  {data.subtitle}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Render compact badges for short facts like semester names without making the node too tall. */}
        {data.badges?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex rounded-full bg-(--primary-soft) px-2.5 py-1 text-[11px] font-medium text-(--primary-strong)"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {/* Show the supporting details as short rows so the graph stays readable while still useful. */}
        {data.lines?.length ? (
          <div className="space-y-1.5">
            {data.lines.map((line) => (
              <p key={line} className="text-xs text-(--muted-text)">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {/* Show the outgoing connection handle for every non-leaf node so the flow remains directional. */}
      {data.showSource !== false ? (
        <Handle
          type="source"
          position={Position.Right}
          className="h-3! w-3! border-2! border-white! bg-(--primary-strong)!"
        />
      ) : null}
    </div>
  );
};

export default AcademicYearStructureFlowNode;
