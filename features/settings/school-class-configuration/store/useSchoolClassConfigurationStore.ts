"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SCHOOL_CLASS_CONFIGURATION_ROWS } from "../constants";
import type { SchoolClassConfigurationRow } from "../types";

type SchoolClassConfigurationStore = {
  rows: SchoolClassConfigurationRow[];
  addRow: (newRow: SchoolClassConfigurationRow) => void;
  updateRow: (updatedRow: SchoolClassConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

export const useSchoolClassConfigurationStore =
  create<SchoolClassConfigurationStore>()(
    persist(
      (set) => ({
        rows: SCHOOL_CLASS_CONFIGURATION_ROWS,
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
        name: "school-class-configuration-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          rows: state.rows,
        }),
      },
    ),
  );
