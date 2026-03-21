"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EDUCATIONAL_STAGE_ROWS } from "../constants";
import type { EducationalStageRow } from "../types";

type EducationalStageStore = {
  rows: EducationalStageRow[];
  addRow: (newRow: EducationalStageRow) => void;
  updateRow: (updatedRow: EducationalStageRow) => void;
  deleteRow: (id: number) => void;
};

const normalizeRow = (
  row: Partial<EducationalStageRow> & {
    id: number;
    stageName?: string;
    requiredEnrollmentAge?: number;
    gradeCategory?: string;
  },
): EducationalStageRow => ({
  id: row.id,
  academicYearId: row.academicYearId ?? 1,
  stageName: row.stageName ?? "",
  requiredEnrollmentAge: row.requiredEnrollmentAge ?? 6,
  teachingLanguage: row.teachingLanguage ?? row.gradeCategory ?? "",
  isMixedStage: row.isMixedStage ?? false,
});

export const useEducationalStageStore = create<EducationalStageStore>()(
  persist(
    (set) => ({
      rows: EDUCATIONAL_STAGE_ROWS,
      addRow: (newRow) =>
        set((state) => ({
          rows: [newRow, ...state.rows],
        })),
      updateRow: (updatedRow) =>
        set((state) => ({
          rows: state.rows.map((row) =>
            row.id === updatedRow.id ? updatedRow : row,
          ),
        })),
      deleteRow: (id) =>
        set((state) => ({
          rows: state.rows.filter((row) => row.id !== id),
        })),
    }),
    {
      name: "educational-stage-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
      merge: (persistedState, currentState) => {
        const typedState = persistedState as Partial<EducationalStageStore>;

        return {
          ...currentState,
          ...typedState,
          rows: Array.isArray(typedState?.rows)
            ? typedState.rows.map((row) => normalizeRow(row))
            : currentState.rows,
        };
      },
    },
  ),
);
