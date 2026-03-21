"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STUDY_PERIOD_SETTINGS_ROWS } from "../constants";
import type { StudyPeriodSettingsRow } from "../types";

type StudyPeriodSettingsStore = {
  rows: StudyPeriodSettingsRow[];
  addRow: (newRow: StudyPeriodSettingsRow) => void;
  updateRow: (updatedRow: StudyPeriodSettingsRow) => void;
  deleteRow: (id: number) => void;
};

export const useStudyPeriodSettingsStore = create<StudyPeriodSettingsStore>()(
  persist(
    (set) => ({
      rows: STUDY_PERIOD_SETTINGS_ROWS,
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
      name: "study-period-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
