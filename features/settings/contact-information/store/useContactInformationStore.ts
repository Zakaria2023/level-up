"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CONTACT_INFORMATION_ROWS } from "../constants";
import type { ContactInformationRow } from "../types";

type ContactInformationStore = {
  rows: ContactInformationRow[];
  addRow: (newRow: ContactInformationRow) => void;
  updateRow: (updatedRow: ContactInformationRow) => void;
  deleteRow: (id: number) => void;
};

export const useContactInformationStore = create<ContactInformationStore>()(
  persist(
    (set) => ({
      rows: CONTACT_INFORMATION_ROWS,
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
      name: "contact-information-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rows: state.rows,
      }),
    },
  ),
);
