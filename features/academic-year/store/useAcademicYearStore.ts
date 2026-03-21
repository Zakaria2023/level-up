"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ACADEMIC_YEAR_ROWS } from "../constants";
import type { AcademicYearRow } from "../types";

type AcademicYearStore = {
  rows: AcademicYearRow[];
  addRow: (newRow: AcademicYearRow) => void;
  updateRow: (updatedRow: AcademicYearRow) => void;
  deleteRow: (id: number) => void;
};

export const useAcademicYearStore = create<AcademicYearStore>()(
  persist(
    (set) => ({
      rows: ACADEMIC_YEAR_ROWS,
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
      name: "academic-year-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
