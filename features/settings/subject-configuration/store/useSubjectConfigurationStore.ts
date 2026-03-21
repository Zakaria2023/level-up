"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SUBJECT_CONFIGURATION_ROWS } from "../constants";
import type { SubjectConfigurationRow } from "../types";

type SubjectConfigurationStore = {
  rows: SubjectConfigurationRow[];
  addRow: (newRow: SubjectConfigurationRow) => void;
  updateRow: (updatedRow: SubjectConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

export const useSubjectConfigurationStore = create<SubjectConfigurationStore>()(
  persist(
    (set) => ({
      rows: SUBJECT_CONFIGURATION_ROWS,
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
      name: "subject-configuration-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
