"use client";

import { create } from "zustand";
import { BASIC_INFORMATION_ROWS } from "../constants";
import type { BasicInformationRow } from "../types";

type BasicInformationStore = {
  rows: BasicInformationRow[];
  addRow: (newRow: BasicInformationRow) => void;
  deleteRow: (id: number) => void;
};

export const useBasicInformationStore = create<BasicInformationStore>((set) => ({
  rows: BASIC_INFORMATION_ROWS,
  addRow: (newRow) =>
    set((state) => ({
      rows: [newRow, ...state.rows],
    })),
  deleteRow: (id) =>
    set((state) => ({
      rows: state.rows.filter((row) => row.id !== id),
    })),
}));
