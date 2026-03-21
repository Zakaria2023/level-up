"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { HALL_ROWS } from "../constants";
import type { HallRow } from "../types";

type HallStore = {
  rows: HallRow[];
  addRow: (newRow: HallRow) => void;
  updateRow: (updatedRow: HallRow) => void;
  deleteRow: (id: number) => void;
};

export const useHallStore = create<HallStore>()(
  persist(
    (set) => ({
      rows: HALL_ROWS,
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
      name: "hall-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
