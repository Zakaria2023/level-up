"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import { getAvatarLabel, toneClassMap } from "../helpers";
import type {
  AcademicYearStructureFlowGraphNode
} from "../types";

const AcademicYearStructureFlowNode = ({
  id,
  data,
}: NodeProps<AcademicYearStructureFlowGraphNode>) => {
  const toneClasses = toneClassMap[data.hierarchyNode.kind];
  const canExpand = data.hierarchyNode.childrenCount > 0;
  const visibleStats = data.hierarchyNode.quickStats.slice(0, 2);
  const avatarLabel = getAvatarLabel(data.hierarchyNode.title);

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[18px] border border-[#DCE7EF] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.05)]",
        data.isCompact ? "w-52" : "w-67",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="pointer-events-none! h-0! w-0! border-0! bg-transparent! opacity-0!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="pointer-events-none! h-0! w-0! border-0! bg-transparent! opacity-0!"
      />

      <div
        className={clsx(
          data.isCompact
            ? "flex min-h-9 items-center justify-between gap-2 px-3 py-2 text-white"
            : "flex min-h-11 items-center justify-between gap-2 px-4 py-2 text-white",
          toneClasses.headerClassName,
        )}
      >
        <p
          className={clsx(
            "truncate font-semibold",
            data.isCompact ? "text-[12px]" : "text-[13px]",
          )}
        >
          {data.hierarchyNode.title}
        </p>
        <span
          className={clsx(
            "shrink-0 rounded-full bg-white/20 font-semibold",
            data.isCompact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]",
          )}
        >
          {data.hierarchyNode.status}
        </span>
      </div>

      <div
        className={clsx(
          "space-y-3",
          data.isCompact ? "px-3 py-3" : "px-4 py-3.5",
        )}
      >
        <div className={clsx("flex items-start", data.isCompact ? "gap-2" : "gap-3")}>
          <div
            className={clsx(
              data.isCompact
                ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
              toneClasses.badgeClassName,
            )}
          >
            {avatarLabel || "AY"}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={clsx(
                "font-semibold uppercase text-[#91A0AE]",
                data.isCompact ? "text-[9px]" : "text-[10px]",
              )}
            >
              {data.hierarchyNode.kindLabel}
            </p>
            {data.hierarchyNode.subtitle ? (
              <p
                className={clsx(
                  "mt-1 text-[#526372]",
                  data.isCompact ? "text-[11px] leading-4" : "text-[12px] leading-5",
                )}
              >
                {data.hierarchyNode.subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {visibleStats.length ? (
          <div className={clsx("grid grid-cols-2", data.isCompact ? "gap-1.5" : "gap-2")}>
            {visibleStats.map((stat) => (
              <div
                key={`${id}-${stat.label}`}
                className={clsx(
                  data.isCompact
                    ? "rounded-lg px-2 py-1.5 text-center"
                    : "rounded-xl px-2.5 py-2 text-center",
                  toneClasses.statClassName,
                )}
              >
                <p
                  className={clsx(
                    "font-semibold uppercase opacity-75",
                    data.isCompact ? "text-[8px] tracking-[0.06em]" : "text-[10px] tracking-[0.08em]",
                  )}
                >
                  {stat.label}
                </p>
                <p
                  className={clsx(
                    "mt-1 font-bold",
                    data.isCompact ? "text-[11px]" : "text-[12px]",
                  )}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={clsx(
          "flex items-center justify-between border-t border-[#E7EEF4]",
          data.isCompact ? "gap-2 px-3 py-2.5" : "gap-3 px-4 py-3",
        )}
      >
        <span
          className={clsx(
            "font-semibold text-[#607284]",
            data.isCompact ? "text-[10px]" : "text-[11px]",
          )}
        >
          {data.hierarchyNode.childrenCount} {data.hierarchyNode.childrenLabel}
        </span>

        {canExpand ? (
          <button
            type="button"
            aria-expanded={data.isExpanded}
            onPointerDownCapture={(event) => {
              event.stopPropagation();
            }}
            onMouseDownCapture={(event) => {
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              data.onToggle(id);
            }}
            className={clsx(
              data.isCompact
                ? "nodrag nopan nowheel pointer-events-auto inline-flex h-7 cursor-pointer items-center justify-center rounded-full border px-2.5 text-[10px] font-semibold transition"
                : "nodrag nopan nowheel pointer-events-auto inline-flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 text-[11px] font-semibold transition",
              toneClasses.footerButtonClassName,
            )}
          >
            {data.isExpanded
              ? data.hierarchyNode.collapseLabel
              : data.hierarchyNode.expandLabel}
          </button>
        ) : (
          <span
            className={clsx(
              "font-semibold text-[#9AA8B5]",
              data.isCompact ? "text-[10px]" : "text-[11px]",
            )}
          >
            -
          </span>
        )}
      </div>
    </div>
  );
};

export default AcademicYearStructureFlowNode;
