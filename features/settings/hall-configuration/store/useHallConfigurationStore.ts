"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { HALL_CONFIGURATION_ROWS } from "../constants";
import type { HallConfigurationRow } from "../types";

type HallConfigurationStore = {
  rows: HallConfigurationRow[];
  addRow: (newRow: HallConfigurationRow) => void;
  updateRow: (updatedRow: HallConfigurationRow) => void;
  deleteRow: (id: number) => void;
};

export const useHallConfigurationStore = create<HallConfigurationStore>()(
  persist(
    (set) => ({
      rows: HALL_CONFIGURATION_ROWS,
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
      name: "hall-configuration-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
