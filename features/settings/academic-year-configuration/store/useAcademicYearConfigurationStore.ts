"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ACADEMIC_YEAR_CONFIGURATION_ROWS } from "../constants";
import type { AcademicYearConfigurationRow } from "../types";

type AcademicYearConfigurationStore = {
  rows: AcademicYearConfigurationRow[];
  addRow: (newRow: AcademicYearConfigurationRow) => void;
  updateRow: (updatedRow: AcademicYearConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

export const useAcademicYearConfigurationStore =
  create<AcademicYearConfigurationStore>()(
    persist(
      (set) => ({
        rows: ACADEMIC_YEAR_CONFIGURATION_ROWS,
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
        name: "academic-year-configuration-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          rows: state.rows,
        }),
      },
    ),
  );
