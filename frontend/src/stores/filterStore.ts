import { create } from "zustand";
import { TIssuePriorities } from "@/types";

interface FilterStoreState {
    priorityIds: TIssuePriorities[];
    statusIds: string[];
    assigneeIds: string[];
    cycleIds: string[];
    labelIds: string[];
    startDate: string | undefined;
    dueDate: string | undefined;
    search: string;
}

const initialState: FilterStoreState = {
    priorityIds: [],
    statusIds: [],
    assigneeIds: [],
    cycleIds: [],
    labelIds: [],
    startDate: undefined,
    dueDate: undefined,
    search: "",
};

interface FilterStoreActions {
    setFilter: (filter: Partial<FilterStoreState>) => void;
    reset: () => void;
}

type FilterStore = FilterStoreState & FilterStoreActions;

export const useFilterStore = create<FilterStore>((set) => ({
    ...initialState,
    setFilter: (filter: Partial<FilterStoreState>) => set((state) => ({ ...state, ...filter })),
    reset: () => set(initialState),
}));
