"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BASIC_INFORMATION_ROWS } from "../constants";
import type { BasicInformationRow } from "../types";

type BasicInformationStore = {
  rows: BasicInformationRow[];
  addRow: (newRow: BasicInformationRow) => void;
  updateRow: (updatedRow: BasicInformationRow) => void;
  deleteRow: (id: number) => void;
};

export const useBasicInformationStore = create<BasicInformationStore>()(
  persist(
    (set) => ({
      rows: BASIC_INFORMATION_ROWS,
      addRow: (newRow) =>
        set((state) => ({
          rows: [newRow, ...state.rows],
        })),
      updateRow: (updatedRow) =>
        set((state) => ({
          rows: state.rows.map((row) =>
            row.id === updatedRow.id ? updatedRow : row
          ),
        })),
      deleteRow: (id) =>
        set((state) => ({
          rows: state.rows.filter((row) => row.id !== id),
        })),
    }),
    {
      name: "basic-information-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    }
  )
);
