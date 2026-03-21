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
      },
    ),
  );
