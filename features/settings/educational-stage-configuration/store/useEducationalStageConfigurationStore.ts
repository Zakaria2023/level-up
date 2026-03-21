"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EDUCATIONAL_STAGE_CONFIGURATION_ROWS } from "../constants";
import type { EducationalStageConfigurationRow } from "../types";

type EducationalStageConfigurationStore = {
  rows: EducationalStageConfigurationRow[];
  addRow: (newRow: EducationalStageConfigurationRow) => void;
  updateRow: (updatedRow: EducationalStageConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

const normalizeRow = (
  row: Partial<EducationalStageConfigurationRow> & {
    id: number;
    stageName?: string;
    requiredEnrollmentAge?: number;
    gradeCategory?: string;
  },
): EducationalStageConfigurationRow => ({
  id: row.id,
  academicYearId: row.academicYearId ?? 1,
  stageName: row.stageName ?? "",
  requiredEnrollmentAge: row.requiredEnrollmentAge ?? 6,
  teachingLanguage: row.teachingLanguage ?? row.gradeCategory ?? "",
  isMixedStage: row.isMixedStage ?? false,
});

export const useEducationalStageConfigurationStore =
  create<EducationalStageConfigurationStore>()(
    persist(
      (set) => ({
        rows: EDUCATIONAL_STAGE_CONFIGURATION_ROWS,
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
        name: "educational-stage-configuration-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          rows: state.rows,
        }),
        merge: (persistedState, currentState) => {
          const typedState = persistedState as Partial<EducationalStageConfigurationStore>;

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
