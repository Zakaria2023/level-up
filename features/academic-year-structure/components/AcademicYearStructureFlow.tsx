"use client";

import Dropdown from "@/components/ui/Dropdown";
import type { AcademicYearRow } from "@/features/academic-year/types";
import {
  ReactFlow,
  type NodeTypes
} from "@xyflow/react";
import { useAcademicYearStructureFlow } from "../hooks/useAcademicYearStructureFlow";
import {
  type AcademicYearStructureStageItem
} from "../types";
import AcademicYearStructureFlowNode from "./AcademicYearStructureFlowNode";

const nodeTypes = {
  structureNode: AcademicYearStructureFlowNode,
} satisfies NodeTypes;

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

const AcademicYearStructureFlow = ({
  academicYearOptions,
  selectedAcademicYear,
  selectedAcademicYearId,
  setSelectedAcademicYearId,
  selectedYearSemesterNames,
  stageStructure,
  supervisorLabelMap,
}: AcademicYearStructureFlowProps) => {
  const { t, hierarchyRoot, edges, flowHeight, nodes, fitViewConfig, isMobile, setReactFlowInstance }
    = useAcademicYearStructureFlow(
      stageStructure,
      supervisorLabelMap,
      selectedYearSemesterNames,
      selectedAcademicYearId,
      selectedAcademicYear
    )

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
            fitViewOptions={fitViewConfig}
            onInit={setReactFlowInstance}
            proOptions={{ hideAttribution: true }}
            minZoom={isMobile ? 0.2 : 0.45}
            maxZoom={isMobile ? 1.2 : 1.5}
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
