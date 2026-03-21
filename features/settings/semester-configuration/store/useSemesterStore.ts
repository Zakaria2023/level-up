"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEMESTER_ROWS } from "../constants";
import type { SemesterRow } from "../types";

type SemesterStore = {
  rows: SemesterRow[];
  addRow: (newRow: SemesterRow) => void;
  updateRow: (updatedRow: SemesterRow) => void;
  deleteRow: (id: number) => void;
};

export const useSemesterStore = create<SemesterStore>()(
  persist(
    (set) => ({
      rows: SEMESTER_ROWS,
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
      name: "semester-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
