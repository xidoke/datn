import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ColumnStore {
  collapsedColumns: string[];
  toggleColumn: (columnId: string) => void;
  isColumnCollapsed: (columnId: string) => boolean;
}

export const useColumnStore = create<ColumnStore>()(
  persist(
    (set, get) => ({
      collapsedColumns: [],
      toggleColumn: (columnId: string) =>
        set((state) => ({
          collapsedColumns: state.collapsedColumns.includes(columnId)
            ? state.collapsedColumns.filter((id) => id !== columnId)
            : [...state.collapsedColumns, columnId],
        })),
      isColumnCollapsed: (columnId: string) =>
        get().collapsedColumns.includes(columnId),
    }),
    {
      name: "column-store",
    }
  )
);

