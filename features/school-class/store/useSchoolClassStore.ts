"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SCHOOL_CLASS_ROWS } from "../constants";
import type { SchoolClassRow } from "../types";

type SchoolClassStore = {
  rows: SchoolClassRow[];
  addRow: (newRow: SchoolClassRow) => void;
  updateRow: (updatedRow: SchoolClassRow) => void;
  deleteRow: (id: number) => void;
};

export const useSchoolClassStore = create<SchoolClassStore>()(
  persist(
    (set) => ({
      rows: SCHOOL_CLASS_ROWS,
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
      name: "school-class-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
