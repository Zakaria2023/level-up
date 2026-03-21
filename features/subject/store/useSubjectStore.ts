"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SUBJECT_ROWS } from "../constants";
import type { SubjectRow } from "../types";

type SubjectStore = {
  rows: SubjectRow[];
  addRow: (newRow: SubjectRow) => void;
  updateRow: (updatedRow: SubjectRow) => void;
  deleteRow: (id: number) => void;
};

export const useSubjectStore = create<SubjectStore>()(
  persist(
    (set) => ({
      rows: SUBJECT_ROWS,
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
      name: "subject-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
