"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEMESTER_CONFIGURATION_ROWS } from "../constants";
import type { SemesterConfigurationRow } from "../types";

type SemesterConfigurationStore = {
  rows: SemesterConfigurationRow[];
  addRow: (newRow: SemesterConfigurationRow) => void;
  updateRow: (updatedRow: SemesterConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

export const useSemesterConfigurationStore =
  create<SemesterConfigurationStore>()(
    persist(
      (set) => ({
        rows: SEMESTER_CONFIGURATION_ROWS,
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
        name: "semester-configuration-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          rows: state.rows,
        }),
      },
    ),
  );
