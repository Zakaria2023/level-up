"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SCHOOL_SECTION_CONFIGURATION_ROWS } from "../constants";
import type { SchoolSectionConfigurationRow } from "../types";

type SchoolSectionConfigurationStore = {
  rows: SchoolSectionConfigurationRow[];
  addRow: (newRow: SchoolSectionConfigurationRow) => void;
  updateRow: (updatedRow: SchoolSectionConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

export const useSchoolSectionConfigurationStore =
  create<SchoolSectionConfigurationStore>()(
    persist(
      (set) => ({
        rows: SCHOOL_SECTION_CONFIGURATION_ROWS,
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
        name: "school-section-configuration-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          rows: state.rows,
        }),
      },
    ),
  );
